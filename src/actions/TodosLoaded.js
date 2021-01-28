import hypereact from '../services/hypereact';
import update from 'immhelper';

/**
 * this action will be called once todo list's loading success/failure
 */
export const dispatch = (status, ids = [], todos = {}) => state =>
  update(state, {
    todoStatus: ['set', status],
    // merge with existing todos
    todos: ['assign', todos],
    // merge with existing ids
    ids: ['push', ...ids]
  });

export default hypereact({
  dispatch
});
