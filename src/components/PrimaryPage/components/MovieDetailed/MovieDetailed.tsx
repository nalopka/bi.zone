import React, { FC, useEffect, useState } from 'react';
import { Drawer, Spin } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import { LoadingOutlined } from '@ant-design/icons';

import s from './MovieDetailed.module.css';
import { API_KEY } from '../../../../index';
import { MovieInfo } from './interfaces';
import { showGenres, timeConvert } from './helpers';

interface Props {
    id: number | null,
    visible: boolean,
    showDetailedInfo: (visible: boolean, id: number | null) => void,
}

const MovieDetailed: FC<Props> = ({ visible, showDetailedInfo, id }) => {
    const [ loading, setLoading ] = useState(false);
    const [ info, setInfo ] = useState<MovieInfo>({});
    useEffect(() => {
        if (!_.isNull(id)) {
            setLoading(true);
            getDetailedMovieInfo(id)
                .finally(() => setLoading(false));
        }
    }, [ id ]);

    const getDetailedMovieInfo = async (id: number) => {
        const url = `https://api.themoviedb.org/3/movie/${id}`;
        const params = {
            api_key: API_KEY,
        };
        const { data } = await axios.get(url, { params });
        setInfo(data);
    };

    const onClose = () => {
        setInfo({});
        showDetailedInfo(false, null);
    };

    const renderDrawerBody = () => {
        const posterUrl = info.poster_path ? `https://image.tmdb.org/t/p/original/${info.poster_path}` : '';
        return (
            <div>
                <Spin
                    spinning={loading}
                    indicator={<LoadingOutlined style={{ fontSize: 24 }} />}
                >
                    <div>
                        <div className={s.top}>
                            <img className={s.poster} src={posterUrl} alt="poster" />
                            <div>
                                <a href={info.homepage}>
                                    <h2>{info.title}</h2>
                                </a>
                                <h4>{info.tagline}</h4>
                                <p>{`Release date: ${info.release_date}`}</p>
                                <p>{`Rating: ${info.vote_average}`}</p>
                                <p>{`Budget: ${info.budget} $`}</p>
                                <p>{`Status: ${info.status}`}</p>
                                <p>{`Time: ${timeConvert(info.runtime)}`}</p>
                                <p>{`Genres: ${showGenres(info.genres)}`}</p>
                            </div>
                        </div>
                        <div
                            className={s.body}
                        >
                            <h3>About:</h3>
                            <p>{info.overview}</p>
                        </div>
                    </div>

                </Spin>
            </div>
        );
    };

    return (
        <Drawer
            width={900}
            visible={visible}
            onClose={() => onClose()}
            closable
            destroyOnClose
            maskClosable
        >
            { renderDrawerBody() }
        </Drawer>
    );
};
export default MovieDetailed;
