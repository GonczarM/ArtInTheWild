import React from 'react'
import { Link } from 'react-router-dom'

class Header extends React.Component {
	constructor(props){
		super(props)
		this.handleLoginClick = this.handleLoginClick.bind(this);
    	this.handleLogoutClick = this.handleLogoutClick.bind(this);
    	this.state = {
    		isLoggedIn: false
    		user: ''
    	};
	}

	handleLoginClick() {
	    this.setState({
	    	isLoggedIn: true
	    });
  	}

  	handleLogoutClick = async () => {
  		const logoutResponse = await 
  		fetch('http://localhost:9000/users/logout', {
  			method: "GET",
  			credentials: 'include'
  		})
	    this.setState({
	    	isLoggedIn: false
	    });
	}

  	render(){
  		let button;
  		let login;
  		let register;
  		if (this.state.isLoggedIn) {
     	 	button = <button onClick=
     	 	{this.handleLogoutClick}>Logout</button>;
    	} 
    	else {
      		button = <Link onClick=
      		{this.handleLoginClick} to='/users/user/login'>Login</Link>
      		register = <Link to='/users'>Register</Link>
      		
      		

    	}
		return(
			<header>
				<ul>
					<li><Link to='/murals/home'>Home</Link></li>
					<li><Link to='/murals/new'>Create Mural</Link></li>
					<li>{button}</li>
					<li>{register}</li>
				</ul>
			</header>	
		)
	}
}

export default Header;