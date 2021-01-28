import hypereact from '../services/hypereact';

// init store data
hypereact({
  username: window.localStorage.getItem('username'),
  accessToken: window.localStorage.getItem('accessToken'),
  sidebarCollapsed: false,
  todos: {},
  ids: [],
  selectedId: '',
  searchTerm: '',
  filter: 'all'
});
