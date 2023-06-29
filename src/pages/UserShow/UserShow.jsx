import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Container, Tab, Tabs } from 'react-bootstrap';

import { UserContext } from '../../utils/contexts';
import * as userAPI from '../../utils/users-api'
import MuralList from '../../components/MuralList/MuralList'
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';

const UserShow = ({ logoutUser }) => {

  const [murals, setMurals] = useState(null)
  const [favorites, setFavorites] = useState(null)
  const [key, setKey] = useState('murals')
  const [error, setError] = useState('')
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
    try{
      const userMurals = await userAPI.getUserMurals()
      if(userMurals.murals.length) setMurals(userMurals.murals)
      const userFavorites = await userAPI.getUserFavorites()
      if(userFavorites.murals.length) setFavorites(userFavorites.murals)
    }catch{
      setError('Could not get murals. Please try again.')
    }
  }

  const handleDelete = async () => {
    try{
      await userAPI.deleteUser()
      logoutUser()
    }catch({message}){
			if(message === 'Unauthorized'){
				setError('Unauthorized. Please login and try again.')
			}else{
        setError('Could not delete user. Please try again.')
      }
    }
  }

	return(
		<Container>
      {error && <ErrorMessage error={error} setError={setError} />}
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
          {favorites && user ? 
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