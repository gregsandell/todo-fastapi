# todo_fastapi

This is a React + OpenAPI application to satisfy the request:

> Please create a frontend application that uses an open API backend.
> Then we will ask for a change on the fly during the call.
> _(paraphrased)_

Repo location:  https://github.com/gregsandell/todo-fastapi

## Solution Description
* The frontend is a React app that was scaffolded with vite.
  * The React code is in the project root
* The backend is a python/FastAPI app
  * The backend code is in the `/backend` folder.
* The frontend app is a simple **TO DO** app
* The code layout/styling is from [semantic-ui-react](https://react.semantic-ui.com/)


## Assumptions:  
* python is installed and available from terminal
* `yarn` or `npm` is installed
* Node 23 is installed and active
  * It will probably run under lower versions, but this hasn't been checked.

## Build Instructions for the Terminal

2. Have two open terminals
2. In terminal A (project root): `yarn` or `npm i`
3. In terminal B (`/src/backend`): Create and activate a python environment, e.g. 
   * `python -m venv .venv` and 
   * `source .venv/bin/activate`
   * `uv sync`

## Run instructions
2. In terminal A (project root): `yarn dev` or `npm run dev`
3. In terminal B (`/backend`): `uvicorn app:app --reload`

## Prove successful run/build
> NOTE: **please use Safari** for the React app, as semantic-ui-react is still buggy in Chrome.
* http://localhost:5171 loads, and the `TO DO` UI is visible
* http://localhost:8000/docs loads, and shows the API
* In the UI, test adding, removing and completing tasks
