import React, {Component} from 'react';
import {AppContext} from "../../shared/App/App";

class DocumentSigning extends Component {
    componentDidMount() {
        this.props.context.setCurrentTitle("DocumentSigning");
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
    {context => <DocumentSigning {...props} context={context} ref={ref}/>}
  </AppContext.Consumer>
));