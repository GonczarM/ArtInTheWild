'use client';

import { useState, useEffect, useReducer } from 'react';
import { useRouter } from 'next/navigation';

import { MuralContext, MuralDispatchContext, UserContext, UserActionsContext, AuthCheckedContext } from '../utils/contexts';
import * as userService from '../utils/users-service';

import Header from '../components/Header/Header';
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';

function muralReducer(mural, action){
  switch (action.type) {
    case 'changed': {
      return(action.mural)
    }
  }
}

export default function Providers({ children }) {

  const [user, setUser] = useState(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [mural, dispatch] = useReducer(muralReducer, null);
  const [error, setError] = useState('')

  const router = useRouter()

  // Reading the auth cookie has to happen client-side (after mount), since it's
  // unavailable during server rendering - this means the header briefly renders
  // logged-out before hydration picks up an existing session. authChecked lets
  // pages that redirect on `!user` tell "logged out" apart from "not checked yet".
  useEffect(() => {
    setUser(userService.getUser())
    setAuthChecked(true)
  }, [])

  const loginUser = (userToLogin) => {
    setUser(userToLogin)
    router.push(`/user/${userToLogin.username}`);
  }

  const logoutUser = () => {
    try{
      userService.logOut()
      setUser(null)
      router.push('/')
    }catch{
      setError('Could not logout. Please try again.')
    }
  }

  return (
    <AuthCheckedContext.Provider value={authChecked}>
    <UserContext.Provider value={user}>
    <UserActionsContext.Provider value={{ loginUser, logoutUser }}>
    <MuralContext.Provider value={mural}>
    <MuralDispatchContext.Provider value={dispatch}>
      <Header
        logoutUser={logoutUser}
      />
      {error && <ErrorMessage error={error} setError={setError} />}
      {children}
    </MuralDispatchContext.Provider>
    </MuralContext.Provider>
    </UserActionsContext.Provider>
    </UserContext.Provider>
    </AuthCheckedContext.Provider>
  );
}
