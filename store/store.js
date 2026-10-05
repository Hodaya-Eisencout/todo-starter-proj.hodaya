const { createStore } = Redux

const initialState = {
    todos: [],
    isLoading: false,
    filterBy: {
        txt: '',
        importance: 0,
    },
    user: null,
}

function appReducer(state = initialState, action) {
    switch (action.type) {

        default:
            return state
    }
}

export const store = createStore(appReducer)