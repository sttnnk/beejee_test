import { legacy_createStore as createStore, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import { userReducer } from './user';
import { tasksReducer } from './tasks';

const composeEnhancers = composeWithDevTools();

const reducers = combineReducers({
  user: userReducer,
  tasks: tasksReducer,
});

export const store = createStore(reducers, composeEnhancers);
