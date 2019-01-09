import React, {Component} from 'react';
import {Headline2, Headline4, Body1} from '@material/react-typography';
import {Cell, Grid, Row} from '@material/react-layout-grid';
import {AppContext} from "../../shared/App/App";

class DocumentSigning extends Component {
    componentDidMount() {
        this.props.context.setCurrentTitle("Document Signing");
    }

    render() {
        return (
            <div id="DocumentSigning">
                <Headline2>To be signed</Headline2>
                <Grid>
                    <Row>
                        <Cell><Headline4>You have no documents to sign</Headline4></Cell>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default React.forwardRef((props, ref) => (
  <AppContext.Consumer>
    {context => <DocumentSigning {...props} context={context} ref={ref}/>}
  </AppContext.Consumer>
));