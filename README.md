# todo_fastapi

This is a React + OpenAPI application to satisfy the request:

> Please create a frontend application that uses an open API backend.
> Then we will ask for a change on the fly during the call.
> _(paraphrased)_

## Solution Description
* The frontend is a React app that was scaffolded with vite.
  * The React code is in the project root
* The backend is a python/FastAPI app
  * The backend code is in the `/backend` folder.
* The frontend app is a simple **TO DO** app
* The code layout/styling is from [semantic-ui-react](https://react.semantic-ui.com/)

## Build Instructions for the Terminal
1. Install Node 23 and make active (`nvm use` will help)
2. Have two open terminals
2. In terminal A (project root): `yarn` or `npm i`
3. In terminal B (`/backend`): Create and activate a python environment, e.g. 
   * `uv init` and 
   * `source .venv/bin/activate`

## Run instructions
2. In terminal A (project root): `yarn dev` or `npm run dev`
3. In terminal B (`/backend`): `uvicorn app:app --reload`

## Prove successful run/build
* http://localhost:5171 loads and the `TO DO` UI is visible
* http://localhost:8000/docs loads and shows the API
* In the UI, test adding, removing and completing tasks
