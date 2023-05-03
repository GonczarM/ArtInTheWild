import Logo from '../../assets/artInTheWild.jpg'
import MuralList from '../../components/MuralList/MuralList'
import { Image, Spinner } from 'react-bootstrap';
import './Home.css'
import { useState } from 'react';

function Home({ murals }){

  const [imgLoading, setImgLoading] = useState(true)

  return(
    <>
      <Image 
        fluid 
        rounded 
        src={Logo} 
        onLoad={() => setImgLoading(false)} 
        alt="logo" 
        style={{ display: imgLoading ? 'none' : 'block'}}
      />
      {imgLoading && <Spinner style={{ display: 'block', margin: 'auto'}} />}
      {murals && <MuralList 
        murals={murals} 
        updatedBy={'home'}
      />}
    </>
  )
}

export default Home;