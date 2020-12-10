import { CHANGE_INPUT, INSERT, REMOVE, UPDATE, INPUT_TASK, READ } from "../types";

const initialState = {
    task: '',
    resourcesList: [],
    tasks: [],
    instanceset: [],
    instances: [],
    haconfigs: [],
    backup: [],
};

const resourcesReducer = (state = initialState, action ) => {

    switch (action.type) {
        case CHANGE_INPUT:
            return {
                ...state,
                task: action.text
            }
        case INSERT:
            const { id, text} = action.resource;
            return {
                ...state,
                resourcesList: state.resourcesList.concat({
                    id, text
                })
            };
        case REMOVE:
            return {
                ...state,
                resourcesList: state.resourcesList.filter(resource => resource.id !== action.id)
            }
        case UPDATE:
            return {
                ...state,
                resourcesList: state.resourcesList
            }
        case INPUT_TASK:
            return {
                ...state,
                tasks: action.payload.task
            }
        case READ:
            return {
                ...state
            }
        default:
            return state
    }
};

export default resourcesReducer;