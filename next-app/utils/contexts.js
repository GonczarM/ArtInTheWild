import { createContext } from "react"

export const UserContext = createContext(null)
export const MuralContext = createContext(null)
export const MuralDispatchContext = createContext(null)

// Exposes the loginUser/logoutUser actions owned by app/providers.js to pages
// that need to trigger them (Login, Register, UserShow) - the App Router has no
// equivalent of passing props to a <Route element={...}> like React Router did.
export const UserActionsContext = createContext({ loginUser: () => {}, logoutUser: () => {} })
