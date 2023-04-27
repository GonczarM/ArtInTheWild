import { useState } from 'react'
import { Form, Button, Container } from 'react-bootstrap'
import { signUp } from '../../utils/users-service'

const initialUser = {
	username: '',
	password: ''
}

function Register({loginUser}){
	
	const [form, setForm] = useState(initialUser)

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
		catch(error){
			return error
		}
	}

	return(
		<Container>
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