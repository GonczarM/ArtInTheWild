'use client';

import { useContext, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Breadcrumb, Container} from 'react-bootstrap'
import Link from 'next/link'

import * as muralsAPI from '../../../../utils/murals-api'
import { MuralContext, MuralDispatchContext, UserContext } from '../../../../utils/contexts'

import AddPhoto from '../../../../components/AddPhoto/AddPhoto'
import PhotoList from '../../../../components/PhotoList/PhotoList'
import MuralCard from '../../../../components/MuralCard/MuralCard'
import ErrorMessage from '../../../../components/ErrorMessage/ErrorMessage'

function ShowMural(){

	const [addPhoto, setAddPhoto] = useState(false);
	const [error, setError] = useState('')
	const { muralId, updatedBy } = useParams()
	const user = useContext(UserContext)
	const mural = useContext(MuralContext)

	const dispatch = useContext(MuralDispatchContext)

	useEffect(() => {
		if(!mural){
			getMural()
		}
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

	const URL = updatedBy === 'home' ? '/'
		: user && updatedBy === user.username ? `/user/${user.username}`
		: `/${updatedBy}`

	return(
		<>
		{error && <ErrorMessage error={error} setError={setError} />}
			{mural && <Container>
				{updatedBy !== 'user' &&
				<Breadcrumb>
					<Breadcrumb.Item linkAs={Link} href={URL}>{updatedBy}</Breadcrumb.Item>
					<Breadcrumb.Item active>{mural.title}</Breadcrumb.Item>
				</Breadcrumb>
				}
				<MuralCard
					mural={mural}
					user={user}
					handleOpen={() => setAddPhoto(true)}
				/>
				{addPhoto && <AddPhoto
					handleClose={() => setAddPhoto(false)}
					addPhoto={addPhoto}
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
