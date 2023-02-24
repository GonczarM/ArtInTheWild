import HomeContainer from './Murals/HomeContainer.js';
import Login from './Users/Login.js';
import Header from './Header'
import CreateMural from './Murals/CreateMural.js'
import Register from './Users/Register.js'
import ShowMural from './Murals/ShowMural.js'
import UserShow from './Users/UserShow'
import MuralSearch from './Murals/MuralSearch';
import { Route, Routes} from 'react-router-dom'
import { useState } from 'react';

function App(){

  const [isLoggedIn, setIsLoggedIn] = useState(false)
	const [user, setUser] = useState({})
  const [mural, setMural] = useState({})

    return (
      <main>
        <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} user={user} />
        <Routes>
          <Route path="/" element={ <HomeContainer setMural={setMural} />} />
          <Route path="/mural" element={ <ShowMural mural={mural} /> } />
          <Route path="/createMural" element={ <CreateMural setMural={setMural} /> } />
          <Route path="/login" element={ <Login setIsLoggedIn={setIsLoggedIn} setUser={setUser}/> } />
          <Route path="/register" element={ <Register setIsLoggedIn={setIsLoggedIn} setUser={setUser}/> } />
          <Route path="/user" element={ <UserShow user={user} setMural={setMural} />} />
          <Route path='/search' element={ <MuralSearch setMural={setMural} /> } />
        </Routes>
      </main>
    );
}

export default App;