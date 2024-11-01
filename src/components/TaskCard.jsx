import React from 'react'

const TaskCard = ({title, description, onDelete, onEdit}) => {
    
    return (
        <div className="flex justify-between items-center bg-black/50 p-4 rounded-xl">
            <div className="flex items-center">
                <input type="checkbox" className="mr-4" />
                <div>
                    <h3 className="text-lg font-bold">{title}</h3>
                    <p className="text-sm">{description}</p>
                </div>
            </div>
            <div className="flex items-center">
                <button className="p-2 bg-yellow-600 rounded-full hover:bg-yellow-700" title='edit' onClick={onEdit}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </button>
                <button className="p-2 bg-red-600 rounded-full hover:bg-red-700 ml-2" title='delete' onClick={onDelete}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default TaskCard


