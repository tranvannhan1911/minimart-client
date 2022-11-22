import {
    PlusOutlined, ShoppingCartOutlined, TagOutlined,HistoryOutlined, EyeOutlined
} from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Select, message, Space, 
    Row, Col, InputNumber} from 'antd';
import OrderItem from './item';
import api from '../../../api/apis';
import messages from '../../../utils/messages';
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
    const [moneyGiven, setMoneyGiven] = useState(0);
    const [moneyChange, setMoneyChange] = useState(0);
    const [voucher, setVoucher] = useState(0);
    const [reset, setReset] = useState(false);
    const [form] = Form.useForm();
    const [staffOptions, setStaffOptions] = useState([]);
    const [listStaff, setListStaff] = useState([]);
    const [customerOptions, setCustomerOptions] = useState([]);
    const [customerId, setCustomerId] = useState();
    const [listProduct, setListProduct] = useState([]);
    // const [listProductAndPromotion, setListProductAndPromotion] = useState([]);
    const [order, setOrder] = useState([]);
    const [disabledCreateOrder, setDisabledCreateOrder] = useState(false);
    // const [staff, setStaff] = useState(sessionStorage.getItem("nameStaff") + ' - ' + sessionStorage.getItem("phoneStaff"));

    const [orderId, setOrderId] = useState("");
    const [dateBuy, setDateBuy] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [openSuccessModal, setOpenSuccessModal] = useState(false);
    const [openModalLogin, setOpenModalLogin] = useState(false);
    const [openModalAddCustomer, setOpenModalAddCustomer] = useState(false);
    const [phoneStaffSelect, setPhoneStaffSelect] = useState('');
    const [is_create, setCreate] = useState(null); // create

    const handleDataStaff = async () => {
        try {
            const response = await api.staff.list()
            setListStaff(response.data.data.results);
            const options = response.data.data.results.map(elm => {
                let label= elm.fullname+" - "+elm.phone;
                return (
                    <Option key={elm.id} value={elm.id}>{label}</Option>
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
                let label= elm.fullname+" - "+elm.phone;
                return (
                    <Option key={elm.id} value={elm.id}>{label}</Option>
                )
            })
            setCustomerOptions(options);
        } catch (error) {
            message.error(messages.ERROR)
        }
    }

    useEffect(() => {
        // handlePromotionLineByTypeOrder();
        handleDataStaff();
        handleDataCustomer();
    }, [])

    useEffect(() => {
        // console.log("customerOptions2", props.customerOptions)
    }, [props.customerOptions])

    const calculateMoneyChange = (value) => {
        setMoneyChange(Number(value) - Number(total));
    };

    const onFinish = async () => {
        // console.log(form.getFieldValue(12345,"customer"));
        // console.log(props)
        // console.log(listProductAndPromotion,1111)
        const validMoneyTotal = new RegExp(
            '^[0-9]+$'
        );
        if (listProduct.length == 0) {
            message.error("Không thể tạo hóa đơn trống!")
            return;
        }
        if (!validMoneyTotal.test(total)) {
            message.error("Lỗi tổng tiền!")
            return;
        }
        if (form.getFieldValue("money_given") == null || form.getFieldValue("money_given") == "") {
            message.error("Vui lòng nhập số tiền khách đưa!")
            return;
        }

        for(var i=0; i<listProduct.length; i++){
            if(Number(listProduct[i].quantity) <= 0){
                message.error("Không thể tạo hóa đơn, tồn tại sản phẩm số lượng không hợp lệ!")
                return
            }
        }
        setDisabledCreateOrder(true)
        try {
            const info = {
                customer: customerId,
                note: form.getFieldValue("note"),
                promotion: (plOrder ? plOrder.id : null),
            }
            const _listProduct = listProduct.map(item => {
                console.log("item", item)
                const _item = {
                    product: item.id,
                    quantity: Number(item.quantity),
                    unit_exchange: item.unit_exchange,
                    promotion_line: item.promotion_line,
                    note: item.note
                }
                return _item
            })
            info["details"] = _listProduct
            // console.log("info", info)
            const response = await api.order.add(info);
            if (response.data.code == 1) {
                setOpenSuccessModal(true)
            } else {
                message.error("Không thể tạo hóa đơn trống, hoặc sản phẩm có số lượng là 0!")
                setDisabledCreateOrder(false)
                return
            }
            setOrder(response.data.data.details)
            setOrderId(response.data.data.id)
            if (response.data.data.customer == null) {
                setCustomerName("Khách hàng lẻ")
            } else {
                setCustomerName(response.data.data.customer.fullname)
            }
            setDateBuy(response.data.data.date_created)
            // console.log(response)
        } catch {
            setDisabledCreateOrder(false)
        }
    };

    const finishPrint = (data) => {
        console.log(data)
        if(data == true){
            clearOrder()
        }else{
        setDisabledCreateOrder(false)
        }
    }

    const clearOrder = () => {
        // console.log(data)
        form.resetFields();
        setCustomerId("")
        setOrderId("")
        setCustomerName("")
        setDateBuy("")
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

    // const callbackListProductFunctionAndPromotion = (data) => {
    //     setListProductAndPromotion(data)
    // };

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

    useEffect(() => {
        form.setFieldValue("money_given", total)
        console.log("setMoneyGiven", total)
    }, [total])

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
        form.setFieldValue("user_created", props.userInfo.fullname + " - " + props.userInfo.phone)
    }

    const handleCustomerNew = async (data) => {
        setCustomerId(data.id);
        handleDataCustomer();
    }

    useEffect(() => {
        autoPickPromotion()
    }, [totalProduct, customerId])
    
    const autoPickPromotion = async () => {
        console.log("autoPickPromotion Order", totalProduct, customerId)
        if(!plOrder){ // chưa áp dụng mã
            const params = {
                params: {
                    type: "Order",
                    customer_id: customerId,
                    amount: totalProduct
                }
            }
            const response = await api.promotion_line.by_type(params)
            console.log("autoPickPromotion Order", response)
            if (response.data.code == 1){
                for(var i=0; i<response.data.data.count; i++){
                    if(response.data.data.results[i].benefit > 0){
                        pickPromotionOrder(response.data.data.results[i])
                        return
                    }
                }
                
            }
        }

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
                        // parentCallbackListProductAndPromotion={callbackListProductFunctionAndPromotion}
                        parentCallbackReset={callbackResetFunction}
                        customerId={customerId}
                        disabledCreateOrder={disabledCreateOrder} />
                </Col>
                <Col span={6} style={{ paddingLeft: '10px', borderLeft: '1px solid #eee' }}>
                    <Form.Item label="Nhân viên bán hàng" name="user_created" 
                            style={{
                                marginBottom: '10px'
                            }}>
                        <Select
                            showSearch
                            style={{
                                width: '100%',
                                textAlign: 'left'
                            }}
                            defaultValue={props.userInfo?.fullname + " - " + props.userInfo?.phone}
                            onChange={(option) => onSelectStaff(option)}
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                            key={staffOptions}
                            disabled={disabledCreateOrder}
                        >
                            {staffOptions}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Khách hàng" name="customer" 
                            style={{
                                marginBottom: '10px'
                            }}>
                        <Select
                            showSearch
                            allowClear
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
                            onClick={() => {showModalAddCustomer(); setCreate(true)}}>
                            <PlusOutlined
                                twoToneColor="#eb2f96"
                            /> Thêm khách hàng mới</span>
                            <span style={{
                            cursor: 'pointer',
                            color: '#1890ff',
                            marginLeft: '10px'
                        }}
                            onClick={() => {showModalAddCustomer(); setCreate(false)}}>
                            <EyeOutlined
                                twoToneColor="#eb2f96"
                            /> Xem thông tin</span>
                    </Form.Item>
                    {/* <Divider/> */}
                    <Form.Item label="Khuyến mãi" name="promotion" style={{
                        textAlign: 'left',
                        marginBottom: '10px'
                    }}>
                        <span style={{
                            cursor: 'pointer',
                            color: '#1890ff'
                        }} onClick={() => {
                            setOpenPromotionPicker(true)
                        }}>
                            <TagOutlined
                                twoToneColor="#eb2f96"
                            /> Chọn khuyến mãi</span>

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

                    <Form.Item label="Ghi chú" name="note" 
                            style={{
                                marginBottom: '10px'
                            }}>
                        <TextArea rows={1}
                            disabled={disabledCreateOrder} />
                    </Form.Item>
                    <Form.Item
                            style={{
                                marginBottom: '10px'
                            }}>
                        <div className='sb'>
                            <span>Tạm tính</span>
                            <span>{totalProduct.toLocaleString()} đ</span>
                        </div>
                        <div className='sb'>
                            <span>giảm giá</span>
                            <span>{voucher.toLocaleString()} đ</span>
                        </div>
                        <div className='sb' style={{ fontWeight: '600' }}>
                            <span>Thành tiền</span>
                            <span>{total.toLocaleString()} đ</span>
                        </div>
                    </Form.Item>
                    <div className='sb'>
                        <div style={{width:"60%"}}>
                            <Form.Item label="Tiền khách đưa" name='money_given' style={{width:"100%", marginBottom: '10px'}}>
                                <InputNumber step={1000} min={total} value={moneyGiven} style={{width:"100%"}} onChange={(value) => {
                                    setMoneyGiven(value)
                                    calculateMoneyChange(value)
                                    }} />
                            </Form.Item>
                        </div>
                        <div style={{width:"40%"}}>
                            <Form.Item label=" "
                            style={{
                                marginBottom: '10px'
                            }}>
                                <span>Trả lại {moneyChange.toLocaleString()}đ</span>
                            </Form.Item>
                        </div>
                    </div>
                    <Form.Item style={{ width: '100%', marginBottom: '10px' }}>
                    {/* <Space> */}
                        <Button
                            type="primary"
                            // htmlType="submit"
                            onClick={() => onFinish()}
                            onPressEnter={() => onFinish()}
                            style={{ width: '100%' }}
                            icon={<ShoppingCartOutlined />}
                            disabled={disabledCreateOrder}
                        >Thanh toán</Button>
                        <Button
                            type="primary"
                            // htmlType="submit"
                            onClick={() => clearOrder()}
                            style={{ width: '100%', marginTop:'10px' }}
                            icon={<HistoryOutlined />}
                            disabled={disabledCreateOrder}
                        >Làm mới</Button>
                    {/* </Space> */}
                    </Form.Item>
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
                order={order}
                totalProduct={totalProduct}
                total={total}
                voucher={voucher}
                orderId={orderId}
                dateBuy={dateBuy}
                customerName={customerName}
                customerId={customerId}
                dataMoneyChange={moneyChange}
                onFinish={finishPrint} 
                />
            <ModalLogin open={openModalLogin}
                setOpen={setOpenModalLogin}
                setStaff={setStaffNew}
                errorStaff={errorStaffNew}
                phone={phoneStaffSelect}
                userInfo={props.userInfo} 
                setUserInfo={props.setUserInfo} />
            <ModalAddCustomer open={openModalAddCustomer}
                setOpen={setOpenModalAddCustomer}
                setCustomer={handleCustomerNew}
                is_create={is_create}
                customer_id={customerId}
            />
            {/* <PDFOrder order={order} totalProduct={totalProduct} total={total} voucher={voucher} open={open} setOpen={setOpen}/> */}
        </Form>
    );
};

export default TabContent;