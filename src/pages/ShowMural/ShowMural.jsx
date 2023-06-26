import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Breadcrumb, Container} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

import * as muralsAPI from '../../utils/murals-api'
import { MuralContext, MuralDispatchContext, UserContext } from '../../utils/contexts'

import AddPhoto from '../../components/AddPhoto/AddPhoto'
import PhotoList from '../../components/PhotoList/PhotoList'
import MuralCard from '../../components/MuralCard/MuralCard'

function ShowMural({ updateMurals }){

	const [addPhoto, setAddPhoto] = useState(false);
	const [URL, setURL] = useState(null)
	const [error, setError] = useState('')
	const { muralId, updatedBy } = useParams()
	const user = useContext(UserContext)
	const mural = useContext(MuralContext)
	const dispatch = useContext(MuralDispatchContext)

	useEffect(() => {
		if(!mural){
			getMural()
		}
		updateURL()
	}, [mural])

	const getMural = async () => {
		try{
			const mural = await muralsAPI.getMural(muralId)
			dispatch({
				type: 'changed',
				mural: {...mural.mural, updatedBy}
			})
		}catch{
			setError('Could not get mural. Please try again.')
		}
	}

	const updateURL = () => {
		if(updatedBy === 'home') {
			setURL('/')
		} 
		else if(user && updatedBy === user.username){
			setURL(`/user/${user.username}`)
		}
		else{
			setURL(`/${updatedBy}`)
		}
	}

	return(
		<>
			{mural && URL && <Container>
				{updatedBy !== 'user' &&
				<Breadcrumb>
					<LinkContainer to={URL}>
						<Breadcrumb.Item >{updatedBy}</Breadcrumb.Item>
					</LinkContainer>
					<Breadcrumb.Item active>{mural.title}</Breadcrumb.Item>
				</Breadcrumb>
				}
				{error && <p>{error}</p>}
				<MuralCard 
					mural={mural}
					user={user}
					handleOpen={() => setAddPhoto(true)}
				/>
				{addPhoto && <AddPhoto 
					handleClose={() => setAddPhoto(false)} 
					addPhoto={addPhoto} 
					updateMurals={updateMurals} 
				/>}
				{mural.photos && mural.photos.length > 0 && 
					<>
					<h1 className='text-center'>{mural.title} Photos</h1>
					<PhotoList mural={mural} />
					</>
				}
			</Container>}
		</>
	)
}

export default ShowMural;