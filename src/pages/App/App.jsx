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
import { useState } from 'react';
import { Container } from 'react-bootstrap';
import * as userService from '../../utils/users-service';
import './App.css'

function App(){

	const [user, setUser] = useState(userService.getUser())
  const [mural, setMural] = useState(null)

  const navigate = useNavigate()

  const updateMural = (mural) => {
		setMural(mural)
		navigate(`/mural/${mural._id || mural.mural_registration_id}`)
	}

  const loginUser = (user) => {
    setUser(user)
    navigate('/');
  }

  const logoutUser = () => {
    userService.logOut()
    setUser(null)
    navigate('/')
  }

  return (
    <>
      <Header 
        logoutUser={logoutUser} 
        user={user} 
      />
      <Routes>
        {/* home */}
        <Route path="/" element={<Home 
          updateMural={updateMural} 
        />} />
        {/* mural search */}
        <Route path='/search' element={<MuralSearch 
          updateMural={updateMural} 
        /> } />
        {/* mural show */}
        <Route path="/mural/:muralId" element={<ShowMural 
          mural={mural}
          user={user} 
        /> } />
        {/* mural create */}
        <Route path="/createMural" element={<CreateMural 
          updateMural={updateMural} 
        /> } />
        {/* mural edit */}
        <Route path="/editMural" element={<EditMural 
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
        <Route path="/:username" element={<UserShow 
          user={user} 
          updateMural={updateMural}
          logoutUser={logoutUser} 
        />} />
      </Routes>
    </>
  );
}

export default App;
