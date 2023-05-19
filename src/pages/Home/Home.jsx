
import MuralList from '../../components/MuralList/MuralList'
import { Image, Spinner, Container } from 'react-bootstrap';
import { useState } from 'react';
import PhotoCarousel from '../../components/PhotoCarousel/PhotoCarousel';

function Home({ murals }){

  const [imgLoading, setImgLoading] = useState(true)

  return(
    <Container>
      <PhotoCarousel />
      {murals && <MuralList 
        murals={murals} 
        updatedBy={'home'}
      />}
    </Container>
  )
}

export default Home;