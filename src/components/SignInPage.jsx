
/**
 * Extracts and returns a token object from the API response.
 *
 * @param {Response} response - The response object from the API call.
 * @returns {Promise<Object>} A promise that resolves to an object containing the token type and access token.
 */

const tokenExtract = async (response) => {
    const token = await response.json()
    const tokenObject = {
        token_type: token.token_type,
        access_token: token.access_token
    }
    return tokenObject
}

const SignInPage = ({ onExit, checkLoggedIn }) => {
    const handleSubmit = async (event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)

        // create up new user
        const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/sign_up`, {
            method: "POST",
            body: data,
        })

        // if user already exist then login
        if (response.status === 409) {
            console.log("user already exist now trying to log in.....")
            const response = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/login`, {
                method: "POST",
                body: data,
            })

            // if password is incorrect or not authorised
            if (response.status == 401) {
                const result = await response.json()
                alert(result.detail)

            } else {

                // get new session token for login
                const tokenObject = await tokenExtract(response)
                sessionStorage.setItem('userToken', JSON.stringify(tokenObject));
                sessionStorage.setItem('username', JSON.stringify(data.get('username')));

                // wait 2 seconds and close sign in page
                setTimeout(() => {
                    onExit()
                    checkLoggedIn()
                }, 2000)
            }

        }

        // get new session token for new user
        if (response.status == 200) {
            const tokenObject = await tokenExtract(response)
            sessionStorage.setItem('userToken', JSON.stringify(tokenObject));
            sessionStorage.setItem('username', JSON.stringify(data.get('username')));

            // wait 2 seconds and close sign in page
        }

        // for other status just show alert
        if (response.status != 200 && response.status != 401 && response.status != 409) {
            const result = await response.json()
            alert(result.detail)
        }

    }

    return (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center'>
            <div className='bg-black p-8 rounded-lg w-96'>
                <div className='flex justify-between items-center'>
                    <h2 className='text-lg font-bold mb-4'>Sign In</h2>
                    <h2 onClick={onExit} className='text-lg font-bold mb-4 cursor-pointer'>X</h2>
                </div>
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


