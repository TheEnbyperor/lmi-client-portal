import React, {Component} from 'react';
import {BrowserRouter, Route, Switch, Redirect} from "react-router-dom";
import {ApolloProvider} from "react-apollo";
import ApolloClient from "apollo-boost";
import gql from "graphql-tag";

import './App.scss';
import Menu from '../Menu/js/Menu';
import Login from '../../Login/js/Login';
import NotFound from "../../NotFound/js/NotFound";
import Dashboard from "../../Dashboard/js/Dashboard";
import DocumentSigning from "../../DocumentSigning/js/DocumentSigning";

export const AppContext = React.createContext({});

const BASE_TITLE = " | Louise Misell Interiors Client Portal";
export const client = new ApolloClient({
    uri: "http://localhost:8000/graphql/",
    request: async operation => {
        operation.setContext({
            fetchOptions: {
                credentials: 'include'
            }
        });
    }
});


export const WHOAMI = gql`
  query {
    whoami {
      id
    }
  }
`;

class PrimaryRoute extends Component {
    render() {
        const { component: Component, ...rest } = this.props;
        return (
            <Route {...rest} render={props => {return (
                <Menu>
                    <Component {...this.props} />
                </Menu>
            )}} />
        )
    }
}

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            appContext: {
                userDisplayName: "",
                currentTitle: "",
            },
            redirectToLogin: false,
            loginCheckEnabled: true,
        };

        setInterval(this.checkLoggedIn.bind(this), 500);
    }

    setLoginCheck(enabled) {
        if (enabled !== this.state.loginCheckEnabled) {
            this.setState({
                loginCheckEnabled: enabled,
                redirectToLogin: false,
            });
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
        let appContext = this.state.appContext;
        appContext.currentTitle = newTitle;
        document.title = newTitle + BASE_TITLE;
        this.setState({
            appContext: appContext,
        });
    }

    checkLoggedIn() {
        if (this.state.loginCheckEnabled) {
            client.query({
                query: WHOAMI
            }).then(data => {
                if (data.data.whoami === null) {
                    this.setState({
                        redirectToLogin: true,
                    });
                } else {
                    this.setState({
                        redirectToLogin: false,
                    });
                }
            }).catch(() => {
                this.setState({
                    redirectToLogin: true,
                });
            });
        }
    }

    render() {
        return (
            <BrowserRouter>
                <AppContext.Provider value={{
                    data: this.state.appContext,
                    setUserDisplayName: this.setUserDisplayName.bind(this),
                    setCurrentTitle: this.setCurrentTitle.bind(this),
                    setLoginCheck: this.setLoginCheck.bind(this),
                }}>

                    <ApolloProvider client={client}>
                        {this.state.redirectToLogin && <Redirect to="/login"/>}
                        <Switch>
                            <PrimaryRoute path="/" exact component={Dashboard}/>
                            <PrimaryRoute path="/document-signing" component={DocumentSigning}/>
                            <Route path="/login" exact component={Login}/>
                            <Route component={NotFound}/>
                        </Switch>
                    </ApolloProvider>
                </AppContext.Provider>
            </BrowserRouter>
        );
    }
}
