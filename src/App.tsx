import './App.css'
import 'semantic-ui-css/semantic.min.css'
import MainPage from './features/main/index'
import {Button, Grid, Header, Icon, Image, Modal, Segment} from 'semantic-ui-react'
import React from "react";

function App() {
    const [open, setOpen] = React.useState(false)
    return (
        <div className="App">
            <Grid textAlign='center' style={{height: '100vh'}} verticalAlign='middle'>
                <Grid.Column style={{maxWidth: 450}}>
                    <Header as='h2' color='teal' textAlign='center'>
                        <Image src='/logo.png'/> Arketyper
                    </Header>
                    <Segment stacked>
                        <MainPage/>
                        <div style={{textAlign: 'right'}}>
                            <Modal
                                closeIcon
                                open={open}
                                trigger={<Icon link name='info circle' size='large'/>}
                                onClose={() => setOpen(false)}
                                onOpen={() => setOpen(true)}
                            >
                                <Header icon='info circle' content='About Arketyper'/>
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
                    </Segment>
                </Grid.Column>
            </Grid>
        </div>
    )
}

export default App
