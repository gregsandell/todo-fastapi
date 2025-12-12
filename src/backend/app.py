# app.py
from typing import Optional, List
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Field, Session, create_engine, select
from datetime import datetime

# ---- Models ----
class TodoBase(SQLModel):
    text: str
    completed: bool = False

class Todo(TodoBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TodoCreate(SQLModel):
    text: str

class TodoUpdate(SQLModel):
    text: Optional[str] = None
    completed: Optional[bool] = None

# ---- DB ----
DATABASE_URL = "sqlite:///./todos.db"
engine = create_engine(DATABASE_URL, echo=False)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

# ---- App ----
app = FastAPI(title="Todo API", version="1.0.0")

# Allow local React dev server (adjust origin for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# List
@app.get("/todos", response_model=List[Todo])
def list_todos():
    with Session(engine) as session:
        todos = session.exec(select(Todo).order_by(Todo.created_at)).all()
        return todos

# Create
@app.post("/todos", response_model=Todo, status_code=status.HTTP_201_CREATED)
def create_todo(todo_in: TodoCreate):
    todo = Todo(text=todo_in.text)
    with Session(engine) as session:
        session.add(todo)
        session.commit()
        session.refresh(todo)
        return todo

# Read
@app.get("/todos/{todo_id}", response_model=Todo)
def read_todo(todo_id: int):
    with Session(engine) as session:
        todo = session.get(Todo, todo_id)
        if not todo:
            raise HTTPException(status_code=404, detail="Todo not found")
        return todo

# Update (partial allowed via TodoUpdate)
@app.put("/todos/{todo_id}", response_model=Todo)
def update_todo(todo_id: int, todo_in: TodoUpdate):
    with Session(engine) as session:
        todo = session.get(Todo, todo_id)
        if not todo:
            raise HTTPException(status_code=404, detail="Todo not found")
        if todo_in.text is not None:
            todo.text = todo_in.text
        if todo_in.completed is not None:
            todo.completed = todo_in.completed
        session.add(todo)
        session.commit()
        session.refresh(todo)
        return todo

# Delete
@app.delete("/todos/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(todo_id: int):
    with Session(engine) as session:
        todo = session.get(Todo, todo_id)
        if not todo:
            raise HTTPException(status_code=404, detail="Todo not found")
        session.delete(todo)
        session.commit()
        return None

# Note: FastAPI auto serves /openapi.json and /docs
