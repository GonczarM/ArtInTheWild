import Logo from '../Logo/artInTheWild.jpg'
import React, { useEffect, useState } from 'react';
import MuralList from './MuralList'

function Home({updateMural}){

  const [murals, setMurals] = useState([])

  useEffect(() => {
    getMurals()
  }, [])

  const getMurals = async () => {
    try{
      const foundMurals = await 
      fetch('https://data.cityofchicago.org/resource/we8h-apcf.json');
      if(foundMurals.status !== 200){
        throw Error(foundMurals.statusText)
      }
      const muralsParsed = await foundMurals.json();
      setMurals(muralsParsed)
    }
    catch(error){
      console.log(error);
      return error
    }    
  }

  return(
    <div className="home">
      <img src={Logo} alt="logo"/>
      <MuralList murals={murals} updateMural={updateMural} />
    </div>
  )
}
export default Home;