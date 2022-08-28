import { Layout } from 'antd';
import React, { useState } from 'react';
import Header from './header/header';
import './management.css';
import { Typography } from 'antd';
import SideNav from './sidenav/sidenav';
import MyContent from './content/content';
const { Sider } = Layout;

const Managememt = () => {
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

export default Managememt;
