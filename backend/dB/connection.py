__all__ = ["MongoDBConnection"]

from utility.token import create_access_token, get_password_hash, verify_password
from pymongo import MongoClient
import os
from datetime import timedelta
from pydantic import BaseModel, Field
from typing import List

class User(BaseModel):
    username: str = Field(examples=["jC0tP@example.com"])
    password: str = Field(examples=["password123"])
    role: str = Field(default=None, examples=["user", "admin"])

class UserInDB(BaseModel):
    username: str
    password: str

ACCESS_TOKEN_EXPIRES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

class MongoDBConnection:
    """
    A class used to represent a connection to a MongoDB instance.

    This class is used to interact with a MongoDB instance. It provides methods
    for inserting, retrieving, updating, and deleting user information.

    Attributes:
        client (MongoClient): The MongoDB client instance.
        db (Database): The database instance for the "todo-app".
        collection (Collection): The collection instance for "userInfo".
    """
    def __init__(self):
        """
        Initializes a new instance of the MongoDBConnection class.

        This constructor establishes a connection to the MongoDB client using
        the database URL specified in the environment variable "DATABASE".
        It also sets up the database and collection to be used for storing
        user information.

        Attributes:
            client (MongoClient): The MongoDB client instance.
            db (Database): The database instance for the "todo-app".
            collection (Collection): The collection instance for "userInfo".
        """
        self.client = MongoClient(os.getenv("DATABASE"))
        self.db = self.client["todo-app"]
        self.collection = self.db["userInfo"]
        print("Connected to MongoDB")

    def close(self):
        """
        Closes the connection to the MongoDB client.
        """
        self.client.close()

    def insert(self, user: User):
        """
        Inserts a new user into the database with a hashed password.

        Args:
            user (User): The User object containing the user's information.

        Returns:
            str or None: Returns a JWT access token if the insertion is successful, 
            otherwise returns None.
        """
        hashes_password = get_password_hash(user.password)
        user.password = hashes_password
        result = self.collection.insert_one(user.model_dump())
        if result.acknowledged:
            return create_access_token({"sub": user.username}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRES))
        return None

    def get_all(self) -> List[User]:
        """
        Retrieves all users from the database.

        Returns:
            List[User]: A list of all the User objects in the database.
        """
        users = self.collection.find()
        return [User(**user) for user in users]

    def get(self, email: str):
        """
        Retrieves a user from the database by email.

        Args:
            email (str): The email of the user to be retrieved.

        Returns:
            User: The User object corresponding to the given email.
        """
        user = self.collection.find_one({"username": email})
        if user is None:
            return None
        return User(**user)


    def delete(self, email: str):
        """
        Deletes a user from the database.

        Args:
            email (str): The email of the user to be deleted
        """
        self.collection.delete_one({"email": email})

    def update(self, email: str, user: User):
        
        """
        Updates a user in the database.

        Args:
            email (str): The email of the user to be updated
            user (User): The User object with the new information
        """
        self.collection.update_one({"email": email}, {"$set": user.model_dump()})

    def update_password(self, user: User):
        """
        Updates the password of a user in the database.

        Args:
            email (str): The email of the user to be updated
            password (str): The new password to be set
        """
        result = self.collection.update_one({"username": user.username}, {"$set": {"password": user.password}})
        if result.matched_count == 0:
            raise ValueError(f"User with email {user.username} not found")
        return True


    def authenticate_user(self, username: str, password: str):
        """
        Authenticates a user by checking the given username and password against
        the information in the database.

        Args:
            username (str): The username to be authenticated.
            password (str): The password to be authenticated.

        Returns:
            User or False: The User object if the authentication is successful, otherwise False.
        """
        user = self.collection.find_one({"email": username})
        if not user:
            return False
        if not verify_password(password, user.hashed_password):
            return False
        return user
    
    def check_db_status(self):
        """
        Checks the status of the database connection.   
        """
        if self.client:
            databases = [db_name for db_name in self.client.list_database_names()]
        return databases
