// button 
import { useEffect, useState, useContext } from 'react'
import SignInPage from './SignInPage'
import UserComponent from './UserComponent'
import { UserContext } from './UserContext'

const SiginBtn = () => {
    const {user} = useContext(UserContext)
    // toggle to show sign in page
    const [isSignedIn, setIsSignedIn] = useState(false)
    // toggle to decide if user is logged in or not
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        if (user) {
            setIsLoggedIn(true) }
    }, [user])
    return (
        <>
            {!isSignedIn && !isLoggedIn && (
                <button className='p-1 px-3 rounded-[5rem] border-none bg-black/50 text-xl hover:bg-black/80 hover:text-gray-500' title='SignIn' onClick={() => setIsSignedIn(true)}>
                    +
                </button>
            )}
            {isLoggedIn && (
                <UserComponent />
            )}
            {isSignedIn && (
                <SignInPage onExit={() => setIsSignedIn(false)} checkLoggedIn={() => setIsLoggedIn(true)} />
            )}
        </>
    )
}

export default SiginBtn

