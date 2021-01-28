import hypereact from '../services/hypereact';
import update from 'immhelper';
import { deleteTodo as DbDeleteTodo } from '../services/db';

/**
 * remove todo by id
 */
export const dispatch = id => (state, dbDeleteTodo) => {
  // show confirmation
  if (!window.confirm('Are you sure you want to remove this todo item ?')) {
    return;
  }

  // call firestore
  dbDeleteTodo(state.accessToken, id);

  return update(state, {
    // remove todo from map by unset prop
    todos: {
      [id]: ['unset']
    },
    // remove id from list
    ids: ['remove', id],
    // select first avail todo after removing
    selectedId: state.ids.filter(x => x !== id)[0]
  });
};

export default hypereact({
  actions: [DbDeleteTodo],
  dispatch
});
