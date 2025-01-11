from typing import Annotated
import jwt
from jwt.exceptions import InvalidTokenError
from fastapi import (
    FastAPI,
    Request,
    Response,
    status,
    Form,
    Body,
    Query,
    Depends,
    HTTPException,
)
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import RedirectResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from utility.token import create_access_token, verify_password, get_password_hash
from pydantic import BaseModel
from datetime import timedelta
from time import sleep
from dB.connection import MongoDBConnection, User, Task
from dotenv import load_dotenv
import os

# Load environment variables
env = os.getenv("ENV", "development")
# Connect to MongoDB
db = MongoDBConnection()
# Set the access token expiration time
ACCESS_TIME_TOKEN_EXPIRES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
# Load environment variables
load_dotenv(f".env{'' if env == 'production' else '.local'}")

# Create the FastAPI app
app = FastAPI()
# Create the Jinja2Templates instance
templates = Jinja2Templates(directory="templates")
# Set up OAuth2 authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
# Set up CORS middleware
origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.mount("/static", StaticFiles(directory="static"), name="static")


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str


    

class FormData(BaseModel):
    old_password: str | None = None
    new_password: str | None = None
    confirm_password: str | None = None


@app.get("/")
async def root():
    return {"message": "Hello World"}


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    """
    Validates the given token and returns the corresponding user if the
    validation is successful.

    Args:
        token (str): The token to be validated.

    Returns:
        User: The User object if the token is valid, otherwise raises an
            HTTPException with a 401 status code.

    Raises:
        HTTPException: If the token is invalid.
    """
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        algorithm = os.getenv("ALGORITHM")
        if algorithm is None:
            raise ValueError("ALGORITHM varaiable envrionment is not set")
        payload = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=[algorithm])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except InvalidTokenError:
        raise credentials_exception
    user = db.get(token_data.username)
    if user is None:
        raise credentials_exception
    return user


@app.post("/sign_up", status_code=status.HTTP_200_OK)
async def signup_post(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()], response: Response
):
    # check if user already exists
    """
    Creates a new user and returns an access token.

    Args:
        form_data (OAuth2PasswordRequestForm): The form data containing the username and password.

    Returns:
        Token: A JSON response containing the access token and token type.

    Raises:
        HTTPException: If the user already exists or if there is a server error.
    """
    if db.get(form_data.username) is not None:
        response.status_code = status.HTTP_409_CONFLICT
        return {"error": "User already exists"}
    # if not then insert the new user
    user = User(username=form_data.username, password=form_data.password, role="user")
    token = db.insert(user)
    if token is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user",
        )
    return Token(access_token=token, token_type="bearer")


