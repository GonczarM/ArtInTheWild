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
import './App.css'

function App(){

  const [isLoggedIn, setIsLoggedIn] = useState(false)
	const [user, setUser] = useState({})
  const [mural, setMural] = useState({})

  const navigate = useNavigate()

  const updateMural = (mural) => {
		setMural(mural)
		navigate('/mural')
	}

  const loginUser = (user) => {
    setUser(user)
    setIsLoggedIn(true)
    navigate('/');
  }

  const logoutUser = () => {
    setIsLoggedIn(false)
    navigate('/')
  }

  return (
    <Container>
      <Header 
        isLoggedIn={isLoggedIn} 
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
        <Route path="/mural" element={<ShowMural 
          mural={mural} 
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
    </Container>
  );
}

export default App;
