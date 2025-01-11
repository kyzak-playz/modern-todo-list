import React, { useRef, useState, useEffect } from 'react'
import useUser from './UserContext'

const UserComponent = () => {



    let intervalid;

    // retrieve token and token type from sesssion storage 
    const userToken = JSON.parse(sessionStorage.getItem('userToken'))
    const tokenType = userToken.token_type;
    const accessToken = userToken.access_token

    // on login, check and sync tasks from database only once
    useEffect(() => {
        if (userToken && (JSON.parse(localStorage.getItem('tasks')) == null || JSON.parse(localStorage.getItem('tasks')).length == 0)) {
            const response = fetch("http://127.0.0.1:8000/get-tasks",
                {
                    method: "POST",
                    headers: {
                        'Authorization': `${tokenType} ${accessToken}`
                    }
                }
            )

            if (response.status == 200) {
                response.json().then((data) => {
                    if (data != []) {
                        localStorage.setItem('tasks', JSON.stringify(data))
                    }
                })
            }

        }
    }, [])

    // sync tasks every 3 seconds
    useEffect(() => {
        if (userToken) {
            intervalid = setInterval(() => {
                // body for sync tasks request
                const taskBody = localStorage.getItem('tasks')

                // if user is logged in and token is found, only then make sync request
                fetch("http://127.0.0.1:8000/sync-tasks",
                    {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `${tokenType} ${accessToken}`
                        },
                        body: taskBody
                    }
                )
                    .then((response) => {
                        if (response.status == 401) {
                            // fetch new token from server and set it in session 

                            // for functionaly and just for now, remove session storage and reload page so the user have to login again and new token will be fetched
                            sessionStorage.removeItem('userToken')
                            sessionStorage.removeItem('username')
                            window.location.reload()
                        } else {
                            response.json().then((data) => {
                                console.log(data)
                            })
                        }
                    })
            }, 3000);
        }

        // if intervalid is not null, then clear the interval
        return () => {
            if (intervalid) {
                clearInterval(intervalid)
            }
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


