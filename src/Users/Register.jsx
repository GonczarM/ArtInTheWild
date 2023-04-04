import React, { useState } from 'react'

const initialUser = {
	username: '',
	password: ''
}

function Register({loginUser}){
	const [ form, setForm] = useState(initialUser)

	const handleChange = (event) => {
		setForm({ ...form, [event.target.name]: event.target.value})
	}

	const handleRegister = async (event) => {
		event.preventDefault()
		try{
			const registerResponse = await 
			fetch(process.env.REACT_APP_BACKEND_URL + '/users/register', {
				method: 'POST',
				credentials: 'include',
				body: JSON.stringify(form),
				headers:{
					'Content-Type': 'application/json'
				}
			})
			const parsedResponse = await registerResponse.json();
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
			<form className="form" onSubmit={handleRegister}>
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
				<button>Register</button>
			</form>
		)
}

export default Register