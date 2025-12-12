import { useState, useEffect } from "react";
import {
    Button,
    Checkbox,
    Container,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    Header,
    Icon,
    Input,
    List,
    Menu,
    MenuMenu,
    Segment,
} from "semantic-ui-react";
import styles from "./styles.module.css"

interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

const API_BASE: string = "http://localhost:8000" // e.g. "" or "http://localhost:8000"

const ToDoFixed: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [todoValue, setTodoValue] = useState<string>("");
    const [todoFilter, setTodoFilter] = useState<string>("all");

    useEffect(() => {
        fetchTodos();
    }, []);

    useEffect(() => {
        setTodoValue("");
    }, [todos]);

    async function fetchTodos() {
        try {
            const res = await fetch(`${API_BASE}/todos`);
            if (!res.ok) throw new Error("Failed to fetch todos");
            const data = await res.json();
            setTodos(data);
        } catch (err) {
            console.error(err);
        }
    }

    async function addTodo() {
        if (todoValue.trim() === "") return;
        try {
            const res = await fetch(`${API_BASE}/todos`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: todoValue }),
            });
            if (!res.ok) throw new Error("Failed to create");
            const created = await res.json();
            // Option A: append optimistically
            setTodos((prev) => [...prev, created]);
            // Option B: re-fetch the list instead of optimistic append
            // await fetchTodos();
        } catch (err) {
            console.error(err);
        }
    }

    async function toggleTodo(todo: Todo) {
        // flip locally for snappier UI
        const updated = { ...todo, completed: !todo.completed };
        setTodos((prev) => prev.map((t) => (t.id === todo.id ? updated : t)));

        // persist
        try {
            const res = await fetch(`${API_BASE}/todos/${todo.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ completed: updated.completed }),
            });
            if (!res.ok) {
                throw new Error("Failed to update");
            }
            // optionally refresh from server:
            // await fetchTodos();
        } catch (err) {
            console.error(err);
            // rollback on error
            setTodos((prev) => prev.map((t) => (t.id === todo.id ? todo : t)));
        }
    }

    async function removeTodo(id: number) {
        // optimistic remove
        const old = todos;
        setTodos((prev) => prev.filter((t) => t.id !== id));
        try {
            const res = await fetch(`${API_BASE}/todos/${id}`, {
                method: "DELETE",
            });
            if (!res.ok && res.status !== 204) {
                throw new Error("Failed to delete");
            }
        } catch (err) {
            console.error(err);
            // rollback
            setTodos(old);
        }
    }

    const visibleTodos = todos.filter((todo) => {
        switch (todoFilter) {
            case "pending":
                return todo.completed === false;
            case "completed":
                return todo.completed === true;
            default:
                return true;
        }
    });

    return (
        <Container className={styles.todoContainer}>
            <Header as="h1" textAlign="center">
                Todo List
            </Header>
            <Menu attached="top">
                <MenuMenu position="right">
                    <Dropdown value={todoFilter} item icon="filter" text="Filter" simple>
                        <DropdownMenu>
                            <DropdownItem
                                active={todoFilter === "all"}
                                value="all"
                                onClick={(_, { value }) => setTodoFilter(value as string)}
                            >
                                All
                            </DropdownItem>
                            <DropdownItem
                                active={todoFilter === "completed"}
                                value="completed"
                                onClick={(_, { value }) => setTodoFilter(value as string)}
                            >
                                Completed
                            </DropdownItem>
                            <DropdownItem
                                active={todoFilter === "pending"}
                                value="pending"
                                onClick={(_, { value }) => setTodoFilter(value as string)}
                            >
                                Pending
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </MenuMenu>
            </Menu>

            <Segment attached="bottom">
                <List divided>
                    {visibleTodos.map((todo) => (
                        <List.Item key={todo.id} style={{ padding: "20px 0px" }}>
                            <List.Content floated="right">
                                <Button
                                    size="small"
                                    icon
                                    color="red"
                                    onClick={() => removeTodo(todo.id)}
                                >
                                    <Icon name="trash" />
                                </Button>
                            </List.Content>

                            <List.Content style={{ textAlign: "left", display: "flex" }}>
                                <Checkbox
                                    toggle
                                    checked={todo.completed}
                                    onChange={() => toggleTodo(todo)}
                                />
                                <Header as="h3" style={{ display: "inline-block" }}>
                  <span
                      style={{
                          marginLeft: "10px",
                          textDecoration: todo.completed ? "line-through" : "none",
                      }}
                  >
                    {todo.text}
                  </span>
                                </Header>
                            </List.Content>
                        </List.Item>
                    ))}
                </List>

                <Input
                    type="text"
                    value={todoValue}
                    onChange={(_, { value }) => setTodoValue(value as string)}
                    placeholder="Enter a new todo"
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === "Enter") addTodo();
                    }}
                />
                <Button type="submit" primary onClick={() => addTodo()}>
                    Add Todo
                </Button>
            </Segment>

            <Segment>
                <Header as="h3" block>
                    How to use
                </Header>
                <List bulleted>
                    <List.Item>
                        <strong>View List:</strong> All tasks display in a list with text, a
                        toggle checkbox, and a delete button.
                    </List.Item>
                    <List.Item>
                        <strong>Add Item:</strong> User can add a new task via input and
                        &quot;Add Todo&quot; button or Enter key.
                    </List.Item>
                    <List.Item>
                        <strong>Toggle Complete:</strong> Clicking the checkbox toggle marks
                        a task as complete/incomplete and updates its style (overstrike).
                    </List.Item>
                    <List.Item>
                        <strong>Delete Item:</strong> Clicking the delete button removes the
                        task from the list.
                    </List.Item>
                    <List.Item>
                        <strong>Filter Tasks:</strong> User can filter tasks to show All,
                        Completed, or Pending items.
                    </List.Item>
                </List>
            </Segment>
        </Container>
    );
};

export default ToDoFixed;
