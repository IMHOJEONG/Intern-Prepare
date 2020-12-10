import {createStore} from "redux";
import { rootReducer } from "./configureStore";
import thunk from 'redux-thunk';


export const store = createStore(rootReducer);