import React, { useState } from "react"

const EditTask = ({tasks, onSave, onClose}) => {
    const [title, setTitle] = useState(tasks.title)
    const [description, setDescription] = useState(tasks.description)

    const handleSave = () => {
        onSave({
            id: Date.now(),
            title,
            description,
            status: tasks.status,
            oldId: tasks.id
        })
    }

    const handleCancel = () => {
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex justify-center items-center">
            <div className="bg-black p-8 rounded-lg w-96 relative">
                <h2 className="text-lg font-bold mb-4">Edit Task</h2>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Task Title"
                    className="w-full mb-2 p-2 border-[1px] border-gray-600 rounded bg-black focus:outline-none"
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Task Description"
                    className="w-full mb-2 p-2 border-[1px] border-gray-600 rounded bg-black focus:outline-none"
                />
                <div className="flex justify-end gap-2">
                    <button onClick={handleSave} className="bg-blue-600 text-white p-2 rounded">
                        Save
                    </button>
                    <button onClick={handleCancel} className="bg-gray-600 text-white p-2 rounded">
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EditTask