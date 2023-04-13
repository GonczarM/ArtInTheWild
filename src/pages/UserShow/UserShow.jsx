import { useEffect, useState } from 'react';
import MuralList from '../../components/MuralList/MuralList'
import * as userAPI from '../../utils/users-api'

const User = ({user, updateMural, logoutUser}) => {

  const [murals, setMurals] = useState(null)

  useEffect(() => {
    async function fetchData(){
      const userMurals = await userAPI.getUserMurals(user._id)
      setMurals(userMurals.murals)
    }
    fetchData()
  }, [])

  const handleDelete = async () => {
    const deleteRes = await userAPI.deleteUser(user._id)
    logoutUser()
  }

	return(
		<div>
			Username: <span>{user.username}</span>
      <button onClick={handleDelete}>Delete {user.username}</button>
			{murals && <MuralList murals={murals} updateMural={updateMural} />}
		</div>
	)
}

export default User;