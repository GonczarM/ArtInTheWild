import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const initialUser = {
	username: '',
	password: ''
}

function Register({setIsLoggedIn, setUser}){
	const [ form, setForm] = useState(initialUser)

	const navigate = useNavigate()

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
			console.log(parsedResponse)
			if(parsedResponse.session.loggedIn){
				setIsLoggedIn(true)
				setUser(parsedResponse.user)
				navigate('/home')
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