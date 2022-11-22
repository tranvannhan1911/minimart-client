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
  const [time, setTime] = useState()
  const [name, setName] = useState(sessionStorage.getItem("nameStaff"))

  useEffect(() => {

    store.subscribe(() => {
      console.log(">>>>>>>>>>>>> change state user", store.getState().user.info)
      setUserInfo(store.getState().user.info)
    })

    setInterval(() => {
      var today = new Date();
      const hour = today.getHours() < 10 ? "0" + today.getHours() : today.getHours()
      const minute = today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes()
      const second = today.getSeconds() < 10 ? "0" + today.getSeconds() : today.getSeconds()
      const date = today.getDate() < 10 ? "0" + today.getDate() : today.getDate()
      const month = today.getMonth() + 1 < 10 ? "0" + (today.getMonth() + 1) : today.getMonth() + 1
      var _welcome = `bây giờ là ${hour}:${minute}:${second} ngày ${date}/${month}/${today.getFullYear()}`;
      setWelcome(_welcome);
      if (today.getHours() >= 1 && today.getHours() < 11) {
        setTime("buổi sáng");
      } else if (today.getHours() >= 11 && today.getHours() < 13) {
        setTime("buổi trưa");
      } else if (today.getHours() >= 13 && today.getHours() < 18) {
        setTime("buổi chiều");
      } else {
        setTime("buổi tối");
      }
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
        <Typography.Text style={{ marginRight: '10px' }}>Chào {time} {userInfo.fullname ? <Typography.Title level={5} style={{ display: 'inline-block' }}> {userInfo.fullname}</Typography.Title> : ""}, {welcome} </Typography.Text>,
        <Dropdown overlay={menu} placement="bottomRight">
          <Button key="1" shape="circle" type="primary" icon={<UserOutlined />} />
        </Dropdown>
      ]}
    ></PageHeader>
  )
}


export default Header;