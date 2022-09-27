import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Select, message, Space, Popconfirm, Upload, Row, Col, Checkbox } from 'antd';
import OrderItem from './item';
import api from '../../../api/apis';
import messages from '../../../utils/messages';
const { Option } = Select;

const TabContent = (props) => {

    

    return (

        <Form>
            <Row>
                <Col span={16} style={{paddingRight: '10px'}}>
                    <OrderItem baseUnitOptions={props.baseUnitOptions}/>
                </Col>
                <Col span={8} style={{paddingLeft: '10px', borderLeft: '1px solid #eee'}}>
                    <Form.Item label="Khách hàng" name="customer" >
                    <Select
                        style={{
                          width: '100%',
                        }}
                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                      >
                        {props.customerOptions}
                      </Select>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};

export default TabContent;