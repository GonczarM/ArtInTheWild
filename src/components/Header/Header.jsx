import { Link } from 'react-router-dom'
import { Container, Nav, Navbar } from 'react-bootstrap';


function Header({logoutUser, user}){

	return (
		<Navbar collapseOnSelect expand="sm" bg="primary" variant="dark" sticky="top">
			<Container>
				<Navbar.Brand as={Link} to="/" href='/'>Art in the Wild</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
					<Nav className="me-auto">
						<Nav.Link as={Link} to="/" href='/'>Home</Nav.Link>
						<Nav.Link as={Link} to="/search" href='/search'>Search</Nav.Link>
					{user ?
					<>
						<Nav.Link as={Link} to="/createMural" href='/createMural'>Create Mural</Nav.Link>
						<Nav.Link as={Link} to={user.username} href='/:username'>{user.username}</Nav.Link>
						<Nav.Link onClick={logoutUser} href='/'>Logout</Nav.Link>
					</>
					:
					<>
						<Nav.Link as={Link} to="/register" href='/register'>Register</Nav.Link>
						<Nav.Link as={Link} to="/login" href='/login'>Login</Nav.Link>
					</>
					}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}

export default Header;