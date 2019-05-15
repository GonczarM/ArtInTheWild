import React, { Component } from 'react';
import Murals from '../MuralsList'
import CreateMural from '../CreateMural'
import EditMural from '../EditMural'
import MuralSearch from '../MuralSearch'
import ShowMural from '../ShowMural'

class MuralContainer extends Component {
  constructor(){
    super();
    this.state = {
      murals: [],
      showEdit: false,
      showMural: false,
      muralShowId: {},
      muralId: '',
      mural: {
        title: '',
        artist: '',
        image: '',
        description: '',
        locationDescription: '',
        year: '',
        affiliation: '',
        address: '',
        zipcode: '',
        lat: '',
        lng: ''
      }
    }
  }

  componentDidMount(){
    this.getMurals()  
  }

  getMurals = async () => {
    try{
      const foundMurals = await fetch('http://localhost:9000/murals/home', {
        credentials: 'include',
        method: 'GET'
      });
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

  searchMurals = async (search, event) => {
    event.preventDefault()
    try{
      const foundMurals = await fetch(`http://localhost:9000/murals/${search.searchProperty}/${search.searchTerm}`, {
        credentials: 'include',
        method: 'GET'
      })
      if(foundMurals.status !== 200){
        throw Error(foundMurals.statusText)
      }
      const muralsParsed = await foundMurals.json()
      this.setState({
        murals: muralsParsed.murals,
        showSearch: true
      })
    }
    catch(error){
      console.log(error);
      return error
    }
  }

  deleteMural = async (id, event) => {
    event.preventDefault()
    try{
      const deleteMural = await fetch('http://localhost:9000/murals/mural/' + id, {
        credentials: 'include',
        method: 'DELETE'
      })
      if(deleteMural.status !== 200){
        throw Error(deleteMural.statusText)
      }
      const parsedResponse = await deleteMural.json()
      this.setState({
        murals: this.state.murals.filter((mural, i) => mural._id !== id)
      })
    }
    catch(error){
      console.log(error);
    }
  }

  showMuralModal = (id, event) => {
    const muralToShow = this.state.murals.find((mural) => mural._id === id)
    this.setState({
      showMural: true,
      muralId: id,
      muralShowId: muralToShow
    })
  }

  showEditModal = (id, event) => {
    const muralToEdit = this.state.murals.find((mural) => mural._id === id)
    this.setState({
      showEdit: true,
      muralId: id,
      mural: muralToEdit
    })
  }

  muralShow = async (event) => {
    event.preventDefault()
    try{
      const showResponse = await fetch('http://localhost:9000/murals/mural/' + this.state.muralId, {
        credentials: 'include',
        methed: 'GET'
      })
      if(showResponse.status !== 200){
        throw Error(showResponse.statusText)
      }
      const muralParsed = await showResponse.json()
      this.setState({
        muralShow: muralParsed.mural,
        showMural: false
      })
    }
    catch(error){
      console.log(error);
    }  
  }

  editMural = async (event) => {
    event.preventDefault()
    try{
      console.log(this.statue.muralId);
      const editResponse = await fetch('http://localhost:9000/murals/mural/' + this.state.muralId, {
        credentials: 'include',
        method: 'PUT',
        body: JSON.stringify(this.state.mural),
        headers:{
          'Content-Type': 'application/json'
        }
      })
      if(editResponse.status !== 200){
        throw Error(editResponse.statusText)
      }
      const parsedResponse = await editResponse.json()
      const editedMuralArray = this.state.murals.map((mural) => {
        if(mural._id === this.state.MuralId){
          mural.title = parsedResponse.mural.title;
          mural.artist = parsedResponse.mural.artist;
          mural.description = parsedResponse.mural.description
          mural.locationDescription = parsedResponse.mural.locationDescription
          mural.year = parsedResponse.mural.year
          mural.affiliation = parsedResponse.mural.affiliation
          mural.address = parsedResponse.mural.address
          mural.lat = parsedResponse.mural.lat
          mural.lng = parsedResponse.mural.lng
          mural.zipcode = parsedResponse.mural.zipcode
        }
        return mural
      })
      this.setState({
        mural: editedMuralArray,
        showEdit: false
      })
    }
    catch(error){
      console.log(error);
    }
  }

  updateMural = (event) => {
    this.setState({
      mural: {
        ...this.state.muralToEdit,
        [event.target.name]: event.target.value
      }
    })
  }

  render(){
    let edit;
    let mural;
    let search = <MuralSearch
            searchMurals={this.searchMurals}
          />
    let list = <Murals 
            murals={this.state.murals} 
            deleteMural={this.deleteMural}
            showModal={this.showModal}
          />
    if(this.state.showEdit){
      edit = <EditMural 
          editMural={this.editMural} 
          updateMural={this.updateMural} 
          muralToEdit={this.state.muralToEdit}
        />
      search = ''
      list = ''
    }
    if(this.state.showMural){
      mural = <ShowMural 
          muralShowId={this.state.muralShowId}
          muralShow={this.muralShow}
        />
        list = '' 
    }
    return(
      <div>
        {edit}
        {search}
        {mural}
        {list}
      </div>
    )
  }
}

export default MuralContainer;