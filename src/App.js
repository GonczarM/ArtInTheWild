import Home from './Murals/Home.js';
import Login from './Users/Login.js';
import Header from './Header'
import CreateMural from './Murals/CreateMural.js'
import Register from './Users/Register.js'
import ShowMural from './Murals/ShowMural.js'
import UserShow from './Users/UserShow'
import MuralSearch from './Murals/MuralSearch';
import EditMural from './Murals/EditMural'
import { Route, Routes} from 'react-router-dom'
import { useState } from 'react';
import { Container } from 'react-bootstrap'

function App(){

  const [isLoggedIn, setIsLoggedIn] = useState(false)
	const [user, setUser] = useState({})
  const [mural, setMural] = useState({})

    return (
      <Container>
        <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} user={user} />
        <Routes>
          {/* home */}
          <Route path="/" element={ <Home setMural={setMural} />} />
          {/* mural search */}
          <Route path='/search' element={ <MuralSearch setMural={setMural} /> } />
          {/* mural show */}
          <Route path="/mural" element={ <ShowMural mural={mural} /> } />
          {/* mural create */}
          <Route path="/createMural" element={ <CreateMural setMural={setMural} /> } />
          {/* mural edit */}
          <Route path="/editMural" element={ <EditMural mural={mural} setMural={setMural} /> } />
          {/* user login */}
          <Route path="/login" element={ <Login setIsLoggedIn={setIsLoggedIn} setUser={setUser}/> } />
          {/* user register */}
          <Route path="/register" element={ <Register setIsLoggedIn={setIsLoggedIn} setUser={setUser}/> } />
          {/* user show */}
          <Route path="/:username"  element={ <UserShow user={user} setMural={setMural} setIsLoggedIn={setIsLoggedIn} />} />
        </Routes>
      </Container>
    );
}

export default App;