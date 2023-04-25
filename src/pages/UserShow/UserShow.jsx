import { useEffect, useState } from 'react';
import { Button, Card, Container } from 'react-bootstrap';
import MuralList from '../../components/MuralList/MuralList'
import * as userAPI from '../../utils/users-api'

const User = ({user, updateMural, logoutUser}) => {

  const [murals, setMurals] = useState(null)

  useEffect(() => {
    getMurals()
  }, [])

  const getMurals = async () => {
    const userMurals = await userAPI.getUserMurals(user._id)
    if(userMurals.murals.length) setMurals(userMurals.murals)
  }

  const handleDelete = async () => {
    const deleteRes = await userAPI.deleteUser(user._id)
    logoutUser()
  }

	return(
		<Container>
      <Card className='text-center'>
        <Card.Body>
          <Card.Title>{user.username}</Card.Title>
          <Button onClick={handleDelete}>Delete {user.username}</Button>
        </Card.Body>
      </Card>
      {murals && <MuralList murals={murals} updateMural={updateMural} listHeader={user.username} />}
		</Container>
	)
}

export default User;