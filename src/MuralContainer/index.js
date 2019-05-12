import React, { Component } from 'react';
import Murals from '../MuralsList'

class MuralContainer extends Component {
  constructor(){
    super();
    this.state = {
      murals: []
    }
  }

  componentDidMount(){
    this.getMurals()
  }

  getMurals = async () => {
    try{
      const foundMurals = await fetch('http://localhost:9000/murals/home');
      console.log(foundMurals);
      if(foundMurals.status !== 200){
        throw Error(foundMurals.statusText)
      }
      const muralsParsed = await foundMurals.json();
      this.setState({murals: muralsParsed.murals})
    }
    catch(error){
      console.log(error);
      return error
    }    
  }

  render(){
    return(
      <div>
        <Murals murals={this.state.murals}/>
      </div>
    )
  }
}

export default MuralContainer;