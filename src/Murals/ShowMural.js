import React from 'react'
// import EditMural from './EditMural'

function ShowMural({ mural }){


//   deleteMural = async (id, event) => {
//     event.preventDefault()
//     try{
//       const deleteMural = await 
//       fetch(process.env.REACT_APP_BACKEND_URL + '/murals/mural/' + id, {
//         credentials: 'include',
//         method: 'DELETE'
//       })
//       if(deleteMural.status !== 200){
//         throw Error(deleteMural.statusText)
//       }
//       const parsedResponse = await deleteMural.json()
//     }
//     catch(error){
//       console.log(error);
//       return error
//     }
//   }


//   updateMural = (event) => {
//   	this.setState({
//   	  mural: {
//   	    ...this.state.mural,
//   	    [event.target.name]: event.target.value
//   	  }
//   	})
//   }

//   editMural = async (event) => {
//     event.preventDefault()
//     try{
//       const editResponse = await 
//       fetch(process.env.REACT_APP_BACKEND_URL + '/murals/mural/' + this.state.muralId, {
//         credentials: 'include',
//         method: 'PUT',
//         body: JSON.stringify(this.state.mural),
//         headers:{
//           'Content-Type': 'application/json'
//         }
//       })
//       if(editResponse.status !== 200){
//         throw Error(editResponse.statusText)
//       }
//       const parsedResponse = await editResponse.json()
//       const editedMuralArray = this.state.murals.map((mural) => {
//         if(mural._id === this.state.muralId){
//           mural.title = parsedResponse.mural.title;
//           mural.artist = parsedResponse.mural.artist;
//           mural.description = parsedResponse.mural.description
//           mural.locationDescription = parsedResponse.mural.locationDescription
//           mural.year = parsedResponse.mural.year
//           mural.affiliation = parsedResponse.mural.affiliation
//           mural.address = parsedResponse.mural.address
//           mural.lat = parsedResponse.mural.lat
//           mural.lng = parsedResponse.mural.lng
//           mural.zipcode = parsedResponse.mural.zipcode
//         }
//         return mural
//       })
//       this.setState({
//         mural: editedMuralArray,
//         showEdit: false
//       })
//     }
//     catch(error){
//       console.log(error);
//       return error
//     }
//   }
	console.log(mural)
	return(
		<div>
			<h2>{mural.title || mural.artwork_title}</h2><br/>
			<h3>{mural.artist || mural.artist_credit}</h3><br/>
			<span>{mural.description || mural.description_of_artwork}</span><br/>
			<span>{mural.year || mural.year_installed}</span><br/>
			<span>{mural.affiliated_or_commissioning}</span><br/>
			<span>{mural.street_address}</span><br/>
		</div>
	)
}

export default ShowMural;