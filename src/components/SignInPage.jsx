import React from 'react'


const SignInPage = ({onExit, checkLoggedIn}) => {
    const handleSubmit = async (event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        const username = data.get('username')
        const password = data.get('password')

        const response = await fetch("http://127.0.0.1:8000/sign_up", {
            method: "POST",
            body: data,
        })

        if (response.status !== 200) {
            alert("Something went wrong")
            return
        }
        const token = await response.json()
        localStorage.setItem('user', JSON.stringify({ username, password }))
        setTimeout(() => {
            onExit()
            checkLoggedIn()
        }, 3000)
    }

    return (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center'>
            <div className='bg-black p-8 rounded-lg w-96'>
                <h2 className='text-lg font-bold mb-4'>Sign In</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-2'>
                        <label htmlFor="username" className='block mb-1'>Email</label>
                        <input type="email" id="username" name='username' className='w-full p-2 border-[1px] border-gray-600 rounded bg-black focus:outline-none' />
                    </div>
                    <div className='mb-4'>
                        <label htmlFor="password" className='block mb-1'>Password</label>
                        <input type="password" id="password" name='password' className='w-full p-2 border-[1px] border-gray-600 rounded bg-black focus:outline-none' />
                    </div>
                    <button type="submit" className='bg-blue-600 text-white p-2 rounded w-full'>Sign In</button>
                </form>
            </div>
        </div>
    )
}

export default SignInPage


