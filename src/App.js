import { Layout } from 'antd';
import React, { useState } from 'react';
import Header from './components/Header/Header';
import 'antd/dist/antd.css';
import './App.css';
import { Typography } from 'antd';
import SideNav from './components/SideNav/SideNav';
import MyContent from './components/MyContent/MyContent';
const { Sider } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed} 
        style={{
          height: "100vh",
        }}>
        <SideNav collapsed={collapsed}></SideNav>
      </Sider>
      <Layout className="site-layout">
        <Header collapsed={collapsed} setCollapsed={setCollapsed}></Header>
        <MyContent></MyContent>
      </Layout>
    </Layout>
  );
};

export default App;
