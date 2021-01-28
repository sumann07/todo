import hypereact from '../services/hypereact';

/**
 * toggle sidebarCollapsed
 */
export const dispatch = () => state => !state;

export default hypereact({
  // action must update sidebarCollapsed only
  state: 'sidebarCollapsed',
  dispatch
});
