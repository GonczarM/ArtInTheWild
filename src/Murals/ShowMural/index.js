import React from 'react'
import { Link } from 'react-router-dom'

class ShowMural extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			Title: this.props.muralShowId.title,
	        Artist: this.props.muralShowId.artist,
	        Image: this.props.muralShowId.image,
	        Description: this.props.muralShowId.description,
	        Location: this.props.muralShowId.locationDescription,
	        Year: this.props.muralShowId.year,
	        Affiliation: this.props.muralShowId.affiliation,
	        Address: this.props.muralShowId.address,
	        Zipcode: this.props.muralShowId.zipcode,
	        Latitude: this.props.muralShowId.lat,
	        Longitude: this.props.muralShowId.lng
		}
	}

	render(){
		return(
			<div>
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
			</div>
		)
	}
}

export default ShowMural;