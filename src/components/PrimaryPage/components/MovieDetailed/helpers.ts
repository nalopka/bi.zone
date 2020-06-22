import _ from 'lodash';

import { Genre } from '../../../FilterBox/interfaces';

export const timeConvert = (time: number) => {
    if (!time) return '';
    const hours = (time / 60);
    const rhours = Math.floor(hours);
    const minutes = (hours - rhours) * 60;
    const rminutes = Math.round(minutes);
    return `${rhours}h ${rminutes}m`;
};

export const showGenres = (genres: Genre[]) => {
    if (_.isEmpty(genres)) return '';
    const genresTitle = _.map(genres, genre => genre.name);
    return _.join(genresTitle, ', ');
};
