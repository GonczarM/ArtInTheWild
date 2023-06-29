import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel, Spinner } from 'react-bootstrap';

import { getMuralsWithPhoto } from '../../utils/murals-api';
import { MuralDispatchContext } from '../../utils/contexts';
import Logo from '../../assets/artInTheWild.jpg'
import ErrorMessage from '../ErrorMessage/ErrorMessage';

function PhotoCarousel() {

  const [murals, setMurals] = useState(null)
  const [imgLoading, setImgLoading] = useState(true)
  const [error, setError] = useState('')

  const dispatch = useContext(MuralDispatchContext)
  
	const navigate = useNavigate()
  
  useEffect(() => {
    getMurals()
  }, [])

	const handleClick = (mural) => {
		dispatch({
      type: 'changed',
      mural: {...mural, updatedBy:'home'}
    })
		navigate(`/mural/home/${mural._id}`)
	}

  const getMurals = async () => {
    try{
      const muralsResponse = await getMuralsWithPhoto()
      const muralsWithLogo = [...muralsResponse.murals]
      muralsWithLogo.unshift({favoritePhoto:Logo})
      setMurals(muralsWithLogo)
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
            src={mural.favoritePhoto}
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