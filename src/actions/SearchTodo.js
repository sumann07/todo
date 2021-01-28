import hypereact from '../services/hypereact';
import update from 'immhelper';

export const dispatch = term => state =>
  update(state, {
    searchTerm: term,
    // once search term changed, make sure user edit nothing
    selectedId: undefined
  });

export default hypereact({
  dispatch
});
