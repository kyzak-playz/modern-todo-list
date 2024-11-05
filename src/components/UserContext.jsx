import React, { useState, useEffect, createContext, useContext } from 'react'

const UserContext = createContext()

/**
 * UserProvider component
 * 
 * Wraps its children with UserContext, providing `user` and `setUser` within the context.
 * It initializes the user state from local storage if available.
 *
 * @param {object} children - The children elements to be wrapped by the UserProvider.
 * 
 * @returns {JSX.Element} A provider component that supplies user context to its children.
 */
const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const userString = localStorage.getItem('user')
        if (userString) {
            setUser(JSON.parse(userString))
        }
    }, [])

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    )
}

const useUser = () => {
    const context = useContext(UserContext);
    return context || null;
}

export default useUser;

export { UserProvider, UserContext, useUser }

