import React from 'react';
import hypereact from '../services/hypereact';
import { Form, Icon, Input, Button } from 'antd';
import Login from '../actions/Login';

export function render(props) {
  const {
    username,
    login,
    form: { getFieldDecorator, validateFields }
  } = props;

  function handleSubmit(e) {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        login(values.username, values.password);
      }
    });
  }

  return (
    <Form
      onSubmit={handleSubmit}
      className="login-form"
      style={{ maxWidth: 300, margin: '40px auto' }}
    >
      <Form.Item>
        <h2>Login to Todo App</h2>
        <em>Account will be created if not exist</em>
        {getFieldDecorator('username', {
          initialValue: username,
          rules: [{ required: true, message: 'Please input your username!' }]
        })(
          <Input
            autoFocus={username ? false : true}
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Username"
          />
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('password', {
          rules: [{ required: true, message: 'Please input your username!' }]
        })(
          <Input
            autoFocus={username ? true : false}
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            type="password"
            placeholder="Password"
          />
        )}
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Log in
        </Button>
      </Form.Item>
    </Form>
  );
}

export default hypereact({
  actions: [Login],
  state: ({ username }) => ({ username }),
  dispatch: (props, login) => ({ login }),
  render: Form.create()(render)
});
