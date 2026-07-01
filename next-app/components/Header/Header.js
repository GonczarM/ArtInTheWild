'use client';

import { useContext, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Container, Nav, Navbar } from 'react-bootstrap';

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
				<Navbar.Brand as={Link} href='/'>Art in the Wild</Navbar.Brand>
        <Navbar.Toggle onClick={handleToggle} />
        <Navbar.Collapse id="responsive-navbar-nav">
					<Nav>
						<Nav.Link as={Link} href='/'>Home</Nav.Link>
						<Nav.Link as={Link} href='/search'>Search</Nav.Link>
						<Nav.Link as={Link} href={user ? '/mural/create' : '/login'}>Create Mural</Nav.Link>
						{user ?
						<>
							<Nav.Link as={Link} href={`/user/${user.username}`}>{user.username}</Nav.Link>
							<Nav.Link onClick={logoutUser}>Logout</Nav.Link>
						</>
						:
						<>
							<Nav.Link as={Link} href='/register'>Register</Nav.Link>
							<Nav.Link as={Link} href='/login'>Login</Nav.Link>
						</>
						}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}

export default Header;
