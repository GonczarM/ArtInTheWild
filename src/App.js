import React from 'react';
import './App.css';
import MuralContainer from './MuralContainer';
import { Route, Switch } from 'react-router-dom'

const My404 = () => {
  return(
    <div>
      You Are Lost
    </div>
  )
}

const App = () => {
  return (
    <main>
      <Switch>
        <Route exact path="/murals/home" component={ MuralContainer }/>
        <Route component={My404} />
      </Switch>
    </main>
  );
}

export default App;
