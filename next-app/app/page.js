'use client';

import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';

import * as muralsAPI from '../utils/murals-api'
import MuralList from '../components/MuralList/MuralList'
import PhotoCarousel from '../components/PhotoCarousel/PhotoCarousel';
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';

// Pure, and doesn't touch component state, so it lives at module scope - the
// react-hooks/purity rule flags Math.random() anywhere inside a component
// function body, since it can't prove a locally-defined function is only
// ever invoked outside of render.
//
// Prefers a mural with a substantial description, but murals can now be
// created with a short or no description (loosened schema requirements -
// see MIGRATION_NOTES.md), so unbounded recursion here could stack-overflow
// if none happen to qualify. Falls back to any mural after enough tries.
function getRandomMural(arr, attemptsLeft = 20) {
  const ranNum = Math.floor(Math.random()* arr.length)
  const randomMural = arr[ranNum]
  if((randomMural.description?.length || 0) < 100 && attemptsLeft > 0
  ){
    return getRandomMural(arr, attemptsLeft - 1)
  }else{
    return randomMural
  }
}

function Home(){

  const [murals, setMurals] = useState(null)
  const [error, setError] = useState('')

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

  useEffect(() => {
    if(!murals){
      getMurals()
    }
  }, [])

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
