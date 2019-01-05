import React, {Component} from 'react';
import Card from "@material/react-card";
import {Headline4, Body1} from '@material/react-typography';
import TextField, {Input} from '@material/react-text-field';
import MaterialIcon from "@material/react-material-icon";
import Button from '@material/react-button';
import gql from "graphql-tag";
import {Mutation, Query} from "react-apollo";
import Logo from '../../shared/img/logo.png';
import LinearProgress from "@material/react-linear-progress";
import { withRouter} from "react-router-dom";
import {AppContext, WHOAMI, client} from "../../shared/App/App";

const START_LOGIN = gql`
  mutation RequestLogin($email: String!) {
    requestLogin(email: $email) {
      loginStatus
      loginStatusToken
    }
  }
`;

const POLL_LOGIN = gql`
  query PollLogin($token: String!) {
    loginStatus(statusToken: $token) {
      loginStatus
    }
  }
`;

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            emailValue: "",
        }
    }

    componentWillMount() {
        this.props.context.setLoginCheck(false);
        client.query({
            query: WHOAMI
        }).then(({data}) => {
            if (data.whoami !== null) {
                this.props.context.setLoginCheck(true);
                this.props.history.push('/');
            }
        });
    }

    render() {
        return (
            <div id="Login">
                <Mutation mutation={START_LOGIN}>
                    {(startLogin, {loading, error, data, called}) => {
                        let validEmail = true;
                        let emailError = false;
                        let emailSent = false;
                        let statusToken = null;
                        if (called && !loading && !error) {
                            if (data.requestLogin.loginStatus === "INVALID_EMAIL") {
                                validEmail = false;
                            } else if (data.requestLogin.loginStatus === "EMAIL_SEND_FAIL") {
                                emailError = true;
                            } else if (data.requestLogin.loginStatus === "EMAIL_SENT") {
                                emailSent = true;
                                statusToken = data.requestLogin.loginStatusToken;
                            }
                        }

                        return (
                            <Card outlined>
                                <img src={Logo} alt=""/>
                                <Headline4>Login</Headline4>
                                {!emailSent ? <React.Fragment>
                                    <Body1>Enter your email and we'll send you a magic link allowing you
                                        to
                                        login</Body1>
                                    {loading && <Body1 tag="div"><LinearProgress indeterminate/></Body1>}
                                    {((error && !loading) || (emailError)) &&
                                    <Body1 className="error">There was an error; please try
                                        again.</Body1>}
                                    {!validEmail &&
                                    <Body1 className="error">That email isn't registered</Body1>}
                                    <TextField label='Email' outlined
                                               leadingIcon={<MaterialIcon icon="email"/>}>
                                        <Input value={this.state.emailValue}
                                               onChange={(e) => this.setState({emailValue: e.target.value})}/>
                                    </TextField>
                                    <Button outlined onClick={() => startLogin({
                                        variables: {
                                            email: this.state.emailValue
                                        }
                                    })}>
                                        Login
                                    </Button>
                                </React.Fragment> : <React.Fragment>
                                    <Query query={POLL_LOGIN} variables={{token: statusToken}}
                                           pollInterval={500}>
                                        {({loading, data, error, stopPolling}) => {
                                            if (!loading && !error) {
                                                if (data.loginStatus.loginStatus === "INVALID_TOKEN") {
                                                    stopPolling();
                                                    return <React.Fragment>
                                                        <Body1>Enter your email and we'll send you a
                                                            magic link
                                                            allowing
                                                            you to
                                                            login</Body1>
                                                        <Body1 className="error">This login has expired,
                                                            please
                                                            request
                                                            a new one.</Body1>
                                                        <TextField label='Email' outlined
                                                                   leadingIcon={<MaterialIcon
                                                                       icon="email"/>}>
                                                            <Input value={this.state.emailValue}
                                                                   onChange={(e) => this.setState({emailValue: e.target.value})}/>
                                                        </TextField>
                                                        <Button outlined onClick={() => startLogin({
                                                            variables: {
                                                                email: this.state.emailValue
                                                            }
                                                        })}>
                                                            Login
                                                        </Button>
                                                    </React.Fragment>;
                                                } else if (data.loginStatus.loginStatus === "AUTHENTICATED") {
                                                    stopPolling();
                                                    this.props.history.push('/');
                                                    this.props.context.setLoginCheck(true);
                                                }
                                            }

                                            return <React.Fragment>
                                                <Body1 tag="div"><LinearProgress indeterminate/></Body1>
                                                <Body1>
                                                    We've sent an email with the magic link. Go to your
                                                    inbox
                                                    and open that link to login, then come back here.
                                                </Body1>
                                            </React.Fragment>;
                                        }}
                                    </Query>
                                </React.Fragment>}
                            </Card>
                        );
                    }}
                </Mutation>
            </div>
        );
    }
}

export default withRouter(React.forwardRef((props, ref) => (
    <AppContext.Consumer>
        {context => <Login {...props} context={context} ref={ref}/>}
    </AppContext.Consumer>
)));