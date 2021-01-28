import hypereact from '../services/hypereact';
import update from 'immhelper';

export const dispatch = () => state => {
  window.localStorage.removeItem('accessToken');
  return update(state, {
    // clean up some data
    accessToken: '',
    // make sure nothing selected for next logon
    selectedId: ''
  });
};

export default hypereact({
  dispatch
});
