# statusQuo Backend

This repository contains the backend code for the statusQuo project. The backend is built using Node.js and FastAPI, and it consists of various components including configuration files, controllers, middleware, models, routes, utilities, and services.

## Node.js Backend

The Node.js backend is located in the `node_backend` directory. It contains the following components:

- **Config**: This directory contains configuration files for the backend, such as database connection settings, API keys, and environment variables.

- **Controller**: The controller directory contains the logic for handling incoming requests and generating responses. It includes functions for fetching data from the GitHub repository.

- **Middleware**: Middleware functions are used to intercept and modify incoming requests before they reach the controller. This directory contains middleware functions for authentication, error handling, and more.

- **Model**: The model directory contains the data models used by the backend. These models define the structure and behavior of the data stored in the database.

- **Routes**: The routes directory contains the API routes for the backend. Each route maps to a specific URL endpoint and is associated with a controller function.

- **Utils**: The utils directory contains utility functions that are used throughout the backend codebase. These functions provide common functionality such as data validation, formatting, and error handling.

- **Services**: The services directory contains additional services used by the backend. This includes the `llm_service` which is responsible for calling the LLM (Language Model) with a prompt PDF and returning the answer.

## FastAPI Backend

The FastAPI backend is located in the `fastapi_backend` directory. It contains the `llm_service` which is responsible for calling the LLM with a prompt PDF and returning the answer.

## Getting Started

To get started with the statusQuo backend, follow these steps:

1. Clone the repository to your local machine.
2. Install the required dependencies by running `npm install` in the `node_backend` directory and `pip install -r requirements.txt` in the `fastapi_backend` directory.
3. Configure the backend by updating the necessary configuration files in the `config` directory.
4. Start the Node.js backend by running `npm start` in the `node_backend` directory.
5. Start the FastAPI backend by running `uvicorn main:app --reload` in the `fastapi_backend` directory.

That's it! You should now have the statusQuo backend up and running.
