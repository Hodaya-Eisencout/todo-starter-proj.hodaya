import { TodoFilter } from "../cmps/TodoFilter.jsx"
import { TodoList } from "../cmps/TodoList.jsx"
import { DataTable } from "../cmps/data-table/DataTable.jsx"
import { todoService } from "../services/todo.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import {
    store,
    SET_TODOS,
    REMOVE_TODO,
    UPDATE_TODO,
    SET_FILTER_BY,
    SET_IS_LOADING,
} from "../store/store.js"

const { useEffect } = React
const { useSelector } = ReactRedux
const { Link, useSearchParams } = ReactRouterDOM

export function TodoIndex() {

    const todos = useSelector(storeState => storeState.todos)
    const filterBy = useSelector(storeState => storeState.filterBy)
    const isLoading = useSelector(storeState => storeState.isLoading)

    const [searchParams, setSearchParams] = useSearchParams()

    useEffect(() => {
        setSearchParams(filterBy)

        store.dispatch({ type: SET_IS_LOADING, isLoading: true })

        todoService.query(filterBy)
            .then(todos => {
                store.dispatch({ type: SET_TODOS, todos })
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Cannot load todos')
            })
            .finally(() => {
                store.dispatch({ type: SET_IS_LOADING, isLoading: false })
            })
    }, [filterBy])

    function onSetFilterBy(filterBy) {
        store.dispatch({ type: SET_FILTER_BY, filterBy })
    }

    function onRemoveTodo(todoId) {
        if (!confirm('Are you sure you want to remove this todo?')) return

        todoService.remove(todoId)
            .then(() => {
                store.dispatch({ type: REMOVE_TODO, todoId })
                showSuccessMsg(`Todo removed`)
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Cannot remove todo ' + todoId)
            })
    }

    function onToggleTodo(todo) {
        const todoToSave = { ...todo, isDone: !todo.isDone }

        todoService.save(todoToSave)
            .then(savedTodo => {
                store.dispatch({ type: UPDATE_TODO, todo: savedTodo })
                showSuccessMsg(
                    `Todo is ${savedTodo.isDone ? 'done' : 'back on your list'}`
                )
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Cannot toggle todo ' + todo._id)
            })
    }

       return (
        <section className="todo-index">
            <TodoFilter
                filterBy={filterBy}
                onSetFilterBy={onSetFilterBy}
            />

            <div>
                <Link to="/todo/edit" className="btn">Add Todo</Link>
            </div>

            <h2>Todos List</h2>

            {isLoading && <div>Loading...</div>}

            {!todos.length && <p>No todos to show...</p>}

            <TodoList
                todos={todos}
                onRemoveTodo={onRemoveTodo}
                onToggleTodo={onToggleTodo}
            />

            <hr />

            <h2>Todos Table</h2>

            <div style={{ width: '60%', margin: 'auto' }}>
                <DataTable
                    todos={todos}
                    onRemoveTodo={onRemoveTodo}
                />
            </div>
        </section>
    )
}