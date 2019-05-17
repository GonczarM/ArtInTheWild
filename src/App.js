import React from 'react';
import './App.css';
import HomeContainer from './Murals/HomeContainer.js';
import Login from './Users/Login.js';
import Header from './Header'
import CreateMural from './Murals/CreateMural.js'
import Register from './Users/Register.js'
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
  }

  render(){
    return (
      <main>
        <Header/>
        <Switch>
          <Route exact path="/murals/home" component={ HomeContainer } />
          <Route exact path="/murals/new" component={ CreateMural } />
          <Route exact path="/users/user/login" component={ Login } />
          <Route exact path="/users" component={ Register } />
          <Route component={My404} />
        </Switch>
      </main>
    );
  }
}

export default App;