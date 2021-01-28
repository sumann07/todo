import hypereact from '../services/hypereact';
import uuid from 'uuid';
import update from 'immhelper';
import { addTodo as DbAddTodo } from '../services/db';

export const dispatch = () => (state, dbAddTodo) => {
  const id = uuid();
  const todo = {
    title: 'New Todo',
    contents: 'New Todo contents',
    done: false
  };

  // call firestore
  dbAddTodo(state.accessToken, id, todo);

  // update state with specified specs
  return update(state, {
    // mark new todo as currently editing
    selectedId: ['set', id],
    // add new id to list
    ids: ['push', id],
    // add new todo object to map
    todos: ['set', id, todo]
  });
};

export default hypereact({
  actions: [DbAddTodo],
  dispatch
});
