import Logo from '../../assets/artInTheWild.jpg'
import MuralList from '../../components/MuralList/MuralList'
import React, { useEffect, useState } from 'react';
import * as muralsAPI from '../../utils/murals-api'
import { Card, Container, Image} from 'react-bootstrap';
import './Home.css'

function Home({updateMural}){

  const [murals, setMurals] = useState([])

  useEffect(() => {
    getMurals()
  }, [])

  const getMurals = async () => {
    const APIMurals = await muralsAPI.getMuralAPI()
    const randomMurals = []
    for (let i = 0; i < 5; i++) {
      const randomMural = getRandomMural(APIMurals)
      randomMurals.push(randomMural)
    }
    setMurals(randomMurals)
  }

  const getRandomMural = (arr) => {
    const ranNum = Math.floor(Math.random()* arr.length)
    const randomMural = arr[ranNum]
    if(!randomMural.artwork_title || !randomMural.artist_credit || !randomMural.description_of_artwork){
      return getRandomMural(arr)
    }else{
      return randomMural
    }
  }

  const cards = murals.map((mural, i) => 
    <Card 
      onClick={() => updateMural(mural)} 
      key={i} bg='secondary' 
      text='white' 
      className='text-center'
    >
      <Card.Body>
        <Card.Title>{mural.artwork_title}</Card.Title>
        <Card.Subtitle>Created By {mural.artist_credit}</Card.Subtitle>
        <Card.Text>
          {mural.description_of_artwork.length > 300 
          ? mural.description_of_artwork.substring(0, 300).concat('...') 
          : mural.description_of_artwork}
        </Card.Text>
      </Card.Body>
    </Card>
  )

  return(
    <>
      <Image fluid rounded src={Logo} alt="logo"/>
      <Container>
        {cards}
      </Container>
    </>
  )
}
export default Home;