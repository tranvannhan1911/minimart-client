import {
    PlusOutlined, ShoppingCartOutlined
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
    const [promotionLineOrderOption, setPromotionLineOrderOption] = useState([]);
    const [totalProduct, setTotalProduct] = useState(0);
    const [total, setTotal] = useState(0);
    const [moneyChange, setMoneyChange] = useState(0);
    const [voucher, setVoucher] = useState(0);
    const [reset, setReset] = useState(false);
    const [form] = Form.useForm();
    const [staffOptions, setStaffOptions] = useState([]);
    const [customerOptions, setCustomerOptions] = useState([]);
    const [staff, setStaff] = useState(sessionStorage.getItem("nameStaff")+' - '+sessionStorage.getItem("phoneStaff"));
     

    const handleDataStaff = async () => {
        try {
            const response = await api.staff.list()
            // console.log(response.data)
            const options = response.data.data.results.map(elm => {
                return (
                    <Option key={elm.id} value={elm.id}>{elm.fullname} - {elm.phone}</Option>
                )
            })
            setStaffOptions(options);
        } catch (error) {
            message.error(messages.ERROR)
        }
    }

    const handleDataCustomer = async () => {
        try {
            const response = await api.customer.list()
            // console.log(response.data)
            const options = response.data.data.results.map(elm => {
                return (
                    <Option key={elm.id} value={elm.id}>{elm.fullname} - {elm.phone}</Option>
                )
            })
            setCustomerOptions(options);
        } catch (error) {
            message.error(messages.ERROR)
        }
    }

    const handlePromotionLineByOrder = async () => {
        // try {
        const params = {
            params: {
                amount: 100000
            }
        }
        const response = await api.promotion_line.by_order(params)
        // console.log(response.data)
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
        handlePromotionLineByOrder();
        handleDataStaff();
        handleDataCustomer();
    }, [])

    useEffect(() => {
        // console.log("customerOptions2", props.customerOptions)
    }, [props.customerOptions])

    const calculateMoneyChange = (value) => {
        setMoneyChange(Number(value)-Number(totalProduct));
    };

    const onFinish = () => {
        // console.log(form.getFieldValue("note"));
        // console.log(props)
        form.resetFields();
        setMoneyChange(0)
        setTotal(0)
        setTotalProduct(0)
        setVoucher(0)
        setReset(true);
    };

    const callbackTotalFunction = (total) => {
        setTotal(total)
        setTotalProduct(total)
    };

    const callbackListProductFunction = (data) => {
        // console.log(data)
    };

    const callbackResetFunction = (data) => {
        setReset(data);
    };


    return (

        <Form
            layout="vertical"
            form={form}
        // onFinish={onFinish}
        >
            <Row>
                <Col span={18} style={{ paddingRight: '10px' }}>
                    <OrderItem is_reset={reset} baseUnitOptions={props.baseUnitOptions} parentCallbackTotal={callbackTotalFunction} parentCallbackListProduct={callbackListProductFunction } parentCallbackReset={callbackResetFunction}/>
                </Col>
                <Col span={6} style={{ paddingLeft: '10px', borderLeft: '1px solid #eee' }}>
                    <Form.Item label="Nhân viên bán hàng" name="user_created" >
                        <Select
                            showSearch
                            style={{
                                width: '100%',
                                textAlign: 'left'
                            }}
                            defaultValue={staff}
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                            key={staffOptions}
                        >
                            {staffOptions}
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
                            key={customerOptions}
                        >
                            {customerOptions}
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
                        <div style={{ textAlign: 'left' }}>
                            <span>Mua 100.000đ giảm 20% tối đa 20.000đ</span>
                        </div>
                    </Form.Item>

                    <Form.Item label="Ghi chú" name="note" >
                        <TextArea rows={1} />
                    </Form.Item>
                    <Form.Item>
                        <div className='sb'>
                            <span>Tiền hàng</span>
                            <span>{totalProduct} đ</span>
                        </div>
                        <div className='sb'>
                            <span>giảm giá</span>
                            <span>{voucher} đ</span>
                        </div>
                        <div className='sb' style={{ fontWeight: '600' }}>
                            <span>Thành tiền</span>
                            <span>{total} đ</span>
                        </div>
                    </Form.Item>
                    <div className='sb'>
                        <div>
                            <Form.Item label="Tiền khách đưa" name='money_given'>
                                <Input type='number' min='0' onPressEnter={(e) => calculateMoneyChange(e.target.value)}/>
                            </Form.Item>
                        </div>
                        <div>
                            <Form.Item label=" ">
                                <span>Trả lại {moneyChange}đ</span>
                            </Form.Item>
                        </div>
                    </div>
                    <Form.Item style={{ width: '100%' }}>

                        <Button
                            type="primary"
                            // htmlType="submit"
                            onClick={() => onFinish()}
                            onPressEnter={() => onFinish()}
                            style={{ width: '100%' }}
                            icon={<ShoppingCartOutlined />}
                        >Thêm hóa đơn</Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};

export default TabContent;