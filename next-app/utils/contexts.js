import { createContext } from "react"

export const UserContext = createContext(null)
// True once the client has checked the auth cookie at least once. Until
// then, `user === null` is ambiguous between "logged out" and "haven't
// checked yet" - guards that redirect on `!user` need this to avoid
// bouncing an actually-logged-in user during that brief window.
export const AuthCheckedContext = createContext(false)
export const MuralContext = createContext(null)
export const MuralDispatchContext = createContext(null)
export const UserActionsContext = createContext({ loginUser: () => {}, logoutUser: () => {} })
