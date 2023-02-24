import React from 'react';
import { useNavigate } from 'react-router-dom';

const User = ({user, setMural}) => {

	const navigate = useNavigate()

	const handleClick = (mural) => {
		setMural(mural)
		navigate('/mural')
	}

	const userMurals = user.murals.map((mural) => 
		<li key={mural._id}>
			Title: <button onClick={() => handleClick(mural)}>{mural.title}</button><br/>
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