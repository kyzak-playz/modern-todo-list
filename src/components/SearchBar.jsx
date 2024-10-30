// search bar
import React from 'react'

const searchBar = () => {
    return (
        <div className='w-1/3'>
            <input
                type="text"
                placeholder="Search"
                className="p-2 px-4 border rounded-3xl text-black w-full focus:outline-none"
            />
        </div>
    )
}

export default searchBar