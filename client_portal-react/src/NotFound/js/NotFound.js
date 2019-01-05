import React, {Component} from 'react';
import Card from "@material/react-card";
import {Headline4, Body1} from '@material/react-typography';
import Logo from '../../shared/img/logo.png';
import {AppContext} from "../../shared/App/App";
import {Link} from "react-router-dom";

class NotFound extends Component {
    componentDidMount() {
        this.props.context.setCurrentTitle("Not Found");
    }

    render() {
        return (
            <div id="NotFound">
                <Card outlined>
                    <img src={Logo} alt=""/>
                    <Headline4>Not found</Headline4>
                    <Body1>The page you have requested isn't available</Body1>
                    <Body1><Link to="/">← Back to homepage</Link></Body1>
                </Card>
            </div>
        );
    }
}
export default React.forwardRef((props, ref) => (
  <AppContext.Consumer>
    {context => <NotFound {...props} context={context} ref={ref}/>}
  </AppContext.Consumer>
));