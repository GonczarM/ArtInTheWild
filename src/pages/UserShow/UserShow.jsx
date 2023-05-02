import { useContext, useEffect, useState } from 'react';
import { Button, Card, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import MuralList from '../../components/MuralList/MuralList'
import { UserContext } from '../../utils/contexts';
import * as userAPI from '../../utils/users-api'
import './UserShow.css'

const UserShow = ({ logoutUser }) => {

  const [murals, setMurals] = useState(null)
  const user = useContext(UserContext)

  const navigate = useNavigate()

  useEffect(() => {
    getMurals()
  }, [])

  const getMurals = async () => {
    const userMurals = await userAPI.getUserMurals(user._id)
    if(userMurals.murals.length) setMurals(userMurals.murals)
  }

  const handleDelete = async () => {
    await userAPI.deleteUser(user._id)
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
      {murals ? 
      <MuralList 
        murals={murals} 
        muralArtist={user.username} 
        updatedBy={user.username}
      />
      :
      <>
        <h2 className='text-center'>Looks Like you Don't Have any Murals</h2>
        <Button className='create' onClick={() => navigate('/mural/create')}>Create Mural</Button>
      </>
      }
		</Container>
	)
}

export default UserShow;