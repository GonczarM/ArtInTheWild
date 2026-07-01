'use client';

import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { Carousel, Spinner } from 'react-bootstrap';

import { getMuralsWithPhoto } from '../../utils/murals-api';
import { MuralDispatchContext } from '../../utils/contexts';
import { getFavoritePhoto } from '../../utils/mural-helpers';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

const Logo = '/artInTheWild.jpg';

function PhotoCarousel() {

  const [murals, setMurals] = useState(null)
  const [imgLoading, setImgLoading] = useState(true)
  const [error, setError] = useState('')

  const dispatch = useContext(MuralDispatchContext)

	const router = useRouter()

  useEffect(() => {
    getMurals()
  }, [])

	const handleClick = (mural) => {
		if(!mural.documentId) return // the prepended logo slide isn't a real mural
		dispatch({
      type: 'changed',
      mural: {...mural, updatedBy:'home'}
    })
		router.push(`/mural/home/${mural.documentId}`)
	}

  const getMurals = async () => {
    try{
      const muralsResponse = await getMuralsWithPhoto()
      const muralsWithImage = muralsResponse.murals.map((mural) => ({
        ...mural,
        image: getFavoritePhoto(mural)?.photo?.url,
      }))
      muralsWithImage.unshift({image: Logo})
      setMurals(muralsWithImage)
    }catch{
      setError('Could not get murals. Please try again')
    }
  }

  return (
    <>
      {error && <ErrorMessage error={error} setError={setError} />}
      <Carousel>
        {murals && murals.map((mural, i) => (
        <Carousel.Item key={i} onClick={() => handleClick(mural)}>
          <img
            src={mural.image}
            onLoad={() => setImgLoading(false)}
            style={{ display: imgLoading ? 'none' : 'block'}}
          />
          {imgLoading && <Spinner style={{ display: 'block', margin: 'auto'}} />}
          <Carousel.Caption>
            <h3>{mural.title}</h3>
            {mural.artist && <p>{mural.artist}</p>}
          </Carousel.Caption>
        </Carousel.Item>
        ))}
      </Carousel>
    </>
  );
}

export default PhotoCarousel;
