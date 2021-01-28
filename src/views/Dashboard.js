import React from 'react';
import hypereact from '../services/hypereact';
import styled from 'styled-components';
import ToggleSidebar from '../actions/ToggleSidebar';
import 'antd/dist/antd.css';
import TodoList from './TodoList';
import TodoItem from './TodoItem';
import FilterBar from './FilterBar';
import { mobileDevice } from '../services/responsive';
import { Layout, Icon } from 'antd';
import SearchBox from './SearchBox';
const { Header, Content, Sider } = Layout;

const Wrapper = styled.div`
  height: 100vh;

  @media ${mobileDevice} {
    min-height: calc(100vh - 50px);

    > .ant-layout {
      height: auto !important;
    }
  }
`;

const Logo = styled.div`
  height: 32px;
  line-height: 32px;
  margin: 14px;
  margin-left: 30px;
  font-variant: small-caps;
  font-family: arial;
  font-size: 22px;
  color: white;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const StyledContent = styled(Content)`
  margin: 24px 16px;
  padding: 24px;
  background: #fff;
  min-height: 280px;

  @media ${mobileDevice} {
    min-height: calc(100vh - 110px);
  }
`;

const StyledSider = styled(Sider)`
  @media ${mobileDevice} {
    position: absolute !important;
    height: 100vh !important;
    z-index: 1;
  }
`;

const SiderTrigger = styled.div`
  position: absolute;
  top: 65px;
  right: -32px;
  width: 36px;
  font-size: 18px;
  background: #001529;
  color: white;
  padding: 5px;
  text-align: center;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  cursor: pointer;
  display: ${
    // make sure that user can click on trigger if it is collapsed
    props => (props.collapsed ? 'block' : 'none')
  };

  @media ${mobileDevice} {
    display: block;
  }
`;

const SearchBoxWrapper = styled.div`
  margin: 0 10px;
`;

export function render({
  noTodo,
  sidebarCollapsed,
  selectedId,
  toggleSidebar,
  logout
}) {
  return (
    <Wrapper>
      <Layout style={{ height: '100%' }}>
        <StyledSider
          collapsedWidth={0}
          trigger={null}
          width={250}
          collapsed={sidebarCollapsed}
        >
          <SiderTrigger onClick={toggleSidebar} collapsed={sidebarCollapsed}>
            <Icon type={sidebarCollapsed ? 'menu-unfold' : 'menu-fold'} />
          </SiderTrigger>

          <Logo collapsed={sidebarCollapsed}>
            {sidebarCollapsed ? 'Todo' : 'Todo App'}
          </Logo>
          <SearchBoxWrapper>
            <SearchBox />
          </SearchBoxWrapper>
          {!sidebarCollapsed && <TodoList />}
        </StyledSider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <FilterBar />
          </Header>
          <StyledContent>
            {selectedId ? (
              <TodoItem id={selectedId} />
            ) : noTodo ? (
              <p>
                Click <Icon type="plus" /> Add Todo for creating new one
              </p>
            ) : (
              <p>
                <Icon type="arrow-left" /> Select todo to edit
              </p>
            )}
          </StyledContent>
        </Layout>
      </Layout>
    </Wrapper>
  );
}

export default hypereact({
  actions: [ToggleSidebar],
  state: ({ sidebarCollapsed, selectedId, ids }) => ({
    // flag to detect there is any todo or not
    // we should display hint message base on this
    noTodo: !ids.length,
    sidebarCollapsed,
    selectedId
  }),
  dispatch: (props, toggleSidebar) => ({ toggleSidebar }),
  render
});
