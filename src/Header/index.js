import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
	return(
		<header>
			<ul>
				<li><Link to='/murals/home'>Home</Link></li>
				<li><Link to='/murals/new'>Create Mural</Link></li>
			</ul>
		</header>	
	)
}

export default Header;