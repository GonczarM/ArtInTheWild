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
import * as userService from '../../utils/users-service';

function App(){

	const [user, setUser] = useState(userService.getUser())
  const [mural, setMural] = useState(null)
  const [updatedBy, setUpdatedBy] = useState(null)
  const [murals, setMurals] = useState(null)

  const navigate = useNavigate()

  const updateMural = (mural, updatedBy) => {
		setMural(mural)
    if(updatedBy){
      setUpdatedBy(updatedBy)
    }
		navigate(`/mural/${mural._id}`)
	}

  const loginUser = (user) => {
    setUser(user)
    navigate(`/${user.username}`);
  }

  const logoutUser = () => {
    userService.logOut()
    setUser(null)
    navigate('/')
  }

  const updateMurals = (newMurals) => {
    if(newMurals.length){
      setMurals(newMurals)
    }else{
      for (let i = 0; i < murals.length; i++) {
        if(murals[i]._id === newMurals._id){
          murals.splice(i, 1, newMurals)
          setMurals([...murals])
        }
      }
    }
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
          updateMurals={updateMurals}
          murals={murals} 
        />} />
        {/* mural search */}
        <Route path='/search' element={<MuralSearch 
          updateMural={updateMural} 
        /> } />
        {/* mural show */}
        <Route path="/mural/:muralId" element={<ShowMural 
          mural={mural}
          user={user}
          updatedBy={updatedBy}
          updateMural={updateMural}
          updateMurals={updateMurals}
        /> } />
        {/* mural create */}
        <Route path="/mural/create" element={<CreateMural 
          updateMural={updateMural}
          user={user}
        /> } />
        {/* mural edit */}
        <Route path="/mural/edit/:id" element={<EditMural 
          mural={mural} 
          updateMural={updateMural}
          user={user}
          updatedBy={updatedBy}
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
