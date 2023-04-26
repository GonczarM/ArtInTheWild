import Logo from '../../assets/artInTheWild.jpg'
import MuralList from '../../components/MuralList/MuralList'
import React, { useEffect, useState } from 'react';
import * as muralsAPI from '../../utils/murals-api'
import {Image} from 'react-bootstrap';
import './Home.css'

function Home({updateMural}){

  const [murals, setMurals] = useState(null)

  useEffect(() => {
    getMurals()
  }, [])

  const getMurals = async () => {
    const APIMurals = await muralsAPI.getMuralAPI()
    const randomMurals = []
    for (let i = 0; i < 6; i++) {
      const randomMural = getRandomMural(APIMurals)
      randomMurals.push(randomMural)
    }
    setMurals(randomMurals)
  }

  const getRandomMural = (arr) => {
    const ranNum = Math.floor(Math.random()* arr.length)
    const randomMural = arr[ranNum]
    if(!randomMural.artwork_title || !randomMural.artist_credit || !randomMural.description_of_artwork || randomMural.description_of_artwork.length < 100){
      return getRandomMural(arr)
    }else{
      return randomMural
    }
  }

  return(
    <>
      <Image fluid rounded src={Logo} alt="logo"/>
      {murals && <MuralList murals={murals} updateMural={updateMural}/>}
    </>
  )
}
export default Home;