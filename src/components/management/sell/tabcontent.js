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
import SuccessModal from './modal_success';
import ModalLogin from './modalLogin';
import ModalAddCustomer from './modalAddCustomer';

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
    const [listStaff, setListStaff] = useState([]);
    const [customerOptions, setCustomerOptions] = useState([]);
    const [customerId, setCustomerId] = useState();
    const [listProduct, setListProduct] = useState([]);
    const [disabledCreateOrder, setDisabledCreateOrder] = useState(false);
    const [staff, setStaff] = useState(sessionStorage.getItem("nameStaff") + ' - ' + sessionStorage.getItem("phoneStaff"));

    const [openSuccessModal, setOpenSuccessModal] = useState(false);
    const [openModalLogin, setOpenModalLogin] = useState(false);
    const [openModalAddCustomer, setOpenModalAddCustomer] = useState(false);
    const [phoneStaffSelect, setPhoneStaffSelect] = useState('');

    const handleDataStaff = async () => {
        try {
            const response = await api.staff.list()
            setListStaff(response.data.data.results);
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

    const onFinish = async () => {
        console.log(form.getFieldValue(12345,"customer"));
        // console.log(props)
        if(listProduct.length ==0){
            return;
        }
        setDisabledCreateOrder(true)
        try {
            const info = {
                customer: customerId,
                note: form.getFieldValue("note"),
                promotion: (plOrder ? plOrder.id : null),
            }
            const _listProduct = listProduct.map(item => {
                const _item = {
                    product: item.id,
                    quantity: Number(item.quantity),
                    unit_exchange: item.unit_exchange,
                    promotion_line: item.promotion_line
                }
                return _item
            })
            info["details"] = _listProduct
            console.log("info", info)
            const response = await api.order.add(info);
            console.log(response)
            if (response.data.code == 1) {
                setOpenSuccessModal(true)
            } else {
                message.error("Có lỗi xảy ra!")
                setDisabledCreateOrder(false)
            }
        } catch {
            setDisabledCreateOrder(false)
        }
    };

    const clearOrder = () => {
        form.resetFields();
        setMoneyChange(0)
        setTotal(0)
        setTotalProduct(0)
        setVoucher(0)
        setReset(true);
        setDisabledCreateOrder(false)
    }

    const callbackTotalFunction = (total) => {
        setTotal(total)
        setTotalProduct(total)
    };

    const callbackListProductFunction = (data) => {
        setListProduct(data)
    };

    const callbackResetFunction = (data) => {
        setReset(data);
    };

    const ApplyPromotionOrder = () => {
        console.log("ApplyPromotionOrder", totalProduct)
        if (totalProduct < plOrder.detail.minimum_total) {
            // không thể sử dụng voucher
            // show alert or something
            setPlOrder(null)
            setVoucher(0)
            return
        }
        if (plOrder.type == "Fixed") {
            const _discount = plOrder.detail.reduction_amount
            setVoucher(_discount)
            setTotal(totalProduct - _discount)
            return
        }
        if (plOrder.type == "Percent") {
            let _discount = totalProduct * plOrder.detail.percent / 100
            if (plOrder.detail.maximum_reduction_amount != 0 && plOrder.detail.maximum_reduction_amount != null) {
                _discount = Math.min(_discount, plOrder.detail.maximum_reduction_amount)
            }
            console.log(_discount)
            setVoucher(_discount)
            setTotal(totalProduct - _discount)
            return
        }
    }

    useEffect(() => {
        if (plOrder) {
            ApplyPromotionOrder()
        }
    }, [plOrder])


    useEffect(() => {
        if (plOrder) {
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

    const onSelectStaff = (value) => {
        if (sessionStorage.getItem("idStaff") != value) {
            console.log("dang nhap lai", value, sessionStorage.getItem("idStaff"));
            listStaff.forEach(element => {
                if (element.id == value) {
                    setPhoneStaffSelect(element.phone);
                }
            });
            setOpenModalLogin(true);
        }

    }

    const showModalAddCustomer = () => {
        console.log("eee");
        setOpenModalAddCustomer(true);
    }

    const setStaffNew = () => {
        listStaff.forEach(element => {
            if (phoneStaffSelect == element.phone) {
                sessionStorage.setItem("idStaff", element.id)
                form.setFieldValue("user_created", element.fullname + " - " + element.phone)
            }
        });

    }

    const errorStaffNew = () => {
        form.setFieldValue("user_created", staff)
    }

    const handleCustomerNew = async (data) => {
        setCustomerId(data.id);
        handleDataCustomer();
    }

    return (

        <Form
            layout="vertical"
            form={form}
        // onFinish={onFinish}
        >
            <Row>
                <Col span={18} style={{ paddingRight: '10px' }}>
                    <OrderItem is_reset={reset} baseUnitOptions={props.baseUnitOptions}
                        parentCallbackTotal={callbackTotalFunction}
                        parentCallbackListProduct={callbackListProductFunction}
                        parentCallbackReset={callbackResetFunction}
                        customerId={customerId}
                        disabledCreateOrder={disabledCreateOrder} />
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
                            onChange={(option) => onSelectStaff(option)}
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                            key={staffOptions}
                            disabled={disabledCreateOrder}
                        >
                            {staffOptions}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Khách hàng" name="customer" >
                        <Select
                            showSearch
                            defaultValue={customerId}
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
                            disabled={disabledCreateOrder}
                        >
                            {customerOptions}
                        </Select>
                        <span style={{
                            cursor: 'pointer',
                            color: '#1890ff'
                        }}
                            onClick={() => showModalAddCustomer()}>
                            <PlusOutlined
                                twoToneColor="#eb2f96"
                            /> Thêm khách hàng mới</span>
                    </Form.Item>
                    {/* <Divider/> */}
                    <Form.Item label="Khuyến mãi" name="promotion" style={{
                        textAlign: 'left'
                    }}>
                        <span style={{
                            cursor: 'pointer',
                            color: '#1890ff'
                        }} onClick={() => {
                            setOpenPromotionPicker(true)
                        }}>
                            <TagOutlined
                                twoToneColor="#eb2f96"
                            /> Thêm khuyến mãi</span>

                        {plOrder ?
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
                        <TextArea rows={1}
                            disabled={disabledCreateOrder} />
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
                                <Input type='number' min='0' onChange={(e) => calculateMoneyChange(e.target.value)} />
                            </Form.Item>
                        </div>
                        <div>
                            <Form.Item label=" ">
                                <span>Trả lại {moneyChange}đ</span>
                            </Form.Item>
                        </div>
                    </div>
                    {/* <Form.Item style={{ width: '100%' }}> */}
                    <Space>
                        <Button
                            type="primary"
                            // htmlType="submit"
                            onClick={() => onFinish()}
                            onPressEnter={() => onFinish()}
                            style={{ width: '100%' }}
                            icon={<ShoppingCartOutlined />}
                            disabled={disabledCreateOrder}
                        >Thanh toán</Button>
                    </Space>
                    {/* </Form.Item> */}
                </Col>
            </Row>
            <PromotionPicker
                open={openPromotionPicker}
                setOpen={setOpenPromotionPicker}
                totalProduct={totalProduct}
                onFinish={(pl) => pickPromotionOrder(pl)}
                customerId={customerId}
                plOrder={plOrder}
                type="Order" />
            <SuccessModal
                open={openSuccessModal}
                setOpen={setOpenSuccessModal}
                onFinish={clearOrder} />
            <ModalLogin open={openModalLogin}
                setOpen={setOpenModalLogin}
                setStaff={setStaffNew}
                errorStaff={errorStaffNew}
                phone={phoneStaffSelect} />
            <ModalAddCustomer open={openModalAddCustomer}
                setOpen={setOpenModalAddCustomer}
                setCustomer={handleCustomerNew}
            />
        </Form>
    );
};

export default TabContent;