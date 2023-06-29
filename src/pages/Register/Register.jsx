import { useState } from 'react'
import { Form, Button, Container } from 'react-bootstrap'

import { signUp } from '../../utils/users-service'
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'

const initialUser = {
	username: '',
	password: ''
}

function Register({loginUser}){
	
	const [form, setForm] = useState(initialUser)
	const [error, setError] = useState('')

	const handleChange = (event) => {
		setForm({ ...form, [event.target.name]: event.target.value})
	}

	const handleRegister = async (event) => {
		event.preventDefault()
		try{
			const user = await signUp(form)
			setForm(initialUser)
			loginUser(user)
		}
		catch({message}){
			if(message === 'Conflict'){
				setError('This username already exists. Please try again.')
			}else{
				setError('Could not register. Please try again.')
			}
		}
	}

	return(
		<Container>
			{error && <ErrorMessage error={error} setError={setError} />}
			<h1 className='text-center'>Register</h1>
			<Form onSubmit={handleRegister}>
				<Form.Group controlId='username'>
					<Form.Label>Username</Form.Label>
					<Form.Control 
						placeholder='username'
						type="text" 
						name="username"
						value={form.username}
						onChange={handleChange}
						required
					/>
				</Form.Group>
				<Form.Group controlId='password'>
					<Form.Label>Password</Form.Label>
					<Form.Control
						placeholder='password'
						type="password" 
						name="password"
						value={form.password}
						onChange={handleChange}
						required
					/>
				</Form.Group>
				<Button type='submit'>Register</Button>
			</Form>
		</Container>
	)
}

export default Register