@app.post("/login", response_model=Token)
async def login_post(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    """
    Logs in a user and returns an access token.

    Args:
        form_data (OAuth2PasswordRequestForm): The form data containing the username and password.

    Returns:
        Token: A JSON response containing the access token and token type.

    Raises:
        HTTPException: If the username or password is incorrect.
    """
    user = db.get(form_data.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    if not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Wrong password",
        )
    access_token_expires = timedelta(minutes=ACCESS_TIME_TOKEN_EXPIRES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/change-password/", response_class=HTMLResponse)
async def change_password_get(
    request: Request, token: Annotated[str, Query()]
):
    """
    Returns an HTML response containing a form for changing the user's password.

    Args:
        request (Request): The request object containing information about the
            request.
        token (str): The token provided by the user to authenticate the request.

    Returns:
        HTMLResponse: The HTML response containing the form.
    """
    return templates.TemplateResponse(
        "changePassword.html",
        {"request": request, "token": token, "name": "changePassword.html"},
    )


@app.post("/change-password-check/")
async def change_password_check(data: Annotated[FormData, Form()]):
    """
    Checks the validity of the new and old passwords entered by the user.

    Args:
        data (FormData): The form data containing the old password, new password, and confirm new password.

    Returns:
        dict: A dictionary containing a message indicating whether the entered data is valid or not.
    """
    if data.old_password is None or data.new_password is None or data.confirm_password is None:
        return {"message": "Output without data"}
    for password in [data.old_password, data.new_password, data.confirm_password]:
        if len(password) == 0:
            return {"message": "empty fields"}
    return {"message": "Output with data", "data": data}


@app.post("/change-password/")
async def change_password(data: Annotated[FormData, Form()], response: Response, user: Annotated[User, Depends(get_current_user)]):
    """
    Changes the user's password and returns a new access token with the updated password.

    Args:
        data (FormData): A FormData object containing the new password and confirm password.
        response (Response): The response object to be modified.
        user (User): The currently logged in User object.

    Returns:
        dict: A dictionary containing a success message, the new access token, and the updated user information.
    """
    checkPassword = verify_password(data.old_password, user.password)
    if not checkPassword:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return {"error": "Old password is incorrect"}
    if data.new_password != data.confirm_password:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {"error": "New password and confirm password do not match"}
    frontend_url = os.getenv("URL")
    if frontend_url is None:
        raise ValueError("FRONTEND_URL varaiable envrionment is not set")
    user.password = get_password_hash(data.new_password)
    res = db.update_password(user)
    if not res:
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"error": "Failed to update password"}

    response.status_code = status.HTTP_200_OK
    response.headers["Authorization"] = create_access_token(
        {"sub": user.username},
        expires_delta=timedelta(minutes=ACCESS_TIME_TOKEN_EXPIRES),
    )
    return {
        "message": "Password changed successfully",
        "url": frontend_url
    }

    

@app.get("/check-db")
def check_db(user:Annotated[User, Depends(get_current_user)], request: Request):
    """
    Checks the status of the database connection.

    Args:
        user (User): The User object containing the user's information.
        request (Request): The request object containing information about the request.

    Returns:
        dict: A dictionary containing a list of databases in the MongoDB connection.

    Raises:
        HTTPException: If the user is forbidden or if there is a server error.
    """
    if user.role == "forbid": 
        return templates.TemplateResponse("forbid.html", {"request": request})
    if user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")
    stats_db = db.check_db_status()
    return {"databases": stats_db}


@app.post("/sync-tasks")
def syncTasks(user: Annotated[User, Depends(get_current_user)], tasks: Annotated[list[Task], Body()], request: Request):
    """
    Syncs the tasks in the database with the given list of tasks.

    If the tasks in the database and the given list of tasks are not the same, it syncs the tasks by calling the `syncTasks` method of the `MongoDBConnection` class.

    Args:
        user (User): The User object containing the user's information.
        tasks (list[Task]): The list of Task objects to be synced with the database.
        request (Request): The request object containing information about the request.

    Returns:
        dict: A dictionary containing a success message and the status code of the response.

    Raises:
        HTTPException: If the user is forbidden or if there is a server error.
    """
    if user.role == "forbid": 
        return templates.TemplateResponse("forbid.html", {"request": request})
    dbTasks = db.getTasks(user.username)
    if dbTasks != tasks:
        acknowledgement = db.syncTasks(tasks, username=user.username)
        if acknowledgement:
            return {"message": "Tasks synced successfully", "status": status.HTTP_200_OK}
        else:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to sync tasks")
    return {"message": "Tasks already synced", "status": status.HTTP_208_ALREADY_REPORTED}


@app.get("/get-tasks")
def retrieveTasks(user: Annotated[User, Depends(get_current_user)]):
    """
    Retrieves the tasks for a given user from the database.

    Args:
        user (User): The User object containing the user's information.

    Returns:
        List[Task]: A list of Task objects associated with the user. Returns an empty list if no tasks are found.

    Raises:
        HTTPException: If the user is forbidden.
    """
    if user.role == "forbid": 
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")
    tasks = db.getTasks(user.username)
    # if no tasks found then return an empty list
    if tasks is None:
        return []
    return tasks