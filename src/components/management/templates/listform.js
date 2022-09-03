import {
    PlusOutlined, ImportOutlined,
    ExportOutlined, ReloadOutlined
  } from '@ant-design/icons';
import { Button, Col, Row, Space } from 'antd';
import { Typography } from 'antd';
import React, { useState } from 'react';
import './listform.css';
const { Title } = Typography;

const ListForm = (props) => {
    return (
        <div>
            <Row wrap={false} className="action">
                <Col flex="null">
                    <Title level={4}>{props.title}</Title>
                </Col>
                <Col flex="auto">
                    <Space direction="horizontal" style={{width: '100%', justifyContent: 'end'}}>
                        {props.actions}
                    </Space>
                </Col>
            </Row>
            <Space direction="horizontal" style={{width: '100%', justifyContent: 'start', marginBottom: '20px'}}>
                {props.extra_actions}
            </Space>
            {props.table}
        </div>
    )
}

export default ListForm;