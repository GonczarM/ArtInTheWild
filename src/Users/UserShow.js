import React from 'react';

const User = ({user}) => {
	const userMurals = user.murals.map((mural) => 
		<li key={mural._id}>
			Title: <span>{mural.title}</span><br/>
			Artist: <span>{mural.artist}</span><br/>
			Location: <span>{mural.locationDescription}</span><br/>
		</li>
	)
	return(
		<div>
			Username: <span>{user.username}</span>
			<ul>{userMurals}</ul>
		</div>
	)
}

export default User;