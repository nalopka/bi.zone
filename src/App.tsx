import React, { FC } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

import MainPage from './components/MainPage';
import PrimaryPage from './components/PrimaryPage';

interface Props {
}

const Core: FC<Props> = () => {
    return (
        <Router>
            <Switch>
                <Route
                    path="/movies"
                    component={PrimaryPage}
                />
                <Route
                    path="/"
                    component={MainPage}
                    exact
                >
                </Route>
            </Switch>
        </Router>
    )
}

export default Core;
