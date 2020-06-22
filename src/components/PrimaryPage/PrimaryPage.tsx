import React, { FC, useContext, useEffect, useState } from 'react';
import queryString from 'query-string';
import { PageHeader, Spin, Empty, Affix } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import _ from 'lodash';
import InfiniteScroll from 'react-infinite-scroller';
import { LoadingOutlined } from '@ant-design/icons';

import { Store } from 'antd/lib/form/interface';

import s from './PrimaryPage.module.css';

import MovieItem from './components/MovieItem';
import { FormValues, MovieInfo } from '../../intefaces';
import MovieDetailed from './components/MovieDetailed';
import { fetchMovies, fetchMoviesByName } from '../../api/api';
import FilterBox from '../FilterBox/FilerBox';
import { GenresContext } from '../GenresProvider/GenresProvider';

const PrimaryPage: FC = () => {
    const genresList = useContext(GenresContext);
    const [ page, setPage ] = useState(1);
    const [ detailedMovieId, setDetailedMovieId ] = useState<number | null>(null);
    const [ visible, setVisible ] = useState(false);
    const [ loading, setLoading ] = useState(false);
    const [ moviesList, setMoviesList ] = useState<MovieInfo[]>([]);

    const history = useHistory();
    const location = useLocation();
    const initialValues: FormValues = queryString.parse(location.search);

    useEffect(() => {
        if (initialValues.keyword) {
            getMoviesByName(initialValues.keyword);
        } else {
            discoverMovies(1, initialValues);
        }
    }, [ genresList ]);

    const onSearch = (values: Store) => {
        const search = queryString.stringify(_.pickBy(_.omit(values, 'keyword'), _.identity));
        history.push({
            pathname: '/movies',
            search: `${search}`,
        });
        discoverMovies(page, values).finally(() => setLoading(false));
    };

    const getMoviesByName = async (keyword: string) => {
        setLoading(true);

        const response = await fetchMoviesByName(keyword);

        setMoviesList(response.results);
        setLoading(false);
    };

    const discoverMovies = async (page: number, requestParams: Store) => {
        setLoading(true);

        const response = await fetchMovies(page, requestParams, genresList);

        setPage(response.page);
        setMoviesList(response.results);
        setLoading(false);
    };

    const loadMoreMovies = async (page: number) => {
        setLoading(true);

        const response = await fetchMovies(page, initialValues, genresList);

        setPage(response.page);
        setMoviesList(_.concat(moviesList, response.results));
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
                        loadMore={loadMoreMovies}
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
