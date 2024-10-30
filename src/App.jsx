import React, { useState } from 'react'
import SearchBar from './components/SearchBar'
import Logo from './components/Logo'
import SiginBtn from './components/SiginBtn'
import TaskCard from './components/TaskCard'
import NewTask from './components/NewTask'

const App = () => {
  const [isNewTask, setIsNewTask] = useState(false)
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Buy groceries', description: 'Milk, Bread, Eggs, and Fruits' },
    { id: 2, title: 'Complete assignment', description: 'Finish the math assignment' },
    { id: 3, title: 'Workout', description: '1 hour of cardio' }
  ])
  return (<>
    <NewTask isOpen={isNewTask} onClose={() => setIsNewTask(false)} onSave={(newTask) => {
      setTasks([...tasks, newTask])
      setIsNewTask(false)
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
        {tasks.map(task => <TaskCard key={task.id} title={task.title} description={task.description} id={task.id} />)}
      </div>
    </section>
  </>
  )
}

export default App

