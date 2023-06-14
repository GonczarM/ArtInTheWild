import { useContext, useEffect, useRef, useState } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import { UserContext } from '../../utils/contexts';

function Header({ logoutUser }){

	const [toggle, setToggle] = useState(false)
	const navbarRef = useRef(null)
	const user = useContext(UserContext)

	useEffect(() => {
		const handleOutsideClick = (e) => {
			if (toggle && navbarRef.current){
				if(!navbarRef.current.contains(e.target)) {
					setToggle(false);
				}
				const navbarLinks = navbarRef.current.getElementsByClassName('nav-link');
				for (let i = 0; i < navbarLinks.length; i++) {
					if (navbarLinks[i].contains(e.target)) {
						setToggle(false);
						break;
					}
				}
			}
		}
		document.addEventListener('click', handleOutsideClick)
		return () => {
			document.removeEventListener('click', handleOutsideClick)
		}
	}, [toggle])

	const handleToggle = () => {
		setToggle(!toggle)
	}

	return (
		<Navbar 
			expanded={toggle}
			ref={navbarRef}
			collapseOnSelect 
			expand="sm" 
			bg="primary" 
			variant="dark" 
			sticky="top" 
		>
			<Container>
				<LinkContainer to='/'><Navbar.Brand>Art in the Wild</Navbar.Brand></LinkContainer>
        <Navbar.Toggle onClick={handleToggle} />
        <Navbar.Collapse id="responsive-navbar-nav">
					<Nav>
						<LinkContainer to='/'><Nav.Link>Home</Nav.Link></LinkContainer>
						<LinkContainer to='/search'><Nav.Link>Search</Nav.Link></LinkContainer>
						<LinkContainer to={user ? '/mural/create' : '/login'}><Nav.Link>Create Mural</Nav.Link></LinkContainer>
						{user ?
						<>
							<LinkContainer to={`/user/${user.username}`}><Nav.Link>{user.username}</Nav.Link></LinkContainer>
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