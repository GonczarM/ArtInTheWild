import React, { Component } from 'react';

class MuralSearch extends Component {
	constructor(){
		super();
		this.state = {
			searchProperty: '',
			searchTerm: ''
		}
	}

	updateSearch =(event) => {
		this.setState({
			[event.target.name]: event.target.value
		})
	}

	render(){
		return(
			<div>
				<h4>Search</h4>
				<form onSubmit={this.props.searchMurals.bind(null, this.state)}>
					<label>Choose Search Property
						<select name="searchProperty" onChange={this.updateSearch}>
							<option>artist</option>
							<option>affiliation</option>
							<option>zipcode</option>
						</select>
					</label>
					<label> Search
						<input
							type="text"
							name="searchTerm"
							onChange={this.updateSearch}
						/>
					</label>
					<button>Search</button>
				</form>
			</div>
		)
	}
}

export default MuralSearch