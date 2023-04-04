import { Link } from 'react-router-dom'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';


function Header({isLoggedIn, logoutUser, user}){

	const handleLogout = async () => {
		const logoutResponse = await fetch(
			process.env.REACT_APP_BACKEND_URL + '/users/logout', 
			{
				method: "GET",
			}
		)
		if(logoutResponse.status !== 200){
			throw Error(logoutResponse.statusText)
		}else{
			logoutUser()
		}
	}

	return (
		<Navbar>
			<Navbar.Brand as={Link} to="/">Art in the Wild</Navbar.Brand>
			{isLoggedIn ? 
			<Nav className="me-auto">
				<Nav.Link as={Link} to="/">Home</Nav.Link>
				<Nav.Link as={Link} to="search">Search</Nav.Link>
				<Nav.Link as={Link} to="createMural">Create Mural</Nav.Link>
				<Nav.Link as={Link} to={user.username}>{user.username}</Nav.Link>
				<Nav.Link onClick={handleLogout}>Logout</Nav.Link>
			</Nav>
			:
			<Nav className="me-auto">
				<Nav.Link as={Link} to="/">Home</Nav.Link>
				<Nav.Link as={Link} to="search">Search</Nav.Link>
				<Nav.Link as={Link} to="register">Register</Nav.Link>
				<Nav.Link as={Link} to="login">Login</Nav.Link>
			</Nav>
			}
		</Navbar>
	);
}

export default Header;