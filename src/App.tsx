import './App.css'
import 'semantic-ui-css/semantic.min.css'
import MainPage from './features/main/index'
import {Button, Form, Grid, Header, Image, Message, Segment} from 'semantic-ui-react'

function App() {
    return (
        <div className="App">
            <Grid textAlign='center' style={{height: '100vh'}} verticalAlign='middle'>
                <Grid.Column style={{maxWidth: 450}}>
                    <Header as='h2' color='teal' textAlign='center'>
                        <Image src='/logo.png'/> Typing Game 2
                    </Header>
                    <Segment stacked>
                        <MainPage/>
                    </Segment>
                </Grid.Column>
            </Grid>
        </div>
    )
}

export default App
