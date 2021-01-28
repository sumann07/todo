import sha1 from 'sha1';
import hypereact from '../services/hypereact';
import update from 'immhelper';

export const dispatch = (username, password) => state => {
  // generate accessToken by hashing user and password
  // using accessToken as firestore's collection name
  // although this solution is less secure but no one can know collection name of each others
  const accessToken = sha1((username + '|' + password).toLowerCase());
  // remember username and accessToken for next time
  window.localStorage.setItem('username', username);
  window.localStorage.setItem('accessToken', accessToken);

  return update(state, {
    username: ['set', username],
    accessToken: ['set', accessToken],
    // reset store
    todoStatus: ['unset'],
    todos: ['set', {}],
    ids: ['set', []]
  });
};

export default hypereact({
  dispatch
});
