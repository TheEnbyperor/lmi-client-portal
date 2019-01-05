import React, {Component} from 'react';
import {AppContext} from "../../shared/App/App";

class Dashboard extends Component {
    componentDidMount() {
        this.props.context.setCurrentTitle("Dashboard");
    }

    render() {
        return (
            <div id="Dashboard">
                <h1>Test</h1>
            </div>
        );
    }
}

export default React.forwardRef((props, ref) => (
  <AppContext.Consumer>
    {context => <Dashboard {...props} context={context} ref={ref}/>}
  </AppContext.Consumer>
));