'use client';

import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';

import * as muralsAPI from '../utils/murals-api'
import MuralList from '../components/MuralList/MuralList'
import PhotoCarousel from '../components/PhotoCarousel/PhotoCarousel';
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';

function Home(){

  const [murals, setMurals] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if(!murals){
      getMurals()
    }
  }, [])

  const getMurals = async () => {
    try{
      const APIMurals = await muralsAPI.getMurals()
      const randomMurals = []
      for (let i = 0; i < 6; i++) {
        const randomMural = getRandomMural(APIMurals.murals)
        randomMurals.push(randomMural)
      }
      setMurals(randomMurals)
    }catch{
      setError('Could not get murals. Please refresh and try again.')
    }
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
    <Container>
      {error && <ErrorMessage error={error} setError={setError} />}
      <PhotoCarousel />
      {murals && <MuralList
        murals={murals}
        updatedBy={'home'}
      />}
    </Container>
  )
}

export default Home;
