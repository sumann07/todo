import React from 'react';
import hypereact from '../services/hypereact';
import Dashboard from './Dashboard';
import Login from './Login';

export function render({ accessToken }) {
  if (accessToken) {
    return <Dashboard />;
  }
  return <Login />;
}

export default hypereact({
  state: ({ accessToken }) => ({ accessToken }),
  render
});
