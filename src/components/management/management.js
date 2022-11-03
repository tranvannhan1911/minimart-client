import { Layout } from 'antd';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import Header from './header/header';
import './management.css';
import { Typography } from 'antd';
import SideNav from './sidenav/sidenav';
import MyContent from './content/content';
import { AccountApi } from "../../api/apis"
import store, { setUser } from '../../store/store'
const { Sider } = Layout;

const Managememt = () => {
  const accountApi = new AccountApi();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [hasPerms, setHasPerms] = useState(false);
  const [isManager, setIsManager] = useState(false);

  const handleAuthentication = async () => {
    const token = accountApi.get_token()
    if(token.access == null || token.refresh == null){
      navigate('/dang-nhap')
      return
    }

    try{
      const response = await accountApi.get_info()
      console.log("account", response)
      if(response.data.code !=1){
        navigate('/dang-nhap')
      }else{
        // save to store
        
        // store.subscribe(() => console.log("store.getState", store.getState().user))
        const action = setUser(response.data.data)
        store.dispatch(action)
        // console.log("setUser", action, store.dispatch(setUser(response.data.data)))
        // console.log("store.getState", store.getState("user"))

        setHasPerms(true)
        accountApi.save_user(response)
        sessionStorage.setItem("idStaff", response.data.data.id);
        sessionStorage.setItem("nameStaff", response.data.data.fullname);
        sessionStorage.setItem("phoneStaff", response.data.data.phone);
        sessionStorage.setItem("isManager", response.data.data.is_manager);
        setIsManager(response.data.data.is_manager);
      }
    }catch(error){
      navigate('/dang-nhap')
    }
  }

  useEffect(() => {
    handleAuthentication()
  }, []);

  useEffect(() => {
      document.title = "Quản lý siêu thị mini NT"
  }, [])

  return (
    <Layout>{ hasPerms == false ? null :(
        <>
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
          <MyContent isManager={isManager} setIsManager={setIsManager}></MyContent>
        </Layout>
      </>
    )}
    </Layout>
  );
};

export default Managememt;
