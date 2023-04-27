import { Container, Nav, Navbar } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

function Header({logoutUser, user}){

	return (
		<Navbar 
			collapseOnSelect 
			expand="sm" 
			bg="primary" 
			variant="dark" 
			sticky="top" 
		>
			<Container>
				<LinkContainer to='/home'><Navbar.Brand>Art in the Wild</Navbar.Brand></LinkContainer>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
					<Nav>
						<LinkContainer to='/home'><Nav.Link>Home</Nav.Link></LinkContainer>
						<LinkContainer to='/search'><Nav.Link>Search</Nav.Link></LinkContainer>
						{user ?
						<>
							<LinkContainer to='/mural/create'><Nav.Link>Create Mural</Nav.Link></LinkContainer>
							<LinkContainer to={`/${user.username}`}><Nav.Link>{user.username}</Nav.Link></LinkContainer>
							<Nav.Link onClick={logoutUser}>Logout</Nav.Link>
						</>
						:
						<>
							<LinkContainer to='/register'><Nav.Link>Register</Nav.Link></LinkContainer>
							<LinkContainer to='/login'><Nav.Link>Login</Nav.Link></LinkContainer>
						</>
						}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}

export default Header;