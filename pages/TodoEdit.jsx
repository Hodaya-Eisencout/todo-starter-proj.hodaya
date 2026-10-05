import { todoService } from "../services/todo.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import {
    store,
    ADD_TODO,
    UPDATE_TODO,
} from "../store/store.js"

const { useState, useEffect } = React
const { useNavigate, useParams } = ReactRouterDOM

export function TodoEdit() {

    const [todoToEdit, setTodoToEdit] = useState(todoService.getEmptyTodo())
    const navigate = useNavigate()
    const params = useParams()

    useEffect(() => {
        if (params.todoId) loadTodo()
    }, [])

    function loadTodo() {
        todoService.get(params.todoId)
            .then(setTodoToEdit)
            .catch(err => console.log('err:', err))
    }

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break

            case 'checkbox':
                value = target.checked
                break

            default:
                break
        }

        setTodoToEdit(prevTodoToEdit => ({
            ...prevTodoToEdit,
            [field]: value,
        }))
    }

    function onSaveTodo(ev) {
        ev.preventDefault()

        const isEdit = !!todoToEdit._id

        todoService.save(todoToEdit)
            .then(savedTodo => {

                store.dispatch({
                    type: isEdit ? UPDATE_TODO : ADD_TODO,
                    todo: savedTodo,
                })

                showSuccessMsg(`Todo Saved (id: ${savedTodo._id})`)
                navigate('/todo')
            })
            .catch(err => {
                showErrorMsg('Cannot save todo')
                console.log('err:', err)
            })
    }

    const { txt, importance, isDone, color } = todoToEdit

    return (
        <section className="todo-edit">
            <form onSubmit={onSaveTodo}>

                <label htmlFor="txt">Text:</label>
                <input
                    onChange={handleChange}
                    value={txt}
                    type="text"
                    name="txt"
                    id="txt"
                />

                <label htmlFor="importance">Importance:</label>
                <input
                    onChange={handleChange}
                    value={importance}
                    type="number"
                    name="importance"
                    id="importance"
                />

                <label htmlFor="isDone">isDone:</label>
                <input
                    onChange={handleChange}
                    checked={isDone}
                    type="checkbox"
                    name="isDone"
                    id="isDone"
                />

                <label htmlFor="color">Color:</label>
                <input
                    onChange={handleChange}
                    value={color || '#ffffff'}
                    type="color"
                    name="color"
                    id="color"
                />

                <button>Save</button>
            </form>
        </section>
    )
}