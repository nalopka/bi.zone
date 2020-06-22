import axios from 'axios';
import _ from 'lodash';
import { Store } from 'antd/lib/form/interface';

import { Genre } from '../components/FilterBox/interfaces';

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

export const fetchMovies = async (page: number, requestParams: Store, genreList: Genre[]) => {
    const { year, rating, genre } = requestParams;
    const genreName = () => {
        const findGenre = _.find(genreList, [ 'name', genre ]);
        return findGenre ? findGenre.id : undefined;
    };

    const url = `${BASE_URL}/discover/movie`;
    const params = {
        api_key: process.env.API_KEY,
        with_genres: genreName(),
        primary_release_year: year,
        sort_by: 'popularity.desc',
        'vote_average.gte': rating,
        page
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

export const getPoster = (url: string | null) => {
    if (_.isNull(url)) return '';
    return `${POSTER_URL}${url}`;
};

export const fetchGenres = async () => {
    const url = `${BASE_URL}/genre/movie/list`;
    const params = {
        api_key: process.env.API_KEY,
    };
    const { data } = await axios.get(url, { params });
    return data;
};
