import React, { useState } from 'react'

const initialUser = {
	username: '',
	password: ''
}

function Login({loginUser}){
	const [form, setForm] = useState(initialUser)

	const handleChange = (event) => {
		setForm({ ...form, [event.target.name]: event.target.value})
	}

	const handleLogin = async (event) => {
		event.preventDefault()
		try{
			const loginResponse = await 
			fetch(import.meta.env.VITE_BACKEND_URL + '/users/login', {
				method: 'POST',
				credentials: 'include',
				body: JSON.stringify(form),
				headers:{
					'Content-Type': 'application/json'
				}
			})
			const parsedResponse = await loginResponse.json()
			if(parsedResponse.session.loggedIn){
				loginUser(parsedResponse.user)
			}
		}
		catch(error){
      		console.log(error);
      		return error
    	}
	}

		return(
			<form className="form" onSubmit={handleLogin}>
				<label>
					Username:
					<input 
						type="text" 
						name="username"
						onChange={handleChange}
					/>
				</label>
				<label>
					Password:
					<input 
						type="password" 
						name="password"
						onChange={handleChange}
					/>
				</label>
				<button>Login</button>
			</form>
		)
}

export default Login