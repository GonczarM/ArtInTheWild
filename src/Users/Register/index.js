import React from 'react'

class Register extends React.Component {
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
		try{
			const registerResponse = await 
			fetch(process.env.REACT_APP_BACKEND_URL + '/users', {
				method: 'POST',
				credentials: 'include',
				body: JSON.stringify(this.state),
				headers:{
					'Content-Type': 'application/json'
				}
			})
			const parsedResponse = await registerResponse.json();
			if(parsedResponse.session.loggedIn){
				this.props.history.push('/murals/home');
			}
		}
		catch(error){
			console.log(error);
			return error
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