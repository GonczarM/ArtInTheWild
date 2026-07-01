'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Container, Tab, Tabs } from 'react-bootstrap';

import { UserContext, UserActionsContext, AuthCheckedContext } from '../../../utils/contexts';
import * as userAPI from '../../../utils/users-api'
import * as muralsAPI from '../../../utils/murals-api'
import MuralList from '../../../components/MuralList/MuralList'
import ErrorMessage from '../../../components/ErrorMessage/ErrorMessage';

const UserShow = () => {

  const [murals, setMurals] = useState(null)
  const [muralsPage, setMuralsPage] = useState({ page: 1, pageCount: 1 })
  const [favorites, setFavorites] = useState(null)
  const [favoritesPage, setFavoritesPage] = useState({ page: 1, pageCount: 1 })
  const [key, setKey] = useState('murals')
  const [error, setError] = useState('')
  const user = useContext(UserContext)
  const authChecked = useContext(AuthCheckedContext)
  const { logoutUser } = useContext(UserActionsContext)

  const router = useRouter()

  useEffect(() => {
    if(!authChecked) return
    if(!user){
			router.push('/')
		}else{
      getMurals(1)
      getFavorites(1)
    }
  }, [authChecked, user])

  const getMurals = async (page) => {
    try{
      const userMurals = await muralsAPI.getUserMurals(user.id, page)
      if(userMurals.murals.length) setMurals(userMurals.murals)
      setMuralsPage({ page: userMurals.pagination.page, pageCount: userMurals.pagination.pageCount })
    }catch{
      setError('Could not get murals. Please try again.')
    }
  }

  const getFavorites = async (page) => {
    try{
      const userFavorites = await muralsAPI.getUserFavorites(user.id, page)
      if(userFavorites.murals.length) setFavorites(userFavorites.murals)
      setFavoritesPage({ page: userFavorites.pagination.page, pageCount: userFavorites.pagination.pageCount })
    }catch{
      setError('Could not get favorites. Please try again.')
    }
  }

  const handleDelete = async () => {
    try{
      await userAPI.deleteAccount()
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
            page={muralsPage.page}
            pageCount={muralsPage.pageCount}
            onPageChange={getMurals}
          />
          :
          <>
            <h2 className='text-center'>Looks Like you Don&apos;t Have any Murals</h2>
            <Button className='create' onClick={() => router.push('/mural/create')}>Create Mural</Button>
          </>
          }
        </Tab>
        <Tab eventKey="favorites" title="Favorites">
          {favorites && user ?
          <MuralList
            murals={favorites}
            updatedBy={user.username}
            page={favoritesPage.page}
            pageCount={favoritesPage.pageCount}
            onPageChange={getFavorites}
          />
          :
          <>
            <h2 className='text-center'>Looks Like you Don&apos;t Have any Favorited Murals</h2>
          </>
          }
        </Tab>
      </Tabs>
		</Container>
	)
}

export default UserShow;
