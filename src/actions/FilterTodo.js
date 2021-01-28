import hypereact from '../services/hypereact';
import update from 'immhelper';

export const dispatch = filter => state =>
  update(state, {
    filter: filter,
    // once filter mode selected, make sure user edit nothing
    selectedId: undefined
  });

export default hypereact({
  dispatch
});
