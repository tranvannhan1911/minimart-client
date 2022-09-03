import React, {Component} from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
  } from '@ant-design/icons';
import { PageHeader, Button, Menu, Dropdown} from 'antd';
import './header.css';


const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: (
            <a target="_blank" rel="noopener noreferrer" href="/doi-mat-khau">
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
            <a target="_blank" rel="noopener noreferrer" href="/dang-xuat">
              Đăng xuất
            </a>
          ),
        },
      ]}
    />
  );

const Header = (props) => {
    return (
        <PageHeader
        ghost={false}
        title={React.createElement(props.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: () => props.setCollapsed(!props.collapsed),
        })}
        extra={[
            
          <Dropdown overlay={menu} placement="bottomRight">
            <Button key="1" shape="circle" type="primary" icon={<UserOutlined />} />
          </Dropdown>
        ]}
        ></PageHeader>
    )
}


export default Header;