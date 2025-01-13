import React, { useRef, useState, useEffect } from 'react'
import useUser from './UserContext'
import { data } from 'autoprefixer';

const UserComponent = () => {



    const intervalid = useRef(null);

    // retrieve token and token type from sesssion storage 
    const userToken = JSON.parse(sessionStorage.getItem('userToken'))
    const tokenType = userToken.token_type;
    let accessToken = userToken.access_token;

    // if user is logged in and params include new token after successfull password change then update token
    useEffect(() => {
        if (userToken && window.location.href.includes("token")) {
            const urlToken = window.location.href.split("token=")[1]
            // if urltoken is undefined then reoload the page
            if (urlToken == undefined || urlToken == null || urlToken == "") {
                window.location.reload()
            }
            // if token is not undefined then update token and clear the url
            accessToken = urlToken
            window.location.href = import.meta.env.VITE_APP_HOME_PAGE

        }
    }, [])

    // on login, check and sync tasks from database only once
    useEffect(() => {
        //  user is logged in through other device
        if (userToken && (JSON.parse(localStorage.getItem('tasks')) == null || JSON.parse(localStorage.getItem('tasks')).length == 0 || JSON.parse(localStorage.getItem('tasks')) == [])) {
            console.log("user is logged in through other device")
            fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/get-tasks`,
                {
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                        'Authorization': `${tokenType} ${accessToken}`
                    }
                }
            )
                .then((response) => {
                    // IF SOMETHINHG UNEXPECTED HAPPENED
                    if (response.status != 200) {
                        throw new Error('Failed to fetch tasks')
                    }
                    // else return tasks
                    response.json().then(data => {
                        // set tasks in localstorage
                        localStorage.setItem('tasks', JSON.stringify(data))
                        // reload page to populate tasks
                        window.location.reload();
                    })
                })
        }
    }, [])

    // sync tasks every 5 seconds
    useEffect(() => {
        if (userToken) {
            intervalid.current = setInterval(() => {
                // body for sync tasks request
                const taskBody = localStorage.getItem('tasks')

                // if user is logged in and token is found, only then make sync request
                fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/sync-tasks`,
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
            }, 5000);
        }

        // if intervalid is not null, then clear the interval
        return () => {
            if (intervalid.current) {
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
        window.location.href = `${import.meta.env.VITE_APP_BACKEND_URL}/change-password/?token=${accessToken}`
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


