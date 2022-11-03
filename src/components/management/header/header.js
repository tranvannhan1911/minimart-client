import React, { useEffect, useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { PageHeader, Button, Menu, Dropdown, Typography } from 'antd';
import './header.css';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import store from '../../../store/store';



const Header = (props) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({})
  const [now, setNow] = useState()
  const [welcome, setWelcome] = useState()

  useEffect(() => {
    
    store.subscribe(() => {
      setUserInfo(store.getState().user.info)
    })

    setInterval(() => {
      var today = new Date();
      var _welcome = `bây giờ là ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()} ngày ${today.getDate()}/${today.getMonth()+1}/${today.getFullYear()}`;
      setWelcome(_welcome)
    }, 1000)
  }, [])

  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: (
            <a rel="noopener noreferrer" href="/doi-mat-khau">
              Đổi mật khẩu
            </a>
          ),
        },
        {
          type: 'divider',
        },
        {
          key: '2',
          label: (
            <a rel="noopener noreferrer" onClick={() => {
              Cookies.remove("access")
              Cookies.remove("refresh")
              navigate("/dang-nhap")
            }}>
              Đăng xuất
            </a>
          ),
        },
      ]}
    />
  );

  return (
    <PageHeader
      ghost={false}
      title={React.createElement(props.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: 'trigger',
        onClick: () => props.setCollapsed(!props.collapsed),
      })}
      subTitle={
        <img src={require('../../../assets/logo.png')} style={{
          height: '40px',
          marginLeft: '10px'
        }}>
        </img>
      }
      extra={[
        // <Typography.Text>{welcome}</Typography.Text>,
        <Typography.Text style={{marginRight: '10px'}}>Xin chào {userInfo ? <Typography.Title level={5} style={{display: 'inline-block'}}> {userInfo.fullname}</Typography.Title> : ""}, {welcome} </Typography.Text>,
        <Dropdown overlay={menu} placement="bottomRight">
          <Button key="1" shape="circle" type="primary" icon={<UserOutlined />} />
        </Dropdown>
      ]}
    ></PageHeader>
  )
}


export default Header;