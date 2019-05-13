import React, { Component } from 'react';
import Murals from '../MuralsList'
import CreateMural from '../CreateMural'

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

  addMural = async (mural, event) => {
    event.preventDefault()
    try{
      const createdMural = await fetch('http://localhost:9000/murals/', {
        method: 'POST',
        body: JSON.stringify(mural),
        headers:{
          'Content-Type': 'application/json'
        }
      })
      console.log(createdMural);
      const parsedResponse = await createdMural.json()
      this.setState({
        murals: [...this.state.murals, parsedResponse.mural]
      })
    }
    catch(error){
      console.log(error);
      return error
    }
  }

  render(){
    return(
      <div>
        <CreateMural addMural={this.addMural}/>
        <Murals murals={this.state.murals}/>
      </div>
    )
  }
}

export default MuralContainer;