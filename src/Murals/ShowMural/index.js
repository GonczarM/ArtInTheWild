import React from 'react'

class ShowMural extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			Title: this.props.muralObj.title,
	        Artist: this.props.muralObj.artist,
	        Image: this.props.muralObj.image,
	        Description: this.props.muralObj.description,
	        Location: this.props.muralObj.locationDescription,
	        Year: this.props.muralObj.year,
	        Affiliation: this.props.muralObj.affiliation,
	        Address: this.props.muralObj.address,
	        Zipcode: this.props.muralObj.zipcode,
	        Latitude: this.props.muralObj.lat,
	        Longitude: this.props.muralObj.lng
		}
	}

	render(){
		return(
			<div>
				<h4>ShowMural</h4>
				Title: <span>{this.state.Title}</span><br/>
				Artist: <span>{this.state.Artist}</span><br/>
				Image: <span>{this.state.Image}</span><br/>
				Description: <span>{this.state.Description}</span><br/>
				Location: <span>{this.state.Location}</span><br/>
				Year: <span>{this.state.Year}</span><br/>
				Affiliation: <span>{this.state.Affiliation}</span><br/>
				Address: <span>{this.state.Address}</span><br/>
				Zipcode: <span>{this.state.Zipcode}</span><br/>
				Latitude: <span>{this.state.Latitude}</span><br/>
				Longitude: <span>{this.state.Longitude}</span><br/>
				<button onClick={this.props.deleteMural.bind(null, this.props.muralObj._id)}>Delete</button>
				<button onClick={this.props.showEditModal.bind(null, this.props.muralObj._id)}>Edit</button>
			</div>
		)
	}
}

export default ShowMural;