import hypereact from '../services/hypereact';
import TodosLoaded from './TodosLoaded';
import update from 'immhelper';
import { getTodos as DbGetTodos } from '../services/db';

export const dispatch = () => (state, dbGetTodos, todosLoaded) => {
  // do nothing if already triggered
  if (state.todoStatus) return state;

  // call firestore to load todo list
  dbGetTodos(state.accessToken).then(
    snapshot => {
      const ids = [];
      const todos = {};
      // collect document data
      snapshot.forEach(doc => {
        todos[doc.id] = doc.data();
        ids.push(doc.id);
      });

      todosLoaded('success', ids, todos);
    },
    () => todosLoaded('failure')
  );

  return update(state, {
    // mark todoStatus is loading
    todoStatus: ['set', 'loading']
  });
};

export default hypereact({
  actions: [DbGetTodos, TodosLoaded],
  dispatch
});
