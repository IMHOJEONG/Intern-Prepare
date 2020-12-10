import {combineReducers} from "redux";
import resourcesReducer from "../reducers/resources";

export const rootReducer = combineReducers({
    resources: resourcesReducer
});



