import React from 'react'

class Login extends React.Component {
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

	handleLogin = async (event) => {
		event.preventDefault()
		try{
			const loginResponse = await 
			fetch(process.env.REACT_APP_BACKEND_URL + '/users/user/login', {
				method: 'POST',
				credentials: 'include',
				body: JSON.stringify(this.state),
				headers:{
					'Content-Type': 'application/json'
				}
			})
			const parsedResponse = await loginResponse.json()
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
			<form onSubmit={this.handleLogin}>
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
				<button>Login</button>
			</form>
		)
	}
}

export default Login