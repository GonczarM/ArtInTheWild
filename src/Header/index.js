import React from 'react'
import { Link } from 'react-router-dom'

class Header extends React.Component {
	constructor(props){
		super(props)
		this.handleLoginClick = this.handleLoginClick.bind(this);
    	this.handleLogoutClick = this.handleLogoutClick.bind(this);
    	this.state = {
    		isLoggedIn: false,
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
  		fetch(process.env.REACT_APP_BACKEND_URL + '/users/logout', {
  			method: "GET",
  			credentials: 'include'
  		})
	    this.setState({
	    	isLoggedIn: false
	    });
	}

  	render(){
  		let loginLogout;
  		let registerUser;
  		if (this.state.isLoggedIn) {
     	 	loginLogout = <button onClick=
     	 	{this.handleLogoutClick}>Logout</button>;
     	 	registerUser = <Link to='/users/user'>User</Link>
    	} 
    	else {
      		loginLogout = <Link onClick=
      		{this.handleLoginClick} to='/users/user/login'>Login</Link>
      		registerUser = <Link to='/users'>Register</Link>
    	}
		return(
			<header className="nav">
				<ul>
					<li><Link to='/murals/home'>Home</Link></li>
					<li><Link to='/murals/new'>Create Mural</Link></li>
					<li>{registerUser}</li>
					<li>{loginLogout}</li>
				</ul>
			</header>	
		)
	}
}

export default Header;