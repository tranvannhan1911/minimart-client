import {
    PlusOutlined, ImportOutlined,
    ExportOutlined, ReloadOutlined
  } from '@ant-design/icons';
import { Button, Col, Row, Space } from 'antd';
import { Typography } from 'antd';
import React, { useState } from 'react';
import MyTable from '../Table/Table';
import './ListForm.css';
const { Title } = Typography;

const ListForm = () => {
    return (
        <div>
            <Row wrap={false} className="action">
                <Col flex="null">
                    <Title level={4}>Sản phẩm</Title>
                </Col>
                <Col flex="auto">
                        {/* <Space direction="horizontal" style={{width: '100%', justifyContent: 'center'}}></Space> */}
                    <Space direction="horizontal" style={{width: '100%', justifyContent: 'end'}}>
                        <Button icon={<ReloadOutlined />}>Làm mới</Button>
                        <Button icon={<ImportOutlined />}>Nhập excel</Button>
                        <Button icon={<ExportOutlined />}>Xuất excel</Button>
                        <Button type="primary" icon={<PlusOutlined />}>Thêm</Button>
                    </Space>
                </Col>
            </Row>
            <MyTable></MyTable>
        </div>
    )
}

export default ListForm;