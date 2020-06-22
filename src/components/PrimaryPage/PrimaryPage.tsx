import React, { FC, useEffect, useState } from 'react';
import queryString from 'query-string';
import { PageHeader, Spin, Empty, Affix } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import _ from 'lodash';
import InfiniteScroll from 'react-infinite-scroller';
import { LoadingOutlined } from '@ant-design/icons';

import { Store } from 'antd/lib/form/interface';

import s from './PrimaryPage.module.css';

import FilterBox from '../FilterBox';
import MovieItem from './components/MovieItem';
import { MovieInfo } from '../../intefaces';
import MovieDetailed from './components/MovieDetailed';
import { fetchMovies, fetchMoviesByName } from '../../api/api';

interface Props {
}

const PrimaryPage: FC<Props> = () => {
    const [ page, setPage ] = useState(1);
    const [ detailedMovieId, setDetailedMovieId ] = useState<number | null>(null);
    const [ visible, setVisible ] = useState(false);
    const [ loading, setLoading ] = useState(false);
    const [ moviesList, setMoviesList ] = useState<MovieInfo[]>([]);

    const history = useHistory();
    const location = useLocation();
    const initialValues = queryString.parse(location.search);

    useEffect(() => {
        if (initialValues.keyword) {
            getMoviesByName(initialValues.keyword);
        } else {
            discoverMovies(page, true, initialValues);
        }
    }, []);

    const onSearch = (values: Store) => {
        const search = queryString.stringify(_.pickBy(_.omit(values, 'keyword'), _.identity));
        history.push({
            pathname: '/movies',
            search: `${search}`,
        });
        discoverMovies(page, true, values).finally(() => setLoading(false));
    };

    const getMoviesByName = async (keyword: string) => {
        setLoading(true);

        const response = await fetchMoviesByName(keyword);

        setMoviesList(response);
        setLoading(false);
    };

    const discoverMovies = async (page: number, initRequest?: boolean, requestParams?: Store) => {
        setLoading(true);

        const response = await fetchMovies(page, initRequest, requestParams);

        setPage(response.page);
        setMoviesList(initRequest ? response.results : _.concat(moviesList, response.results));
        setLoading(false);
    };

    const showDetailedInfo = (visible: boolean, id: number | null) => {
        setVisible(visible);
        setDetailedMovieId(id);
    };
    const renderMovies = () => {
        if (_.isEmpty(moviesList)) return <Empty />;

        return _.map(moviesList, (movie) => {
            const info = {
                id: movie.id,
                title: movie.title,
                overview: movie.overview,
                rating: movie.vote_average,
                releaseDate: movie.release_date,
                posterPath: movie.poster_path,
            };
            return (
                <MovieItem
                    key={movie.id}
                    info={info}
                    showDetailedInfo={showDetailedInfo}
                />
            );
        });
    };
    return (
        <div>
            <Affix offsetTop={0}>
                <PageHeader
                    className={s.pageHeader}
                    onBack={() => history.push('/')}
                    title="Назад"
                    subTitle="Список фильмов"
                    extra={[
                        <FilterBox
                            key="filter-box"
                            onSelectName={getMoviesByName}
                            onSearch={onSearch}
                            initialValues={initialValues}
                        />
                    ]}
                />
            </Affix>
            <div>
                <Spin
                    spinning={loading}
                    indicator={<LoadingOutlined style={{ fontSize: 24 }} />}

                >
                    <InfiniteScroll
                        initialLoad={false}
                        pageStart={page}
                        loadMore={page => discoverMovies(page, false, initialValues)}
                        hasMore={!_.has(initialValues, 'keyword')}
                        threshold={500}
                    >
                        <div className={s.movieListWrapper}>
                            {renderMovies()}
                        </div>

                    </InfiniteScroll>
                </Spin>
            </div>
            <MovieDetailed
                id={detailedMovieId}
                visible={visible}
                showDetailedInfo={showDetailedInfo}
            />
        </div>
    );
};

export default PrimaryPage;
