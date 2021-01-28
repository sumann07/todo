import React from 'react';
import hypereact from '../services/hypereact';
import FilterTodo from '../actions/FilterTodo';
import { Menu, Icon, Badge } from 'antd';
import Logout from '../actions/Logout';
import styled from 'styled-components';
import { mobileDevice } from '../services/responsive';
import {
  allTodosSelector,
  doneTodosSelector,
  activeTodosSelector
} from '../services/selectors';

const StyledBadge = styled(Badge)`
  @media ${mobileDevice} {
    display: none !important;
  }
`;

// show only icon for mobile device
const StyledLogout = styled.span`
  @media ${mobileDevice} {
    span {
      display: none !important;
    }
  }
`;

export function render(props) {
  const {
    filter,
    allCount,
    activeCount,
    doneCount,
    filterAll,
    filterDone,
    filterActive,
    logout,
    username
  } = props;
  return (
    <Menu
      mode="horizontal"
      selectedKeys={[filter]}
      style={{ lineHeight: '64px', float: 'right' }}
    >
      <Menu.Item key="all" onClick={filterAll}>
        All
        <StyledBadge
          count={allCount}
          offset={[10, -5]}
          showZero
          style={{ backgroundColor: 'gray' }}
        />
      </Menu.Item>
      <Menu.Item key="active" onClick={filterActive}>
        Active
        <StyledBadge count={activeCount} offset={[10, -5]} showZero />
      </Menu.Item>
      <Menu.Item key="done" onClick={filterDone}>
        Done
        <StyledBadge
          count={doneCount}
          offset={[10, -5]}
          showZero
          style={{ backgroundColor: 'green' }}
        />
      </Menu.Item>
      <Menu.Item key="logout" onClick={logout}>
        <StyledLogout>
          <Icon type="poweroff" />
          <span>Logout ({username})</span>
        </StyledLogout>
      </Menu.Item>
    </Menu>
  );
}

export default hypereact({
  actions: [FilterTodo, Logout],
  state: state => {
    const { filter, username } = state;
    return {
      filter,
      // for displaying username inside logout button
      username,
      // collect all filtered item count
      allCount: allTodosSelector(state).length,
      activeCount: activeTodosSelector(state).length,
      doneCount: doneTodosSelector(state).length
    };
  },
  dispatch: (props, filterTodo, logout) => ({
    logout,
    // define shorthands for filtering actions
    filterAll: () => filterTodo('all'),
    filterActive: () => filterTodo('active'),
    filterDone: () => filterTodo('done')
  }),
  render
});
