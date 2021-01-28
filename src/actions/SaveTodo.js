import hypereact from '../services/hypereact';
import update from 'immhelper';
import { updateTodo as DbUpdateTodo } from '../services/db';

/**
 * update todo data by id
 */
export const dispatch = (id, data) => (state, dbUpdateTodo) => {
  // call firestore
  dbUpdateTodo(state.accessToken, id, data);
  return update(state, {
    todos: {
      // merge todo data with new one
      [id]: ['assign', data]
    }
  });
};

export default hypereact({
  actions: [DbUpdateTodo],
  dispatch
});
