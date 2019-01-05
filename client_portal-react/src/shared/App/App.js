import React, {Component} from 'react';
import {BrowserRouter, Route} from "react-router-dom";

import './App.scss';
import Menu from '../Menu/js/Menu';

export const AppContext = React.createContext({});

const BASE_TITLE = " | Louise Misell Interiors Client Portal";

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            appContext: {
                userDisplayName: "",
                currentTitle: "",
            }
        }
    }

    setUserDisplayName(newName) {
        let appContext = this.state.appContext;
        appContext.userDisplayName = newName;
        this.setState({
            appContext: appContext,
        });
    }

    setCurrentTitle(newTitle) {
        newTitle = newTitle + BASE_TITLE;
        let appContext = this.state.appContext;
        appContext.currentTitle = newTitle;
        document.title = newTitle;
        this.setState({
            appContext: appContext,
        });
    }

    render() {
        return (
            <BrowserRouter>
                <AppContext.Provider value={{
                    data: this.state.appContext,
                    setUserDisplayName: this.setUserDisplayName.bind(this),
                    setCurrentTitle: this.setCurrentTitle.bind(this),
                }}>
                    <Menu>
                        <Route path="/" exact/>
                        <Route path="/document_signing/"/>
                    </Menu>
                </AppContext.Provider>
            </BrowserRouter>
        );
    }
}
