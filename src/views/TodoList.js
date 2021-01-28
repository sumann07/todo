import React from 'react';
import { Menu, Icon } from 'antd';
import hypereact from '../services/hypereact';
import AddTodo from '../actions/AddTodo';
import EditTodo from '../actions/EditTodo';
import LoadTodos from '../actions/LoadTodos';
import styled from 'styled-components';
import {
  allTodosSelector,
  activeTodosSelector,
  doneTodosSelector
} from '../services/selectors';

const TodoTitle = styled.span`
  opacity: ${props => (props.done ? 0.5 : 1)} !important;
  text-decoration: ${props => (props.done ? 'line-through' : 'none')};
`;

export function render(props) {
  const { ids, todos, selectedId, addTodo, editTodo, todoStatus } = props;
  if (todoStatus !== 'success') {
    return <Icon type="loading" style={{ fontSize: 24 }} spin />;
  }
  return (
    <Menu theme="dark" mode="inline" selectedKeys={[selectedId]}>
      <Menu.Item key="add" onClick={addTodo}>
        <Icon type="plus" />
        <span>Add Todo</span>
      </Menu.Item>
      {ids.map(id => {
        const todo = todos[id];
        return (
          <Menu.Item key={id} onClick={() => editTodo(id)}>
            <Icon type="book" />
            <span>
              <TodoTitle done={todo.done}>{todo.title}</TodoTitle>
            </span>
          </Menu.Item>
        );
      })}
    </Menu>
  );
}

export default hypereact({
  actions: [AddTodo, EditTodo],
  state: state => {
    const { filter, selectedId, todos, todoStatus } = state;

    // load todos
    hypereact(LoadTodos);

    return {
      selectedId,
      ids: (filter === 'active'
        ? activeTodosSelector
        : filter === 'done'
          ? doneTodosSelector
          : allTodosSelector)(state),
      todos,
      todoStatus
    };
  },
  dispatch: (props, addTodo, editTodo) => ({ addTodo, editTodo }),
  render
});
