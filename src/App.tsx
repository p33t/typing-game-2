import './App.css'
import 'semantic-ui-css/semantic.min.css'
import MainPage from './features/main/index'
import {Grid, Header, Icon, Image, Modal, Segment} from 'semantic-ui-react'
import React from "react";
import MainConfig from "./features/main/config";
import Scoreboard from "./features/main/component/scoreboard";

function App() {
    const [open, setOpen] = React.useState(false);

    return (
        <div className="App ui container">
            <Grid centered verticalAlign='middle'>
                <Grid.Row>
                    <Grid.Column width={4}/>
                    <Grid.Column width={8}>
                        <Header as='h2' color='teal' textAlign='center'>
                            <Image src='/logo.png'/> Arketyper
                        </Header>
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <div style={{textAlign: 'right'}}>
                            <Modal
                                closeIcon
                                open={open}
                                trigger={<Icon link name='info circle' size='large'/>}
                                onClose={() => setOpen(false)}
                                onOpen={() => setOpen(true)}
                            >
                                <Header>
                                    <Icon name='info circle'/>
                                    Arketyper __APP_VERSION__
                                </Header>
                                <Modal.Content>
                                    <p>
                                        Arketyper is designed to gradually improving typing skill on unfamiliar
                                        keyboards.
                                        See <a
                                        href='https://github.com/p33t/arketyper/blob/master/docs/index.md'>Online
                                        Documentation</a> for more information.
                                    </p>
                                    <p>
                                        This is an open-source project <a href='https://github.com/p33t/arketyper'>hosted
                                        on GitHub</a> and is a <a
                                        href='https://www.freshcode.biz'>freshcode.biz</a> innovation.
                                    </p>
                                </Modal.Content>
                            </Modal>
                        </div>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={4}>
                        <MainConfig/>
                    </Grid.Column>
                    <Grid.Column width={8}>
                        <MainPage/>
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <Scoreboard/>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>
    )
}

export default App
