import { useEffect, useState } from 'react';
import MuralList from '../../components/MuralList/MuralList'
import * as userAPI from '../../utils/users-api'

const User = ({user, updateMural}) => {

  const [murals, setMurals] = useState(null)

  useEffect(() => {
    async function fetchData(){
      const userMurals = await userAPI.getUserMurals(user._id)
      setMurals(userMurals.murals)
    }
    fetchData()
  }, [])

	return(
		<div>
			Username: <span>{user.username}</span>
      {/* <button onClick={logoutUser}>Delete {user.username}</button> */}
			{murals && <MuralList murals={murals} updateMural={updateMural} />}
		</div>
	)
}

export default User;