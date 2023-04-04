import React from 'react';
import MuralList from '../Murals/MuralList'

const User = ({user, updateMural, logoutUser}) => {

	const handleDelete = async (event) => {
    try{
      const deleteUser = await
      fetch(process.env.REACT_APP_BACKEND_URL + '/users/user/' + user._id, {
        credentials: 'include',
        method: 'DELETE'
      })
      if(deleteUser.status !== 200){
        throw Error(deleteUser.statusText)
      }else{
        logoutUser()
      }
    }
    catch(error){
      console.log(error);
      return error
    }
  }

	return(
		<div>
			Username: <span>{user.username}</span>
      <button onClick={handleDelete}>Delete {user.username}</button>
			<MuralList murals={user.murals} updateMural={updateMural} />
		</div>
	)
}

export default User;