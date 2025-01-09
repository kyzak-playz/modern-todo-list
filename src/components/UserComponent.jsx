import React, { useRef, useState, useEffect } from 'react'
import useUser from './UserContext'

const UserComponent = () => {

    // retrieve token and token type from sesssion storage 
    const userToken = JSON.parse(sessionStorage.getItem('userToken'))
    const tokenType = userToken.tokenType;
    const accessToken = userToken.accessToken
    useEffect(() => {
        const intervalid = setInterval(() => {

            // if user is logged in and token is found, only then make sync request
            if (userToken) {
                // const response = fetch("http://127.0.0.1:8000/sync-tasks", 
                //     {
                //         method: "POST",
                //         headers: {
                //            'Authorization': `${tokenType} ${accessToken}`
                //         },
                //         body: [JSON.parse(localStorage.getItem('tasks'))]
                //     }
                // )
                // if (response.status != 200){
                //     console.log(`${response.status} at ${Date.now()}`)
                // }
                console.log(JSON.parse(localStorage.getItem('tasks')))
            }
        }, 3000);

        return () => {
            clearInterval(intervalid)
        }
    }, [])


    const { user } = useUser()
    const initial = user?.email?.split('@')[0]
    const [showDropdown, setShowDropdown] = useState(false)
    const dropdownRef = useRef(null)

    const handleClick = (event) => {
        event.preventDefault()
        setShowDropdown(!showDropdown)
    }

    const handleBlur = (event) => {
        if (!dropdownRef.current.contains(event.relatedTarget)) {
            setShowDropdown(false)
        }
    }

    const handleLogout = () => {
        console.log('Logging out...')
        sessionStorage.removeItem('userToken')
        sessionStorage.removeItem('username')
        window.location.reload()
    }

    const handlePass = () => {
        window.location.href = `http://127.0.0.1:8000/change-password/?token=${accessToken}`
    }

    return (
        <>
            <div
                className='relative'
                onClick={handleClick}
                onBlur={handleBlur}
                ref={dropdownRef}
                tabIndex={-1}
            >
                <img
                    src={`https://images.unsplash.com/photo-1518806118471-f28b20a1d79d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80`}
                    alt={initial}
                    className='w-8 h-8 rounded-full cursor-pointer'
                />
                {showDropdown && (
                    <div
                        onBlur={handleBlur} onMouseOut={handleBlur}
                        className='w-48 rounded-md absolute right-0 mt-2 bg-black/50 p-2 z-10 grid grid-cols-1 gap-2 text-sm'
                    >
                        <button onClick={handlePass} className='text-white'>Change Password</button>
                        <div className='h-px bg-gray-700 mb-1' />
                        <button onClick={handleLogout} className='text-white'>Logout</button>
                    </div>
                )}
            </div>
        </>
    )
}

export default UserComponent


