import React from 'react';
import { Icon, Form, Input, Button, Row, Col, Switch } from 'antd';
import hypereact from '../services/hypereact';
import SaveTodo from '../actions/SaveTodo';
import RemoveTodo from '../actions/RemoveTodo';
import styled from 'styled-components';
import { mobileDevice } from '../services/responsive';

const DoneFormItem = styled(Form.Item)`
  @media ${mobileDevice} {
    .ant-form-item-label {
      width: auto !important;
      padding-bottom: 0;
      margin-right: 5px;
      display: inline-block;
    }

    .ant-form-item-control-wrapper {
      width: auto !important;
      display: inline-block;
      vertical-align: middle;
    }
  }
`;

const FormActions = styled(Form.Item)`
  @media ${mobileDevice} {
    .ant-form-item-children {
      display: flex;

      button {
        flex: 1;
        &:first-child {
          margin-right: 5px;
        }

        + button {
          margin-left: 5px;
        }
      }
    }
  }
`;

const TodoContents = styled(Input.TextArea)`
  height: calc(100vh - 230px) !important;
  @media ${mobileDevice} {
    height: 400px !important;
  }
`;

export function render(props) {
  const {
    title,
    contents,
    done,
    save,
    remove,
    form: { getFieldDecorator, validateFields, resetFields }
  } = props;

  function handleSubmit(e) {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        save(values);
        resetFields();
      }
    });
  }

  return (
    <Form onSubmit={handleSubmit} className="login-form">
      <Row gutter={16}>
        <Col md={12} sm={24}>
          <Form.Item>
            {getFieldDecorator('title', {
              initialValue: title,
              rules: [{ required: true, message: 'Please input title' }]
            })(
              <Input
                prefix={
                  <Icon type="edit" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                autoFocus={true}
                placeholder="Title"
              />
            )}
          </Form.Item>
        </Col>
        <Col md={4} sm={8}>
          <DoneFormItem
            label="Done"
            labelCol={{ md: 12 }}
            wrapperCol={{ md: 12 }}
          >
            {getFieldDecorator('done', {
              initialValue: done,
              valuePropName: 'checked'
            })(<Switch />)}
          </DoneFormItem>
        </Col>
        <Col md={8} sm={16} style={{ textAlign: 'right' }}>
          <FormActions>
            <Button type="primary" htmlType="submit">
              <Icon type="save" />
              Save
            </Button>{' '}
            <Button type="danger" onClick={remove}>
              <Icon type="delete" />
              Delete
            </Button>
          </FormActions>
        </Col>
      </Row>
      <Form.Item>
        {getFieldDecorator('contents', {
          initialValue: contents
        })(
          <TodoContents
            prefix={<Icon type="edit" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Contents"
          />
        )}
      </Form.Item>
    </Form>
  );
}

export default hypereact({
  state: ({ todos }, { id }) => ({
    id,
    contents: todos[id].contents,
    title: todos[id].title,
    done: todos[id].done
  }),
  actions: [SaveTodo, RemoveTodo],
  dispatch: (props, saveTodo, removeTodo) => ({
    save: data => saveTodo(props.id, data),
    remove: () => removeTodo(props.id)
  }),
  render: Form.create({
    mapPropsToFields({ title, contents, done }) {
      return {
        title: Form.createFormField(title),
        contents: Form.createFormField(contents),
        done: Form.createFormField(done)
      };
    }
  })(render)
});
