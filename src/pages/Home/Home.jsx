import Logo from '../../assets/artInTheWild.jpg'
import React, { useEffect, useState } from 'react';
import MuralList from '../../components/MuralList/MuralList'
import * as muralsAPI from '../../utils/murals-api'

function Home({updateMural}){

  const [murals, setMurals] = useState(null)

  useEffect(() => {
    getMurals()
  }, [])

  const getMurals = async () => {
    const APIMurals = await muralsAPI.getMuralAPI()
    setMurals(APIMurals)
  }

  return(
    <div className="home">
      {/* <img src={Logo} alt="logo"/> */}
      {murals && <MuralList murals={murals} updateMural={updateMural} />}
    </div>
  )
}
export default Home;