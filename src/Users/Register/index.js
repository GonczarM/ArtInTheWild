import React, { Component } from 'react'

class Register extends Component {
	constructor(){
		super()
		this.state = {
			username: '',
			password: ''
		}
	}

	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value
		})
	}

	handleRegister = async (event) => {
		event.preventDefault()
		const registerResponse = await fetch('http://localhost:9000/users', {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify(this.state),
			headers:{
				'Content-Type': 'application/json'
			}
		})
		const parsedResponse = await registerResponse.json()
		console.log(parsedResponse);
		if(parsedResponse.session.loggedIn){
			this.props.history.push('/murals/home');
		}
	}

	render(){
		return(
			<form onSubmit={this.handleRegister}>
				<label>
					Username:
					<input 
						type="text" 
						name="username"
						onChange={this.handleChange}
					/>
				</label>
				<label>
					Password:
					<input 
						type="password" 
						name="password"
						onChange={this.handleChange}
					/>
				</label>
				<button>Register</button>
			</form>
		)
	}
}

export default Register