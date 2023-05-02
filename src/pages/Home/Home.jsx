import Logo from '../../assets/artInTheWild.jpg'
import MuralList from '../../components/MuralList/MuralList'
import { Image } from 'react-bootstrap';
import './Home.css'

function Home({ murals }){

  return(
    <>
      <Image fluid rounded src={Logo} alt="logo"/>
      {murals && <MuralList 
        murals={murals} 
        updatedBy={'home'}
      />}
    </>
  )
}

export default Home;