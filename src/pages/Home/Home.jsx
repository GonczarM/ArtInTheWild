import Logo from '../../assets/artInTheWild.jpg'
import MuralList from '../../components/MuralList/MuralList'
import { useEffect } from 'react';
import { Image } from 'react-bootstrap';
import * as muralsAPI from '../../utils/murals-api'
import './Home.css'

function Home({updateMural, updateMurals, murals}){

  useEffect(() => {
    if(!murals){
      getMurals()
    }
  }, [])

  const getMurals = async () => {
    const APIMurals = await muralsAPI.getMurals()
    const randomMurals = []
    for (let i = 0; i < 6; i++) {
      const randomMural = getRandomMural(APIMurals.murals)
      randomMurals.push(randomMural)
    }
    updateMurals(randomMurals)
  }

  const getRandomMural = (arr) => {
    const ranNum = Math.floor(Math.random()* arr.length)
    const randomMural = arr[ranNum]
    if(randomMural.description.length < 100
    ){
      return getRandomMural(arr)
    }else{
      return randomMural
    }
  }

  return(
    <>
      <Image fluid rounded src={Logo} alt="logo"/>
      {murals && <MuralList 
        murals={murals} 
        updateMural={updateMural} 
        updatedBy={'home'}
      />}
    </>
  )
}
export default Home;