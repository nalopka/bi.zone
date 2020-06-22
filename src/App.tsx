import React, { FC } from 'react';

import {
    BrowserRouter as Router,
    Switch,
    Route,
} from 'react-router-dom';

import StartPage from './components/StartPage/StartPage';
import PrimaryPage from './components/PrimaryPage/PrimaryPage';
import GenresProvider from './components/GenresProvider/GenresProvider';

const Core: FC = () => {
    return (
        <GenresProvider>
            <Router>
                <Switch>
                    <Route
                        path="/movies"
                        component={PrimaryPage}
                    />
                    <Route
                        path="/"
                        component={StartPage}
                        exact
                    />
                </Switch>
            </Router>
        </GenresProvider>
    );
};

export default Core;
