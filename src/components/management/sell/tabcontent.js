import {
    PlusOutlined
  } from '@ant-design/icons';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Select, message, Space, Popconfirm, Upload, Row, Col, Checkbox, Typography, Divider } from 'antd';
import OrderItem from './item';
import api from '../../../api/apis';
import messages from '../../../utils/messages';
import Promotion from './promotion';
const { Option } = Select;
const { TextArea } = Input;

const TabContent = (props) => {
    const [promotionLineOrderOption, setPromotionLineOrderOption] = useState([])

    const handlePromotionLineByOrder = async () => {
        // try {
            const params = {
                params: {
                    amount: 100000
                }
            }
            const response = await api.promotion_line.by_order(params)
            console.log(response.data)
            let options = [<Option key="default" value="">Không</Option>]
            options = options.concat(response.data.data.results.map(elm => {
                return (
                    <Option key={elm.id} value={elm.id}>{elm.title}</Option>
                )
            }))
            setPromotionLineOrderOption(options);
        // } catch (error) {
        //     message.error(messages.ERROR)
        // }
    }

    useEffect(() => {
        handlePromotionLineByOrder()
    }, [])

    useEffect(() => {
        console.log("customerOptions2", props.customerOptions)
    }, [props.customerOptions])

    return (

        <Form 
            layout="vertical"
        >
            <Row>
                <Col span={18} style={{paddingRight: '10px'}}>
                    <OrderItem baseUnitOptions={props.baseUnitOptions}/>
                </Col>
                <Col span={6} style={{paddingLeft: '10px', borderLeft: '1px solid #eee'}}>
                    <Form.Item label="Nhân viên bán hàng" name="user_created" >
                        <Select
                            showSearch
                            style={{
                            width: '100%',
                            textAlign: 'left'
                            }}
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                            key={props.staffOptions}
                        >
                            {props.staffOptions}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Khách hàng" name="customer" >
                        <Select
                            showSearch
                            style={{
                            width: '100%',
                            textAlign: 'left'
                            }}
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                            key={props.customerOptions}
                        >
                            {props.customerOptions}
                        </Select>
                    </Form.Item>
                    {/* <Divider/> */}
                    <Form.Item label="Khuyến mãi" name="promotion" >
                        {/* <Select
                            showSearch
                            style={{
                            width: '100%',
                            textAlign: 'left'
                            }}
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                            key={promotionLineOrderOption}
                        >
                            {promotionLineOrderOption}
                        </Select> */}
                            <div className='sb'>
                                <span>Mã KM</span>
                                <span>9818128128</span>
                            </div>
                            <div style={{textAlign: 'left'}}>
                                <span>Mua 100.000đ giảm 20% tối đa 20.000đ</span>
                            </div>
                    </Form.Item>
                    
                    <Form.Item label="Ghi chú" name="note" >
                      <TextArea rows={1} />
                    </Form.Item>
                    <Form.Item>
                        <div className='sb'>
                            <span>Tiền hàng</span>
                            <span>120.000 đ</span>
                        </div>
                        <div className='sb'>
                            <span>giảm giá</span>
                            <span>20.000 đ</span>
                        </div>
                        <div className='sb' style={{fontWeight: '600'}}>
                            <span>Thành tiền</span>
                            <span>100.000 đ</span>
                        </div>
                    </Form.Item>
                    <div className='sb'>
                        <div>
                            <Form.Item label="Tiền khách đưa">
                                <Input type='number'/>
                            </Form.Item>
                        </div>
                        <div>
                            <Form.Item label=" ">
                                <span>Trả lại 1.000đ</span>
                            </Form.Item>
                        </div>
                    </div>
                    <Form.Item >
                        
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<PlusOutlined />}
                            >Thêm hóa đơn</Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};

export default TabContent;