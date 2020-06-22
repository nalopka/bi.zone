import React, { FC, useEffect, useState } from 'react';
import { Drawer, Spin } from 'antd';
import _ from 'lodash';
import { LoadingOutlined } from '@ant-design/icons';

import s from './MovieDetailed.module.css';
import { MovieInfo } from './interfaces';
import { showGenres, timeConvert } from './helpers';
import { fetchDetailedInfo, getPoster } from '../../../../api/api';

interface Props {
    id: number | null,
    visible: boolean,
    showDetailedInfo: (visible: boolean, id: number | null) => void,
}

const MovieDetailed: FC<Props> = ({ visible, showDetailedInfo, id }) => {
    const [ loading, setLoading ] = useState(false);
    const [ info, setInfo ] = useState<MovieInfo | undefined>(undefined);

    useEffect(() => {
        if (!_.isNull(id)) {
            setLoading(true);
            getDetailedMovieInfo(id)
                .finally(() => setLoading(false));
        }
    }, [ id ]);

    const getDetailedMovieInfo = async (id: number) => {
        const response = await fetchDetailedInfo(id);
        setInfo(response);
    };

    const onClose = () => {
        setInfo(undefined);
        showDetailedInfo(false, null);
    };

    const renderDrawerBody = () => {
        if (!info) return null;
        const posterUrl = getPoster(info.poster_path);
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
