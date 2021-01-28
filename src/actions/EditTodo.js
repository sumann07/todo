import hypereact from '../services/hypereact';

export const dispatch = id => id;

export default hypereact({
  // action msut update selectedId only
  state: 'selectedId',
  dispatch
});
