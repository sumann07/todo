import React from 'react';
import hypereact from '../services/hypereact';
import SearchTodo from '../actions/SearchTodo';
import { Input } from 'antd';

export function render(props) {
  const { searchTerm, searchTodo } = props;

  function handleChange(e) {
    searchTodo(e.target.value);
  }

  return (
    <Input
      value={searchTerm}
      placeholder="Search todo..."
      onChange={handleChange}
    />
  );
}

export default hypereact({
  state: ({ searchTerm }) => ({ searchTerm }),
  actions: [SearchTodo],
  dispatch: (props, searchTodo) => ({ searchTodo }),
  render
});
