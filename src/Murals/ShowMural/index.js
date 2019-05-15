import React from 'react'

const ShowMural = (props) => {
	return(
		<div>
			<h4>Show Mural</h4>
			Title: <span>{props.muralObj.title}</span><br/>
			Artist: <span>{props.muralObj.artist}</span><br/>
			Image: <span>{props.muralObj.image}</span><br/>
			Description: <span>{props.muralObj.description}</span><br/>
			Location: <span>{props.muralObj.locationDescription}</span><br/>
			Year: <span>{props.muralObj.year}</span><br/>
			Affiliation: <span>{props.muralObj.affiliation}</span><br/>
			Address: <span>{props.muralObj.address}</span><br/>
			Zipcode: <span>{props.muralObj.zipcode}</span><br/>
			Latitude: <span>{props.muralObj.lat}</span><br/>
			Longitude: <span>{props.muralObj.lng}</span><br/>
			<button onClick={props.deleteMural.bind(null, props.muralObj._id)}>Delete</button>
			<button onClick={props.showEditModal.bind(null, props.muralObj._id)}>Edit</button>
			<button onClick={props.showUserModal.bind(null, props.muralObj._id)}>User</button>
		</div>
	)
}

export default ShowMural;