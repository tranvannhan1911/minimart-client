import { HomeOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import React, {Component, useState} from 'react';
import { Breadcrumb, Layout, Affix, Space, Col, Row, Button } from 'antd';
import { lazy, Suspense } from "react";
import { Route, Routes , useMatch, useNavigate} from "react-router-dom";
import Loading from '../../basic/loading';
import paths from '../../../utils/paths'
const { Content } = Layout;

const ListForm = lazy(() => import("../templates/listform"));
const CustomerListForm = lazy(() => import("../customer/listform"));
const CustomerChangeForm = lazy(() => import("../customer/changeform"));
const StaffListForm = lazy(() => import("../staff/listform"));
const StaffChangeForm = lazy(() => import("../staff/changeform"));
const CustomerGroupListForm = lazy(() => import("../customer_group/listform"));
const CustomerGroupChangeForm = lazy(() => import("../customer_group/changeform"));
const SupplierListForm = lazy(() => import("../supplier/listform"));
const SupplierChangeForm = lazy(() => import("../supplier/changeform"));


const MyContent = (props) => {
    const [container, setContainer] = useState(null);
    const [breadcrumb, setBreadcrumb] = useState(false);
    const [breadcrumb_extras, setBreadcrumbExtras] = useState(null);
    const navigate = useNavigate();

    const breadcrumbComponent = () => {
        console.log(paths.customer.list);
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
                
                <Row wrap={false} className="action">
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
                            {breadcrumb_extras}
                        </Space>
                    </Col>
                </Row>
            </Affix>
        )
    }

    // const getRoutes = () => {

    // }

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
                        <Route path={paths.customer.rlist} key={paths.customer.key}
                            element={<CustomerListForm setBreadcrumb={setBreadcrumb}/>} />
                        <Route path={paths.customer.radd} key={paths.customer.key}
                            element={<CustomerChangeForm 
                            breadcrumb_extras={breadcrumb_extras} setBreadcrumbExtras={setBreadcrumbExtras} 
                            setBreadcrumb={setBreadcrumb} is_create={true}/>} />
                        <Route path={paths.customer.rchange} key={paths.customer.key}
                            element={<CustomerChangeForm
                            breadcrumb_extras={breadcrumb_extras} setBreadcrumbExtras={setBreadcrumbExtras}
                            setBreadcrumb={setBreadcrumb} is_create={false}/>} />
                        
                        <Route path={paths.staff.rlist} key={paths.staff.key}
                            element={<StaffListForm  setBreadcrumb={setBreadcrumb}/>} />
                        <Route path={paths.staff.radd} key={paths.staff.key}
                            element={<StaffChangeForm 
                            breadcrumb_extras={breadcrumb_extras} setBreadcrumbExtras={setBreadcrumbExtras} 
                            setBreadcrumb={setBreadcrumb} is_create={true}/>} />
                        <Route path={paths.staff.rchange} key={paths.staff.key}
                            element={<StaffChangeForm
                            breadcrumb_extras={breadcrumb_extras} setBreadcrumbExtras={setBreadcrumbExtras}
                            setBreadcrumb={setBreadcrumb} is_create={false}/>} />

                        <Route path={paths.customer_group.rlist} key={paths.customer_group.key}
                            element={<CustomerGroupListForm  setBreadcrumb={setBreadcrumb}/>} />
                        <Route path={paths.customer_group.radd} key={paths.customer_group.key}
                            element={<CustomerGroupChangeForm 
                            breadcrumb_extras={breadcrumb_extras} setBreadcrumbExtras={setBreadcrumbExtras} 
                            setBreadcrumb={setBreadcrumb} is_create={true}/>} />
                        <Route path={paths.customer_group.rchange} key={paths.customer_group.key}
                            element={<CustomerGroupChangeForm
                            breadcrumb_extras={breadcrumb_extras} setBreadcrumbExtras={setBreadcrumbExtras}
                            setBreadcrumb={setBreadcrumb} is_create={false}/>} />
                            
                        <Route path={paths.supplier.rlist} key={paths.supplier.key}
                            element={<SupplierListForm  setBreadcrumb={setBreadcrumb}/>} />
                        <Route path={paths.supplier.radd} key={paths.supplier.key}
                            element={<SupplierChangeForm 
                            breadcrumb_extras={breadcrumb_extras} setBreadcrumbExtras={setBreadcrumbExtras} 
                            setBreadcrumb={setBreadcrumb} is_create={true}/>} />
                        <Route path={paths.supplier.rchange} key={paths.supplier.key}
                            element={<SupplierChangeForm
                            breadcrumb_extras={breadcrumb_extras} setBreadcrumbExtras={setBreadcrumbExtras}
                            setBreadcrumb={setBreadcrumb} is_create={false}/>} />
                    </Routes >
                </Suspense>
            </Content>
        </div>
    )
    
}


export default MyContent;