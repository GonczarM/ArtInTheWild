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

  // Prefers a mural with a substantial description, but murals can now be
  // created with a short or no description (loosened schema requirements -
  // see MIGRATION_NOTES.md), so unbounded recursion here could stack-overflow
  // if none happen to qualify. Falls back to any mural after enough tries.
  const getRandomMural = (arr, attemptsLeft = 20) => {
    const ranNum = Math.floor(Math.random()* arr.length)
    const randomMural = arr[ranNum]
    if((randomMural.description?.length || 0) < 100 && attemptsLeft > 0
    ){
      return getRandomMural(arr, attemptsLeft - 1)
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
