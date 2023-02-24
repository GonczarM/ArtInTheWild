import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function Header({isLoggedIn, setIsLoggedIn, user}){
	
	const handleLoginClick = () => {
		console.log('login button clicked')
  	}

  	const handleLogout = async () => {
  		const logoutResponse = await fetch(
			process.env.REACT_APP_BACKEND_URL + '/users/logout', 
			{
  			method: "GET",
  			}
		)
		if(logoutResponse.status !== 200){
			throw Error(logoutResponse.statusText)
		}
		const logoutParsed = await logoutResponse.json()
		if(logoutParsed.status === 200){
			setIsLoggedIn(false)
		}
	}

	return(
		<header className="nav">
			<ul>
				<li><Link to='/search'>Search</Link></li>
				<li><Link to='/createMural'>Create Mural</Link></li>
				{isLoggedIn ?
				<>
					<li><Link to='user'>{user.username}</Link></li>
					<li onClick={handleLogout}>Logout</li>
				</>
				:
				<> 
					<li><Link to='/register'>Register</Link></li>
					<li><Link to='/login'>Login</Link></li>
				</>
				}
			</ul>
		</header>	
	)
}

export default Header;