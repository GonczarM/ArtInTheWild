import Logo from '../../assets/artInTheWild.jpg'
import MuralList from '../../components/MuralList/MuralList'
import React, { useEffect, useState } from 'react';
import * as muralsAPI from '../../utils/murals-api'
import { Card, Container, Image, Row, Col} from 'react-bootstrap';
import './Home.css'

function Home({updateMural}){

  const [murals, setMurals] = useState([])

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
      <Container>
        <Row xs={1} lg={2}>
        {murals.map((mural, i) => (
          <Col key={i}>
          <Card 
            onClick={() => updateMural(mural)} 
            key={i} bg='secondary' 
            text='white' 
            className='text-center'
          >
            <Card.Body>
              <Card.Title>{mural.artwork_title}</Card.Title>
              <Card.Subtitle>By {mural.artist_credit}</Card.Subtitle>
              <Card.Text>{mural.year_installed}</Card.Text>
              <Card.Subtitle>Description</Card.Subtitle>
              <Card.Text>
                {mural.description_of_artwork.length > 300 
                ? mural.description_of_artwork.substring(0, 300).concat('...') 
                : mural.description_of_artwork}
              </Card.Text>
            </Card.Body>
          </Card>
          </Col>
        ))}
        </Row>
      </Container>
    </>
  )
}
export default Home;