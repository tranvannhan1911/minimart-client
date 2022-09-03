import { HomeOutlined, UserOutlined, PlusOutlined } from '@ant-design/icons';
import React, {Component, useState} from 'react';
import { Breadcrumb, Layout, Affix, Space, Col, Row, Button } from 'antd';
import { lazy, Suspense } from "react";
import { Route, Routes , useMatch, useNavigate} from "react-router-dom";
import Loading from '../../basic/loading';
const { Content } = Layout;

const ListForm = lazy(() => import("../templates/listform"));
const CustomerListForm = lazy(() => import("../customer/listform"));
const CustomerChangeForm = lazy(() => import("../customer/changeform"));
const StaffListForm = lazy(() => import("../staff/listform"));


const MyContent = (props) => {
    const [container, setContainer] = useState(null);
    const [breadcrumb, setBreadcrumb] = useState(false);
    const navigate = useNavigate();

    const breadcrumbComponent = () => {
        if(!breadcrumb)
            return null
        
        let items = [];
        breadcrumb.forEach(bc => {
            items.push(
                <Breadcrumb.Item 
                    style={{
                        cursor: 'pointer'
                    }}
                    onClick={() => {if(bc.href)navigate(bc.href)}}
                >
                    {bc.title}
                </Breadcrumb.Item>
            )
        })


        return (
            <Affix target={() => container} style={{
                margin: '5px 16px 0px',
                padding: '20px 0px 0px',
            }}>
                <Breadcrumb>
                    <Breadcrumb.Item href="/quan-ly">
                        <HomeOutlined />
                    </Breadcrumb.Item>
                    {items}
                </Breadcrumb>
                {/* <Row wrap={false} className="action">
                    <Col flex="auto">
                        <Breadcrumb>
                            <Breadcrumb.Item href="/quan-ly">
                                <HomeOutlined />
                            </Breadcrumb.Item>
                            {items}
                        </Breadcrumb>
                    </Col>
                    <Col flex="null">
                        <Space direction="horizontal" style={{width: '100%', justifyContent: 'end'}}>
                            <Button type="primary" icon={<PlusOutlined />}>Thêm</Button>
                        </Space>
                    </Col>
                </Row> */}
            </Affix>
        )
    }

    return (
        <div ref={setContainer}>  
            {breadcrumbComponent()}
            <Content
            className="site-layout-background"
            style={{
                margin: '25px 16px',
                padding: 24,
                minHeight: 280,
            }}
            >
                {/* <ListForm></ListForm> */}
                <Suspense fallback={<Loading />}>
                    <Routes >
                        <Route path="" key="" element={<ListForm title="Chung"/>}/>
                        <Route path="khach-hang" key="khach-hang" 
                            element={<CustomerListForm setBreadcrumb={setBreadcrumb}/>} />
                        <Route path="khach-hang/them-moi" key="khach-hang" 
                            element={<CustomerChangeForm setBreadcrumb={setBreadcrumb} is_create={true}/>} />
                        <Route path="khach-hang/:customer_id" key="khach-hang" 
                            element={<CustomerChangeForm setBreadcrumb={setBreadcrumb} is_create={false}/>} />
                        
                        <Route path="nhan-vien" key="nhan-vien" element={<StaffListForm/>} />
                    </Routes >
                </Suspense>
            </Content>
        </div>
    )
    
}


export default MyContent;