import React from 'react';
import './App.css';
import HomeContainer from './Murals/HomeContainer';
import Login from './Users/Login';
import Header from './Header'
import CreateMural from './Murals/CreateMural'
import Register from './Users/Register'
import { Route, Link, Switch, Redirect } from 'react-router-dom'

const My404 = () => {
  return(
    <div>
      You Are Lost
    </div>
  )
}

class App extends React.Component {
  constructor(){
    super();
    this.state = {
      murals: []
    }
  }

  addMural = async (mural, event) => {
    event.preventDefault()
    try{
      const createdMural = await fetch('http://localhost:9000/murals', {
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify(mural),
        headers:{
          'Content-Type': 'application/json'
        }
      })
      if(createdMural.status !== 200){
        throw Error(createdMural.statusText)
      }
      const parsedResponse = await createdMural.json()
      this.setState({
        murals: [...this.state.murals, parsedResponse.mural]
      })
      //redirect to home page...
    }
    catch(error){
      console.log(error);
      return error
    }
  }

  render(){
    return (
      <main>
        <Header/>
        <Switch>
          <Route exact path="/murals/home" render={(props) => 
          <HomeContainer {...props} murals={this.state.murals} />} />
          <Route exact path="/murals/new" render={(props) => 
          <CreateMural {...props} addMural={this.addMural} />} />
          <Route exact path="/users/user/login" component={ Login } />
          <Route exact path="/users" component={ Register } />
          <Route component={My404} />
        </Switch>
      </main>
    );
  }
}

export default App;
