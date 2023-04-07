import React, { useState } from 'react'
import { login } from '../../utils/users-service'

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
			const user = await login(form)
			loginUser(user)
		}
		catch(error){
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