import { useContext, useEffect, useState } from 'react';
import { Button, Card, Container, Tab, Tabs } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import MuralList from '../../components/MuralList/MuralList'
import { UserContext } from '../../utils/contexts';
import * as userAPI from '../../utils/users-api'
import './UserShow.css'

const UserShow = ({ logoutUser }) => {

  const [murals, setMurals] = useState(null)
  const [favorites, setFavorites] = useState(null)
  const [key, setKey] = useState('murals')
  const user = useContext(UserContext)

  const navigate = useNavigate()

  useEffect(() => {
    if(!user){
			navigate('/')
		}else{
      getMurals()
    }
  }, [])

  const getMurals = async () => {
    const userMurals = await userAPI.getUserMurals()
    if(userMurals.murals.length) setMurals(userMurals.murals)
    const userFavorites = await userAPI.getUserFavorites()
    if(userFavorites.murals.length) setFavorites(userFavorites.murals)
  }

  const handleDelete = async () => {
    await userAPI.deleteUser()
    logoutUser()
  }

	return(
		<Container>
      {user &&<Card className='text-center'>
        <Card.Body>
          <Card.Title>{user.username}</Card.Title>
          <Button onClick={handleDelete}>Delete {user.username}</Button>
        </Card.Body>
      </Card>}
      <Tabs justify onSelect={(key) => setKey(key)}>
        <Tab eventKey="murals" title="Murals">
          {murals && user ? 
          <MuralList 
            murals={murals} 
            updatedBy={user.username}
          />
          :
          <>
            <h2 className='text-center'>Looks Like you Don't Have any Murals</h2>
            <Button className='create' onClick={() => navigate('/mural/create')}>Create Mural</Button>
          </>
          }
        </Tab>
        <Tab eventKey="favorites" title="Favorites">
          {murals && user ? 
          <MuralList 
            murals={favorites}
            updatedBy={user.username}
          />
          :
          <>
            <h2 className='text-center'>Looks Like you Don't Have any Favorited Murals</h2>
          </>
          }
        </Tab>
      </Tabs>
		</Container>
	)
}

export default UserShow;