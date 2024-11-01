import React, { useState } from 'react';

/**
 * NewTask component
 *
 * @param {boolean} isOpen Whether the component is currently open
 * @param {function} onClose Function to call when the user closes the component
 * @param {function} onSave Function to call when the user saves the task
 *
 * @returns A JSX element representing the NewTask component
 */
const NewTask = ({ isOpen, onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-lg flex justify-center items-center">
            <div className="bg-black p-8 rounded-lg w-96 relative">
                <h2 className="text-lg font-bold mb-4">New Task</h2>
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
                    <button onClick={() => onSave({ title, description, id: Date.now(), status: "pending" })} className="bg-blue-600 text-white p-2 rounded">
                        Save
                    </button>
                    <button onClick={onClose} className="bg-gray-600 text-white p-2 rounded">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewTask;

