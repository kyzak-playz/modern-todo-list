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
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

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
  }, [tasksUpdated, filter])


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

  /**
   * Filters tasks based on the current filter state.
   *
   * @returns {Array} A list of tasks filtered by the specified status.
   *                  If the filter is 'all', returns all tasks.
   *                  If the filter is 'completed', returns only tasks with status 'completed'.
   *                  If the filter is 'pending', returns only tasks with status 'pending'.
   */
  const filteredTasks = () => {
    if (filter === 'all') {
      return tasks;
    } else if (filter === 'completed') {
      return tasks.filter(task => task.status === 'completed');
    } else if (filter === 'pending') {
      return tasks.filter(task => task.status === 'pending');
    }
  }

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase())
  }

  /**
   * Filters tasks based on the current search term and the current filter state.
   *
   * @returns {Array} A list of tasks that contain the search term in either the title or description
   *                  and match the current filter state.
   */
  const filteredTasksBySearch = () => {
    if (searchTerm === '') {
      return filteredTasks();
    }
    return filteredTasks().filter(task => {
      const title = task.title.toLowerCase()
      const description = task.description.toLowerCase()
      return title.includes(searchTerm) || description.includes(searchTerm)
    })
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
      <SearchBar value={searchTerm} onSearch={handleSearch} />
      <SiginBtn />
    </nav>

    <section className='h-[80vh]  mx-32 px-48 py-5 '>
      <div className="flex gap-4 m-10">
        <button className='bg-yellow-600 p-2 rounded-md text-sm text-white hover:bg-yellow-700' onClick={() => { setIsNewTask(true) }}>
          New Task
        </button>
        <select className='p-2 rounded-md text-sm bg-black/90 focus:outline-none' value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Filter</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </div>
      <div className='flex flex-col gap-4 h-4/5 overflow-hidden overflow-y-scroll scrollbar-hide'>
        {filteredTasksBySearch().length === 0 ? (
          <p className='text-center text-xl text-gray-500 mt-32'>Nothing to show here</p>
        ) : (
          filteredTasksBySearch().map(task => (
            <TaskCard
              key={task.id}
              title={task.title}
              description={task.description}
              status={task.status}
              id={task.id}
              onDelete={() => handleDelete(task.id)}
              onEdit={() => handleEdit(task.id)}
              filter={filter}
            />
          ))
        )}
      </div>
    </section>
  </>
  )
}
export default App

