import React, { useState } from 'react'
import { signUp } from '../../utils/users-service'

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
			const user = await signUp(form)
			loginUser(user)
		}
		catch(error){
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