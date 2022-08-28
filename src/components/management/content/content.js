import React, {Component} from 'react';
import { Layout } from 'antd';
import ListForm from '../listform/listform';
const { Content } = Layout;



class MyContent extends Component{
    render(){
        return (
            <Content
            className="site-layout-background"
            style={{
                margin: '24px 16px',
                padding: 24,
                minHeight: 280,
            }}
            >
                <ListForm></ListForm>
            </Content>
        )
    }
}


export default MyContent;