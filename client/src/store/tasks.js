import ACTypes from "./types";

const initialState = {
  tasks: [],
}

export const tasksReducer = (state = initialState, action) => {
  switch (action.type) {

    case ACTypes.SET_TASKS:
      return { ...state, tasks: action.payload }

    default:
      return state;
  }
}
