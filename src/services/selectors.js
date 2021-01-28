import { createSelector } from 'reselect';

export const filterSelector = state => state.filter;
export const todosSelector = state => state.todos;
export const idsSelector = state => state.ids;
export const searchTermSelector = state => state.searchTerm;
export const filteredIdsSelector = createSelector(
  idsSelector,
  todosSelector,
  searchTermSelector,
  (ids, todos, searchTerm) => {
    searchTerm = searchTerm.trim().toLowerCase();
    if (!searchTerm) {
      return ids;
    }
    return ids.filter(id => {
      const todo = todos[id];
      return (
        todo.title.toLowerCase().indexOf(searchTerm) !== -1
        //|| todo.contents.toLowerCase().indexOf(searchTerm) !== -1
      );
    });
  }
);
// collect all todos
export const allTodosSelector = createSelector(filteredIdsSelector, ids => ids);
// collect all active todos
export const activeTodosSelector = createSelector(
  filteredIdsSelector,
  todosSelector,
  (ids, todos) => ids.filter(id => !todos[id].done)
);
// collect all done todos
export const doneTodosSelector = createSelector(
  filteredIdsSelector,
  todosSelector,
  (ids, todos) => ids.filter(id => todos[id].done)
);
