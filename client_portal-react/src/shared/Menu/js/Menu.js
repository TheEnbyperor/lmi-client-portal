import React, {Component} from 'react';
import MaterialIcon from '@material/react-material-icon';
import TopAppBar, {TopAppBarFixedAdjust} from '@material/react-top-app-bar';
import Drawer, {DrawerHeader, DrawerContent, DrawerTitle, DrawerSubtitle} from '@material/react-drawer';
import List, {ListItem, ListItemGraphic, ListItemText} from '@material/react-list';
import {withRouter} from "react-router-dom";
import {AppContext} from "../../App/App";

export default withRouter(class Menu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            drawerOpen: false,
            selectedIndex: 0,
        }
    }

    render() {
        return <AppContext.Consumer>
            {appContext => <React.Fragment>
                <Drawer modal open={this.state.drawerOpen} onClose={() => this.setState({drawerOpen: false})}>
                    <DrawerHeader>
                        <DrawerTitle>{appContext.currentTitle}</DrawerTitle>
                        <DrawerSubtitle>q@misell.cymru</DrawerSubtitle>
                    </DrawerHeader>

                    <DrawerContent>
                        <List singleSelection selectedIndex={this.state.selectedIndex}
                              handleSelect={() => this.setState({drawerOpen: false})}>
                            <ListItem onClick={() => {
                                this.props.history.push("/")
                            }}>
                                <ListItemGraphic graphic={<MaterialIcon icon='dashboard'/>}/>
                                <ListItemText primaryText='Dashboard'/>
                            </ListItem>
                            <ListItem onClick={() => {
                                this.props.history.push("/document-signing")
                            }}>
                                <ListItemGraphic graphic={<MaterialIcon icon='assignment'/>}/>
                                <ListItemText primaryText='Document Signing'/>
                            </ListItem>
                        </List>
                    </DrawerContent>
                </Drawer>
                <TopAppBar short title={appContext.currentTitle} navigationIcon={<MaterialIcon
                    icon='menu'
                    onClick={() => this.setState({drawerOpen: !this.state.drawerOpen})}
                />}>
                </TopAppBar>
                <TopAppBarFixedAdjust>{this.props.children}</TopAppBarFixedAdjust>
            </React.Fragment>}
        </AppContext.Consumer>;
    }
});