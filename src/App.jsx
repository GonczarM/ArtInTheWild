import Home from './Murals/Home';
import Login from './Users/Login';
import Header from './Header'
import CreateMural from './Murals/CreateMural'
import Register from './Users/Register'
import ShowMural from './Murals/ShowMural'
import UserShow from './Users/UserShow'
import MuralSearch from './Murals/MuralSearch';
import EditMural from './Murals/EditMural'
import { Route, Routes, useNavigate} from 'react-router-dom'
import { useState } from 'react';
import { Container } from 'react-bootstrap'

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
    setIsLoggedIn(true)
    setUser(user)
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
        <Route path="/" element={<Home updateMural={updateMural} />} />
        {/* mural search */}
        <Route path='/search' element={<MuralSearch updateMural={updateMural} /> } />
        {/* mural show */}
        <Route path="/mural" element={<ShowMural mural={mural} /> } />
        {/* mural create */}
        <Route path="/createMural" element={<CreateMural updateMural={updateMural} /> } />
        {/* mural edit */}
        <Route path="/editMural" element={<EditMural 
          mural={mural} 
          updateMural={updateMural}
        /> } />
        {/* user login */}
        <Route path="/login" element={<Login loginUser={loginUser}/> } />
        {/* user register */}
        <Route path="/register" element={<Register loginUser={loginUser}/> } />
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
