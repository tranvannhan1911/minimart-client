import { Layout } from 'antd';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import Header from './header/header';
import './management.css';
import { Typography } from 'antd';
import SideNav from './sidenav/sidenav';
import MyContent from './content/content';
import { AccountApi } from "../../api/apis"
const { Sider } = Layout;

const Managememt = () => {
  const accountApi = new AccountApi();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleAuthentication = async () => {
    const token = accountApi.get_token()
    if(token.access == null || token.refresh == null){
      navigate('/dang-nhap')
      return
    }

    const account = await accountApi.get_info()
    console.log(account)
  }

  useEffect(() => {
    handleAuthentication()
  }, []);

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed} 
        style={{
          height: "100vh",
          overflow: 'auto',
        }}>
        <SideNav collapsed={collapsed}></SideNav>
      </Sider>
      <Layout className="site-layout" 
        style={{
          height: "100vh",
          overflow: 'auto',
        }}>
        <Header collapsed={collapsed} setCollapsed={setCollapsed}></Header>
        <MyContent></MyContent>
      </Layout>
    </Layout>
  );
};

export default Managememt;
