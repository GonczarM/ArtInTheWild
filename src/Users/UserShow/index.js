import React from 'react';

const User = (props) => {
	const userMurals = props.userObj.user.murals.map((mural) => 
		<li key={mural._id}>
			Title: <span>{mural.title}</span><br/>
			Artist: <span>{mural.artist}</span><br/>
			Image: <span>{mural.image}</span><br/>
			Location: <span>{mural.locationDescription}</span><br/>
			Address: <span>{mural.address}</span><br/>
			Zipcode: <span>{mural.zipcode}</span><br/>
		</li>
	)
	return(
		<div>
			<h4>Show User</h4>
			Username: <span>{props.userObj.user.username}</span>
			<ul>{userMurals}</ul>
		</div>
	)
}

export default User;