import Home from '../Home/Home';
import Login from '../Login/Login';
import Header from '../../components/Header/Header';
import CreateMural from '../CreateMural/CreateMural';
import Register from '../Register/Register';
import ShowMural from '../ShowMural/ShowMural';
import UserShow from '../UserShow/UserShow';
import MuralSearch from '../MuralSearch/MuralSearch';
import EditMural from '../EditMural/EditMural';
import { Route, Routes, useNavigate} from 'react-router-dom';
import { useState, useEffect } from 'react';
import { UserContext } from '../../utils/contexts';
import * as userService from '../../utils/users-service';
import * as muralsAPI from '../../utils/murals-api'

function App(){

	const [user, setUser] = useState(userService.getUser())
  const [mural, setMural] = useState(null)
  const [murals, setMurals] = useState(null)

  const navigate = useNavigate()

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
    setMurals(randomMurals)
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

  const updateMural = (updatedMural) => {
		setMural(updatedMural)
		navigate(`/mural/${updatedMural.updatedBy}/${updatedMural._id}`)
	}

  const loginUser = (userToLogin) => {
    setUser(userToLogin)
    navigate(`/user/${userToLogin.username}`);
  }

  const logoutUser = () => {
    userService.logOut()
    setUser(null)
    navigate('/')
  }

  const updateMurals = (newMural) => {
    for (let i = 0; i < murals.length; i++) {
      if(murals[i]._id === newMural._id){
        const muralsCopy = [...murals]
        muralsCopy.splice(i, 1, newMural)
        setMurals(muralsCopy)
      }
    }
  }

  return (
    <>
    <UserContext.Provider value={user}>
      <Header 
        logoutUser={logoutUser} 
      />
      <Routes>
        {/* home */}
        <Route path="/" element={<Home 
          updateMural={updateMural}
          murals={murals} 
        />} />
        {/* mural search */}
        <Route path='/search' element={<MuralSearch 
          updateMural={updateMural} 
        /> } />
        {/* mural show */}
        <Route path="/mural/:updatedBy/:muralId" element={<ShowMural 
          mural={mural}
          updateMural={updateMural}
          updateMurals={updateMurals}
        /> } />
        {/* mural create */}
        <Route path="/mural/create" element={<CreateMural 
          updateMural={updateMural}
        /> } />
        {/* mural edit */}
        <Route path="/mural/edit/:updatedBy/:muralId" element={<EditMural 
          mural={mural} 
          updateMural={updateMural}
        /> } />
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
          updateMural={updateMural}
          logoutUser={logoutUser} 
        />} />
      </Routes>
    </UserContext.Provider>
    </>
  );
}

export default App;
