# Modern Todo List Web App Backend
=====================================

## Overview
------------

This is the backend for the Modern Todo List Web App, built using Python and the FastAPI framework. It handles authentication, synchronization, and other basic backend functionality.

## Features
------------

* **Authentication**: Handles user authentication using JWT tokens
* **Synchronization**: Syncs todo lists across devices using a MongoDB database
* **Basic Backend Functionality**: Provides a RESTful API for CRUD operations on todo lists

## Requirements
---------------

* **Python 3.x**
* **FastAPI**
* **MongoDB**
* **Pydantic**
* **Uvicorn**
* **CORS**

## Installation
------------

1. Clone the repository: `git clone https://github.com/your-username/modern-todo-list/backend.git`
2. Install dependencies: `pip install -r requirements.txt`
3. Run the application: `fastapi dev main.py`

## Using the API
---------------

### Authentication

* To sign up, send a `POST` request to `/sign_up` with a JSON body containing `username` and `password`:
```json
{
  "username": "your_username",
  "password": "your_password"
}
```
* To log in, send a `POST` request to `/login` with a JSON body containing `username` and `password`:
```json
{
  "username": "your_username",
  "password": "your_password"
}
```
You will receive an access token in the response, which you can use to authenticate subsequent requests.

### Todo List Operations

* To retrieve a user's todo lists, send a `GET` request to `/get-tasks` with the access token in the `Authorization` header:
```bash
curl -X GET \
  http://localhost:8000/get-tasks \
  -H 'Authorization: Bearer your_access_token'
```
* To create a new todo list, send a `POST` request to `/sync-tasks` with a JSON body containing the todo list data:
```json
{
  "tasks": [
    {
      "title": "Task 1",
      "completed": false
    },
    {
      "title": "Task 2",
      "completed": true
    }
  ]
}
```
* To update a todo list, send a `POST` request to `/sync-tasks` with a JSON body containing the updated todo list data.

### Password Management

* To change a user's password, send a `POST` request to `/change-password` with a JSON body containing the old and new passwords:
```json
{
  "old_password": "your_old_password",
  "new_password": "your_new_password",
  "confirm_new_password": "your_new_password"
}
```
* To check the validity of a new password, send a `POST` request to `/change-password-check` with a JSON body containing the new password:
```json
{
  "new_password": "your_new_password"
}
```

## API Endpoints
----------------

### 1. GET /
* Returns a welcome message

### 2. POST /sign_up
* Creates a new user

### 3. POST /login
* Logs in a user and returns an access token

### 4. GET /get-tasks
* Retrieves the tasks for a given user

### 5. POST /sync-tasks
* Syncs the tasks in the database with the given list of tasks

### 6. POST /change-password/
* Changes the password for a user

### 7. POST /change-password-check/
* Checks the validity of the new and old passwords entered by the user

### 8. GET /check-db
* Checks the status of the database connection

### 9. GET /static
* Serves static files from the [/static](https://github.com/kyzak-playz/modern-todo-list/backend/static) directory

## Contributing
------------

Contributions are welcome! If you'd like to contribute to this project, please fork the repository and submit a pull request.

## License
-------

This project is licensed under the [MIT License](https://github.com/kyzak-playz/modern-todo-list/LICENSE).