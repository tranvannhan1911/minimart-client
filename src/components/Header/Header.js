import React, {Component} from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
  } from '@ant-design/icons';
import { PageHeader, Button, Menu, Dropdown} from 'antd';
import './Header.css';


const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
              1st menu item
            </a>
          ),
        },
        {
          key: '2',
          label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
              2nd menu item
            </a>
          ),
        },
        {
          key: '3',
          label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
              3rd menu item
            </a>
          ),
        },
      ]}
    />
  );
  

class Header extends Component{
    render(){
        return (
            <PageHeader
            ghost={false}
            title={React.createElement(this.props.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: () => this.props.setCollapsed(!this.props.collapsed),
            })}
            extra={[
                
                <Dropdown overlay={menu} placement="bottomRight">
                <Button key="1" shape="circle" type="primary" icon={<UserOutlined />} />
                </Dropdown>
            ]}
            ></PageHeader>
        )
    }
}


export default Header;