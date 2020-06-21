import React, { FC, useState } from 'react';
import _ from 'lodash';
import axios from 'axios';

import { Button, Form, Input, Select } from 'antd';
import { Store } from 'antd/lib/form/interface';

import s from './FilterBox.module.css';

import { API_KEY, GENRES_LIST } from '../../index';
import { Genres } from './interfaces';
import { mockYears } from './helpers';
import { MovieInfo } from '../../intefaces';

interface Props {
    isMainPage?: boolean,
    initialValues?: Store,

    onSelectName: (keyword: string) => void,
    onSearch: (values: Store) => void,
}

const FilterBox: FC<Props> = ({ isMainPage, initialValues, onSearch, onSelectName }) => {
    const [ form ] = Form.useForm();
    const [ movies, setMovies ] = useState<MovieInfo[]>([]);

    const onNameSearch = _.debounce((search: string = '') => {
        if (!search) setMovies([]);
        if (search.length >= 1) {
            getMoviesByTitle(search);
        } else {
            setMovies([]);
        }
    }, 500);

    const getMoviesByTitle = async (title: string) => {
        const url = 'https://api.themoviedb.org/3/search/movie';
        const params = {
            query: title,
            api_key: API_KEY,
        };
        const { data } = await axios.get(url, { params });
        setMovies(data.results);
    };

    const renderRating = () => {
        const ratings = [ 'от 1', 'от 2', 'от 3', 'от 4', 'от 5', 'от 6', 'от 7', 'от 8', 'от 9' ];
        const ratingOptions = _.map(ratings, (rating) => {
            const ratingValue = _.split(rating, ' ')[1];
            return (
                <Select.Option value={ratingValue} key={rating}>{rating}</Select.Option>
            );
        });
        return (
            <Select
                className={s.filterField}
                allowClear
                placeholder="Выберите рейтинг"
            >
                { ratingOptions }
            </Select>
        );
    };

    const renderYear = () => {
        const years = mockYears();
        const optionsYears = _.map(years, year => (<Select.Option key={year} value={year}>{year}</Select.Option>));
        return (
            <Select
                placeholder="Выберите год"
                className={s.filterField}
                allowClear
            >
                { optionsYears }
            </Select>
        );
    };

    const renderGenres = () => {
        const options = _.map(GENRES_LIST, genre => (<Select.Option value={genre.name} key={genre.id}>{genre.name}</Select.Option>));
        return (
            <Select
                className={s.filterField}
                allowClear
                placeholder="Выберите жанр"
            >
                { options }
            </Select>
        );
    };
    
    const renderNameField = () => {
        const options = _.map(movies, (movie) => {
            const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/original/${movie.poster_path}` : '';
            return (
                <Select.Option key={movie.id} value={movie.title}>
                    <img className={s.posterImg} src={posterUrl} alt="poster logo" />
                    {movie.title}
                </Select.Option>
            );
        });
        
        return (
            <Select
                placeholder="Введите название фильма"
                className={s.input}
                onSearch={onNameSearch}
                onSelect={onSelectName}
                allowClear
                showSearch
            >
                { options }
            </Select>
        );
    };

    return (
        <div className={isMainPage ? s.mainPage : s.main}>
            <Form
                form={form}
                layout={isMainPage ? 'horizontal' : 'inline'}
                className={isMainPage ? s.mainPageForm : s.form}
                name="filter"
                initialValues={initialValues}
                onFinish={onSearch}
            >
                <p>Поиск по названию фильма</p>

                <Form.Item name="keyword" noStyle>
                    { renderNameField() }
                </Form.Item>

                <p>Или найти по параметрам:</p>

                <Input.Group compact className={s.field}>
                    <Form.Item name="genre">
                        { renderGenres() }
                    </Form.Item>

                    <Form.Item name="rating">
                        { renderRating() }
                    </Form.Item>

                    <Form.Item name="year">
                        { renderYear() }
                    </Form.Item>
                </Input.Group>

                <Button
                    htmlType="submit"
                    className={s.button}
                    type="primary"
                >
                    Поиск
                </Button>
            </Form>

        </div>
    );
};

export default FilterBox;