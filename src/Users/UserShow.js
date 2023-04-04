import React from 'react';
import { useNavigate } from 'react-router-dom';
import MuralList from '../Murals/MuralList'

const User = ({user, setMural, setIsLoggedIn}) => {

	const navigate = useNavigate()

	const handleClick = (mural) => {
		setMural(mural)
		navigate('/mural')
	}

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
        setIsLoggedIn(false)
        navigate('/')
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
			<MuralList murals={user.murals} setMural={setMural} />
		</div>
	)
}

export default User;