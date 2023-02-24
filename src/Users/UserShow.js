import React from 'react';
import { useNavigate } from 'react-router-dom';

const User = ({user, setMural}) => {

	const navigate = useNavigate()

	const handleClick = (mural) => {
		setMural(mural)
		navigate('/mural')
	}

	  // deleteUser = async (id, event) => {
  //   console.log('hitting deleteUser');
  //   event.preventDefault()
  //   try{
  //     const deleteUser = await
  //     fetch(process.env.REACT_APP_BACKEND_URL + '/users/user/' + id, {
  //       credentials: 'include',
  //       method: 'DELETE'
  //     })
  //     if(deleteUser.status !== 200){
  //       throw Error(deleteUser.statusText)
  //     }
  //     const parsedResponse = await deleteUser.json()
  //     console.log(parsedResponse);
  //   }
  //   catch(error){
  //     console.log(error);
  //     return error
  //   }
  // }

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