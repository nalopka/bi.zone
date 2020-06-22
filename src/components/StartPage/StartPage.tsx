import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';

import { Store } from 'antd/lib/form/interface';
import queryString from 'querystring';
import _ from 'lodash';
import FilterBox from '../FilterBox/FilerBox';
import s from './StartPage.module.css';

interface Props {

}

const StartPage: FC<Props> = () => {
    const history = useHistory();

    const onSelectName = (keyword: string) => {
        history.push({
            pathname: '/movies',
            search: `keyword=${keyword}`,
        });
    };

    const onSearch = (values: Store) => {
        const search = queryString.stringify(_.pickBy(_.omit(values, 'keyword'), _.identity));
        history.push({
            pathname: '/movies',
            search: `${search}`,
        });
    };
    return (
        <div className={s.mainPage}>
            <FilterBox
                onSelectName={onSelectName}
                onSearch={onSearch}
                isMainPage
            />
        </div>
    );
};

export default StartPage;
