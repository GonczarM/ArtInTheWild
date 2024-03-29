import { Container } from 'react-bootstrap';

import MuralList from '../../components/MuralList/MuralList'
import PhotoCarousel from '../../components/PhotoCarousel/PhotoCarousel';

function Home({ murals }){

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