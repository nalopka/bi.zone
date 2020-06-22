import React, { FC, useEffect, useState } from 'react';
import { fetchGenres } from '../../api/api';
import { Genre } from '../FilterBox/interfaces';

export const GenresContext = React.createContext<Genre[]>([]);
const GenresProvider: FC = ({ children }) => {
    const [ genres, setGenres ] = useState<Genre[]>([]);
    const getGenres = async () => {
        const response = await fetchGenres();
        setGenres(response.genres);
    };

    useEffect(() => {
        getGenres();
    }, []);
    return (
        <GenresContext.Provider value={genres}>
            {children}
        </GenresContext.Provider>
    );
};
export default GenresProvider;
