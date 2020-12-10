import { CHANGE_INPUT, INSERT, REMOVE, UPDATE, INPUT_TASK, READ } from "../types";

export const insert = (id, text) => ({
    type: INSERT,
    resource : (id, text)
});

export const remove = (id) => ({
    type: REMOVE,
    id
});

export const update = (id, text) => ({
    type: UPDATE,
    resource: (id, text)
});

export const changeInput = (text) => ({
    type: CHANGE_INPUT,
    text
});

export const inputTask = (task) => ({
    type: INPUT_TASK,
    payload: {
        task
    }
})

export const read = (id) => ({
    type: READ,
    payload: {
        id
    }
})