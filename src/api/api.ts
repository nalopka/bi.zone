import axios from 'axios';
import _ from 'lodash';
import { Store } from 'antd/lib/form/interface';

import { GENRES_LIST } from '../index';

const BASE_URL = 'https://api.themoviedb.org/3';
const POSTER_URL = 'https://image.tmdb.org/t/p/original/';

export const fetchMoviesByName = async (keyword: string) => {
    const url = `${BASE_URL}/search/movie`;
    const params = {
        query: keyword,
        api_key: process.env.API_KEY,
    };
    const { data } = await axios.get(url, { params });
    return data;
};

export const fetchMovies = async (page: number, initRequest?: boolean, requestParams?: Store) => {
    const genre = _.find(GENRES_LIST, _.get(requestParams, 'genre'));
    const url = `${BASE_URL}/discover/movie`;
    const params = {
        api_key: process.env.API_KEY,
        with_genres: genre.id,
        primary_release_year: _.get(requestParams, 'year'),
        sort_by: 'popularity.desc',
        'vote_average.gte': _.get(requestParams, 'rating'),
        page: initRequest ? 1 : page,
    };
    const { data } = await axios.get(url, { params });
    return data;
};

export const fetchDetailedInfo = async (id: number) => {
    const url = `${BASE_URL}/movie/${id}`;
    const params = {
        api_key: process.env.API_KEY,
    };
    const { data } = await axios.get(url, { params });
    return data;
};

export const getPoster = (url?: string | null) => {
    if (_.isNull(url)) return '';
    return `${POSTER_URL}${url}`;
};
