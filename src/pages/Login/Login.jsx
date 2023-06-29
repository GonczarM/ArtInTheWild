import { useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'

import { login } from '../../utils/users-service'
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'

const initialUser = {
	username: '',
	password: ''
}

function Login({loginUser}){
	
	const [form, setForm] = useState(initialUser)
	const [error, setError] = useState('')

	const handleChange = (event) => {
		setForm({ ...form, [event.target.name]: event.target.value})
	}

	const handleLogin = async (event) => {
		event.preventDefault()
		try{
			const user = await login(form)
			setForm(initialUser)
			loginUser(user)
		}
		catch({message}){
			if(message === 'Conflict'){
				setError('Incorrect username or password. Please try again.')
			}else{
      	setError('Could not login. Please try again.')
			}
    }
	}

	return(
		<Container >
			{error && <ErrorMessage error={error} setError={setError} />}
			<h1 className='text-center'>Login</h1>
			<Form onSubmit={handleLogin}>
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
				<Button type='submit'>Login</Button>
			</Form>
		</Container>
	)
}

export default Login