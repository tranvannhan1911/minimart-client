import { Modal, Form, Input, message, Col, Row, Select } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import api from '../../../api/apis'
import { validPhone, validName } from '../../../resources/regexp'
import messages from '../../../utils/messages'
import AddressSelect from '../address/address_select';

const { Option } = Select;
const { TextArea } = Input;

const ModalLogin = (props) => {
    const [form] = Form.useForm();
    const [isModalLoginOpen, setIsModalLoginOpen] = useState(false);
    const refAutoFocus = useRef()
    const [dataCustomerGroup, setDataCustomerGroup] = useState([]);
    const [addressValue, setAddressValue] = useState([]);
    const [is_create, setCreate] = useState(null); // create

    useEffect(() => {
        setTimeout(() => {
            if (refAutoFocus.current) {
                refAutoFocus.current.focus()
            }
        }, 200)

    }, [props.open])

    useEffect(() => {
        // if (is_create == null) {
        setCreate(props.is_create)
        if (!props.is_create && props.customer_id != null) {
            handleData()
        } else {
            form.resetFields()
            setAddressValue("")
        }
        //   }
        handleDataCustomerGroup()
    }, [props.open])

    const handleData = async () => {
        // setLoadingData(true)
        try {
            const response = await api.customer.get(props.customer_id);
            const values = response.data.data
            values.customer_group = values.customer_group.map(elm => elm.id.toString())
            values.is_active = values.is_active + "";
            form.setFieldsValue(values)

            if (values.ward) {
                const response2 = await api.address.get_parent(values.ward);
                setAddressValue(response2.data.data.tree)
            }

        } catch (error) {
            message.error(messages.ERROR)
        } finally {
            //   setLoadingData(false)
        }
    }

    const handleDataCustomerGroup = async () => {
        const response = await api.customer_group.list();
        console.log("handleDataCustomerGroup", response)
        const _dataCustomerGroup = []
        response.data.data.results.forEach(cg => {
            _dataCustomerGroup.push(<Option key={cg.id}>{cg.name}</Option>)
        })
        setDataCustomerGroup(_dataCustomerGroup)
    }

    const showModal = () => {
        setIsModalLoginOpen(true);
    };

    const handleOk = () => {
        props.setOpen(false);
    };

    const handleCancel = () => {
        form.resetFields()
        setAddressValue("")
        props.setOpen(false);
    };

    const create = async (values) => {
        values["ward"] = addressValue.length > 0 ? addressValue.at(-1) : undefined
        try {
            const response = await api.customer.add(values);
            if (response.data.code == 1) {
                message.success(messages.customer.SUCCESS_SAVE())
                form.resetFields();
                props.setCustomer(response.data.data);
                props.setOpen(false);
                return true
            } else if (response.data.code == 0) {
                message.error("Số điện thoại đã được sử dụng")
            } else {
                message.error(response.data.message.toString())
            }
        } catch (error) {
            message.error(messages.ERROR)
            console.log('Failed:', error)
        }
        return false
    }

    const onFinish = async (values) => {
        const value = form.getFieldsValue();
        if (value.status == null) {
            value.status = true;
        }
        if (!validName.test(value.fullname)) {
            message.error('Tên không hợp lệ! Ký tự đầu mỗi từ phải viết hoa');
            return;
        }
        if (!validPhone.test(value.phone)) {
            message.error('Số điện thoại không hợp lệ! Số điện thoại bao gồm 10 ký tự số bắt đầu là 84 hoặc 03, 05, 07, 08, 09');
            return;
        }
        create(value);

    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <Modal title="Thêm khách hàng" open={props.open} onOk={onFinish} onCancel={handleCancel} okText="Lưu" cancelText="Thoát" width={1000}>
                <Form
                    form={form}
                    // name="basic"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                // autoComplete="off"
                >

                    <Row>
                        <Col span={1}></Col>
                        <Col span={10}>
                            <Form.Item label="Tên khách hàng" name="fullname" required
                                style={{
                                    display: "block"
                                }}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập tên khách hàng!',
                                    },
                                ]}
                            >
                                <Input autoFocus ref={refAutoFocus} style={{ width: '250px', position: 'absolute', right: '0px', top: '-2px' }} />
                            </Form.Item>
                        </Col>
                        <Col span={2}></Col>
                        <Col span={10}>
                            <Form.Item label="Số điện thoại" name="phone" required
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập số điện thoại!',
                                    },
                                ]}
                            >
                                <Input style={{ width: '250px', position: 'absolute', right: '0px', top: '-2px' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={1}></Col>
                        <Col span={10}>
                            <Form.Item label="Nhóm khách hàng" name="customer_group"
                            >
                                <Select
                                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                    mode="multiple"
                                    allowClear
                                    style={{ width: '250px', position: 'absolute', right: '0px', top: '-2px' }}
                                // placeholder="Please select"
                                // defaultValue={['a10', 'c12']}
                                // onChange={handleChange}
                                >
                                    {dataCustomerGroup}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={2}></Col>
                        <Col span={10}>
                            <Form.Item label="Giới tính" name="gender"
                                style={{
                                    textAlign: 'left'
                                }}>
                                <Select
                                    defaultValue="U"
                                    style={{ width: '250px', position: 'absolute', right: '0px', top: '-2px' }}
                                >
                                    <Option value="M">Nam</Option>
                                    <Option value="F">Nữ</Option>
                                    <Option value="U">Không xác định</Option>
                                </Select>
                            </Form.Item>

                        </Col>
                    </Row>
                    {/* <Row>
                        <Col span={1}></Col>
                        <Col span={10}>
                            <Form.Item label="Số nhà,  đường" name="address">
                                <Input style={{ width: '250px', position: 'absolute', right: '0px', top: '-2px' }} />
                            </Form.Item>
                        </Col>
                    </Row> */}
                    <Row>
                        <Col span={1}></Col>
                        <Col span={10}>
                            <Form.Item label="Số nhà, tên đường" name="address">
                                <Input style={{ width: '250px', position: 'absolute', right: '0px', top: '-2px' }} />
                            </Form.Item>
                        </Col>
                        <Col span={2}></Col>
                        <Col span={10}>
                            <Form.Item label="Địa chỉ" name="ward" >
                                <span style={{ width: '250px', position: 'absolute', right: '0px', top: '-2px' }}>
                                    <AddressSelect addressValue={addressValue} setAddressValue={setAddressValue}
                                    />
                                </span>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={1}></Col>
                        <Col span={10}>
                            <Form.Item label="Trạng thái" name="status"
                                style={{
                                    textAlign: 'left'
                                }}>
                                <Select
                                    defaultValue='true'
                                    style={{ width: '250px', position: 'absolute', right: '0px', top: '-2px' }}
                                >
                                    <Option value="true">Hoạt động</Option>
                                    <Option value="false">Khóa</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={2}></Col>
                        <Col span={10}>

                            <Form.Item label="Ghi chú" name="note" >
                                <TextArea rows={1} style={{ width: '250px', position: 'absolute', right: '0px', top: '-2px' }} />
                            </Form.Item>

                        </Col>
                    </Row>

                </Form>
            </Modal>
        </>
    );
};

export default ModalLogin;