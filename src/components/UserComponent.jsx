import React, { useRef, useState, useContext } from 'react'
import useUser from './UserContext'

const UserComponent = () => {
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
        // localStorage.removeItem('user')
        // window.location.reload()
    }

    const handlePass = () => {
        console.log('Changing password...')
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


