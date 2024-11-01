import React, { useEffect, useState } from 'react'
import SearchBar from './components/SearchBar'
import Logo from './components/Logo'
import SiginBtn from './components/SiginBtn'
import TaskCard from './components/TaskCard'
import NewTask from './components/NewTask'
import EditTask from './components/EditTask'

const App = () => {
  const [isNewTask, setIsNewTask] = useState(false)
  const [tasksUpdated, setTasksUpdated] = useState(false)
  const [isEditingTask, setIsEditingTask] = useState(null)
  const [tasks, setTasks] = useState([])

  // load tasks from local storage
  const loadTasks = () => {
    const tasks = localStorage.getItem('tasks')
    return tasks ? JSON.parse(tasks) : []
  }

  // set the local storage and load the tasks
  useEffect(() => {
    if (!localStorage.getItem('tasks') && tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks))
    } else {
      const loadedTasks = loadTasks()
      setTasks(loadedTasks)
    }
  }, [tasksUpdated])


  /**
   * Handle the delete task button click
   * @param {number} id The id of the task to delete
   */
  const handleDelete = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
    localStorage.setItem('tasks', JSON.stringify(tasks.filter(task => task.id !== id)))
    setTasksUpdated(true)
  }

  /**
   * Set the task to be edited
   * @param {number} id The id of the task to be edited
   */
  const handleEdit = (id) => {
    setIsEditingTask(id)
  }


  const handleSave = (newTask) => {
    const updatedTasks = tasks.map(task =>
      task.id === newTask.oldId ? { ...task, ...newTask } : task
    )
    setTasks(updatedTasks)
    localStorage.setItem('tasks', JSON.stringify(updatedTasks))
    setIsEditingTask(null)
    setTasksUpdated(true)
  }

  return (<>
    {isEditingTask && <EditTask isOpen={isEditingTask} onClose={() => setIsEditingTask(null)} onSave={handleSave} tasks={tasks.find(task => task.id === isEditingTask)} />}
    <NewTask isOpen={isNewTask} onClose={() => setIsNewTask(false)} onSave={(newTask) => {
      const updatedTasks = [...tasks, newTask]
      setTasks(updatedTasks)
      localStorage.setItem('tasks', JSON.stringify(updatedTasks))
      setIsNewTask(false)
      setTasksUpdated(true)
    }} />
    <nav className=' flex justify-between items-center m-10'>
      <Logo />
      <SearchBar />
      <SiginBtn />
    </nav>

    <section className='h-[80vh]  mx-32 px-48 py-5 '>
      <div className="flex gap-4 m-10">
        <button className='bg-yellow-600 p-2 rounded-md text-sm text-white hover:bg-yellow-700' onClick={() => { setIsNewTask(true) }}>
          New Task
        </button>
        <select className='p-2 rounded-md text-sm bg-black/90 focus:outline-none'>
          <option value="all">Filter</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </div>
      <div className='flex flex-col gap-4 h-4/5 overflow-hidden overflow-y-scroll scrollbar-hide'>
        {tasks.length === 0 ? (
          <p className='text-center text-xl text-gray-500 mt-32'>Nothing to show here</p>
        ) : (
          tasks.map(task => (
            <TaskCard
              key={task.id}
              title={task.title}
              description={task.description}
              id={task.id}
              onDelete={() => handleDelete(task.id)}
              onEdit={() => handleEdit(task.id)}
            />
          ))
        )}
      </div>
    </section>
  </>
  )
}
export default App


