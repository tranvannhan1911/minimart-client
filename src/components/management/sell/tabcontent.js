import {
    PlusOutlined, ShoppingCartOutlined, TagOutlined
} from '@ant-design/icons';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Select, message, Space, Popconfirm, Upload, Row, Col, Checkbox, Typography, Divider } from 'antd';
import OrderItem from './item';
import api from '../../../api/apis';
import messages from '../../../utils/messages';
import Promotion from './promotion';
import PromotionPicker from './promotion/modal';
const { Option } = Select;
const { TextArea } = Input;

const TabContent = (props) => {
    const [openPromotionPicker, setOpenPromotionPicker] = useState(false);
    const [plOrder, setPlOrder] = useState();
    const [totalProduct, setTotalProduct] = useState(0);
    const [total, setTotal] = useState(0);
    const [moneyChange, setMoneyChange] = useState(0);
    const [voucher, setVoucher] = useState(0);
    const [reset, setReset] = useState(false);
    const [form] = Form.useForm();
    const [staffOptions, setStaffOptions] = useState([]);
    const [customerOptions, setCustomerOptions] = useState([]);
    const [customerId, setCustomerId] = useState();
    const [staff, setStaff] = useState(sessionStorage.getItem("nameStaff") + ' - ' + sessionStorage.getItem("phoneStaff"));


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

    // const handlePromotionLineByOrder = async () => {
    //     // try {
    //     const params = {
    //         params: {
    //             amount: 100000
    //         }
    //     }
    //     const response = await api.promotion_line.by_order(params)
    //     // console.log(response.data)
    //     let options = [<Option key="default" value="">Không</Option>]
    //     options = options.concat(response.data.data.results.map(elm => {
    //         return (
    //             <Option key={elm.id} value={elm.id}>{elm.title}</Option>
    //         )
    //     }))
    //     setPromotionLineOrderOption(options);
    //     // } catch (error) {
    //     //     message.error(messages.ERROR)
    //     // }
    // }

    // const handlePromotionLineByTypeOrder = async () => {
    //     // try {
    //     const params = {
    //         params: {
    //             type: "Order"
    //         }
    //     }
    //     const response = await api.promotion_line.by_type(params)
    //     // console.log(response.data)
    //     let options = [<Option key="default" value="">Không</Option>]
    //     options = options.concat(response.data.data.results.map(elm => {
    //         return (
    //             <Option key={elm.id} value={elm.id}>{elm.title}</Option>
    //         )
    //     }))
    //     setPromotionLineOrderOption(options);
    //     // } catch (error) {
    //     //     message.error(messages.ERROR)
    //     // }
    // }

    useEffect(() => {
        // handlePromotionLineByTypeOrder();
        handleDataStaff();
        handleDataCustomer();
    }, [])

    useEffect(() => {
        // console.log("customerOptions2", props.customerOptions)
    }, [props.customerOptions])

    const calculateMoneyChange = (value) => {
        setMoneyChange(Number(value) - Number(totalProduct));
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








    const ApplyPromotionOrder = () => {
        console.log("ApplyPromotionOrder", totalProduct)
        if(totalProduct < plOrder.detail.minimum_total){
            // không thể sử dụng voucher
            // show alert or something
            setPlOrder(null)
            return
        }
        if(plOrder.type == "Fixed"){
            const _discount = plOrder.detail.reduction_amount
            setVoucher(_discount)
            setTotal(totalProduct-_discount)
            return
        }
        if(plOrder.type == "Percent"){
            let _discount = totalProduct*plOrder.detail.percent/100
            if(plOrder.detail.maximum_reduction_amount != 0 && plOrder.detail.maximum_reduction_amount != null){
                _discount = Math.min(_discount, plOrder.detail.maximum_reduction_amount)
            }
            console.log(_discount)
            setVoucher(_discount)
            setTotal(totalProduct-_discount)
            return
        }
    }

    useEffect(() => {

        if(plOrder){
            ApplyPromotionOrder()
        }
    }, [plOrder])

    
    useEffect(() => {

        if(plOrder){
            ApplyPromotionOrder()
        }
    }, [totalProduct])

    const pickPromotionOrder = (pl) => {
        console.log(pl)
        setPlOrder(pl)
    }

    const addPromotionOrder = () => {
        // if(form.getFieldValue("customer"))
            setOpenPromotionPicker(true)
        // else
        //     message.error("Vui lòng chọn khách hàng trước")
    }


    return (

        <Form
            layout="vertical"
            form={form}
        // onFinish={onFinish}
        >
            <Row>
                <Col span={18} style={{ paddingRight: '10px' }}>
                    <OrderItem is_reset={reset} baseUnitOptions={props.baseUnitOptions} parentCallbackTotal={callbackTotalFunction} parentCallbackListProduct={callbackListProductFunction} parentCallbackReset={callbackResetFunction} />
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
                            onChange={(value) => {
                                console.log(value)
                                setCustomerId(value)
                            }}
                        >
                            {customerOptions}
                        </Select>
                    </Form.Item>
                    {/* <Divider/> */}
                    <Form.Item label="Khuyến mãi" name="promotion"  style={{
                            textAlign: 'left'
                        }}>
                        <span style={{
                            cursor: 'pointer',
                            color: '#1890ff'
                        }} onClick={addPromotionOrder}>
                            <TagOutlined
                                twoToneColor="#eb2f96"
                                /> Thêm khuyến mãi</span>
                        
                        { plOrder ? 
                        <>
                            <div className='sb'>
                                <span>Mã KM</span>
                                <span>{plOrder.promotion_code}</span>
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <span>{plOrder.title}</span>
                            </div>    
                        </>
                        : null
                    }
                        
                    </Form.Item>

                    <Form.Item label="Ghi chú" name="note" >
                        <TextArea rows={1} />
                    </Form.Item>
                    <Form.Item>
                        <div className='sb'>
                            <span>Tạm tính</span>
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
                                <Input type='number' min='0' onPressEnter={(e) => calculateMoneyChange(e.target.value)} />
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
            <PromotionPicker 
                open={openPromotionPicker} 
                setOpen={setOpenPromotionPicker}
                totalProduct={totalProduct}
                onFinish={(pl) => pickPromotionOrder(pl)}
                customerId={customerId}/>
        </Form>
    );
};

export default TabContent;