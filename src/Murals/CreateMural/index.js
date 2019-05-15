import React from 'react';

class CreateMural extends React.Component {
	constructor(props){
		super(props);
		this.state = {
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

	updateMural = (event) => {
		this.setState({
			[event.currentTarget.name]: event.currentTarget.value
		})
	}

	render(){
		return(
			<form onSubmit={this.props.addMural.bind(null, this.state)}>
				<label>
					Title:
					<input 
						type="text" 
						name="title"
						onChange={this.updateMural}
					/>
				</label>
				<br/>
				<label>
					Artist:
					<input
						type="text"
						name="artist"
						onChange={this.updateMural}
					/>
				</label>
				<br/>
				<label>
					Image:
					<input
						type="text"
						name="image"
						onChange={this.updateMural}
					/>
				</label>
				<br/>
				<label>
					Description:
					<input
						type="text"
						name="description"
						onChange={this.updateMural}
					/>
				</label>
				<br/>
				<label>
					Location Description:
					<input
						type="text"
						name="locationDescription"
						onChange={this.updateMural}
					/>
				</label>
				<br/>
				<label>
					Year Installed:
					<input
						type="number"
						name="year"
						onChange={this.updateMural}
					/>
				</label>
				<br/>
				<label>
					Affiliation/Commisioner:
					<input
						type="text"
						name="affiliation"
						onChange={this.updateMural}
					/>
				</label>
				<br/>
				<label>
					Address:
					<input
						type="text"
						name="address"
						onChange={this.updateMural}
					/>
				</label>
				<br/>
				<label>
					Zipcode:
					<input
						type="number"
						name="zipcode"
						onChange={this.updateMural}
					/>
				</label>
				<br/>
				<label>
					Latitude:
					<input
						type="number"
						name="lat"
						onChange={this.updateMural}
					/>
				</label>
				<br/>
				<label>
					Longitude:
					<input
						type="number"
						name="lng"
						onChange={this.updateMural}
					/>
				</label>
				<br/>
				<button>Create Mural</button>
			</form>
		)
	}
}

export default CreateMural;