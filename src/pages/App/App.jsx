import { useState, useEffect, useReducer } from 'react';
import { Route, Routes, useNavigate} from 'react-router-dom';

import { MuralContext, MuralDispatchContext, UserContext } from '../../utils/contexts';
import * as userService from '../../utils/users-service';
import * as muralsAPI from '../../utils/murals-api'

import Home from '../Home/Home';
import Login from '../Login/Login';
import Header from '../../components/Header/Header';
import CreateMural from '../CreateMural/CreateMural';
import Register from '../Register/Register';
import ShowMural from '../ShowMural/ShowMural';
import UserShow from '../UserShow/UserShow';
import MuralSearch from '../MuralSearch/MuralSearch';
import EditMural from '../EditMural/EditMural';

function muralReducer(mural, action){
  switch (action.type) {
    case 'changed': {
      return(action.mural)
    }
  }
}

function App(){

	const [user, setUser] = useState(userService.getUser())
  const [mural, dispatch] = useReducer(muralReducer, null);
  const [murals, setMurals] = useState(null)
  const [error, setError] = useState('')

  const navigate = useNavigate()

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

  const loginUser = (userToLogin) => {
    setUser(userToLogin)
    navigate(`/user/${userToLogin.username}`);
  }

  const logoutUser = () => {
    try{
      userService.logOut()
      setUser(null)
      navigate('/')
    }catch{
      setError('Could not logout. Please try again.')
    }
  }

  const updateMurals = (newMural) => {
    const nextMurals = murals.map(mural => {
      if(newMural._id === mural._id){
        return newMural
      }else{
        return mural
      }
    })
    setMurals(nextMurals)
  }

  return (
    <>
    <UserContext.Provider value={user}>
    <MuralContext.Provider value={mural}>
    <MuralDispatchContext.Provider value={dispatch}>
      <Header 
        logoutUser={logoutUser} 
      />
      {error && <p>{error}</p>}
      <Routes>
        {/* home */}
        <Route path="/" element={<Home 
          murals={murals} 
        />} />
        {/* mural search */}
        <Route path='/search' element={<MuralSearch /> } />
        {/* mural show */}
        <Route path="/mural/:updatedBy/:muralId" element={<ShowMural 
          updateMurals={updateMurals}
        /> } />
        {/* mural create */}
        <Route path="/mural/create" element={<CreateMural /> } />
        {/* mural edit */}
        <Route path="/mural/edit/:updatedBy/:muralId" element={<EditMural /> } />
        {/* user login */}
        <Route path="/login" element={<Login 
          loginUser={loginUser} 
        /> } />
        {/* user register */}
        <Route path="/register" element={<Register 
          loginUser={loginUser} 
        /> } />
        {/* user show */}
        <Route path="/user/:username" element={<UserShow 
          logoutUser={logoutUser} 
        />} />
      </Routes>
    </MuralDispatchContext.Provider>
    </MuralContext.Provider>
    </UserContext.Provider>
    </>
  );
}

export default App;