import React, { FC, useState } from 'react';
import { Drawer, Rate } from 'antd';

import s from './MovieItem.module.css';

interface MovieBasket {
    id: number,
    title: string,
    overview: string,
    rating: number,
    releaseDate: string,
    posterPath: string | null,
}

interface Props {
    info: MovieBasket,

    showDetailedInfo: (visible: boolean, id: number) => void;
}

const MovieItem: FC<Props> = ({ info, showDetailedInfo }) => {
    const { id, title, overview, rating, releaseDate, posterPath } = info;

    return (
        <div
            onClick={() => showDetailedInfo(true, id)}
            className={s.movieItem}
        >
            <h2>{title}</h2>
            <p>{`Дата релиза: ${releaseDate}`}</p>
            <div className={s.main}>
                <img
                    className={s.poster}
                    src={`https://image.tmdb.org/t/p/original/${posterPath}`}
                    alt="Movie poster"
                />
                <p className={s.about}>{`О фильме: ${overview}`}</p>
            </div>
            <div>
                <span>Рейтинг: </span>
                <Rate count={1} value={1} />
                <span>
                    {rating}
                </span>
            </div>
        </div>
    );
};

export default MovieItem;
