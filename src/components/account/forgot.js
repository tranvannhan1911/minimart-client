import {
    PhoneOutlined, LockOutlined
} from '@ant-design/icons'
import { Button, Col, Row, Checkbox, Form, Input, message } from 'antd'
import { Typography } from 'antd'
import React, { useState, useRef, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { AccountApi } from "../../api/apis"
import { validPhone } from '../../resources/regexp'

const { Title } = Typography;


const ForgotPassword = () => {
    const [form] = Form.useForm();
    const [fieldValue, setFieldvalue] = useState([]);
    const accountApi = new AccountApi();
    const navigate = useNavigate();
    const [loadings, setLoadings] = useState([]);

    const phoneRef = useRef()
    const codeRef = useRef()
    const [sentOtp, setSentOtp] = useState({ value: false })

    const onValuesChange = (value) => {
        form.setFieldsValue(value)
    }

    const enterLoading = (index) => {
        setLoadings((prevLoadings) => {
            const newLoadings = [...prevLoadings];
            newLoadings[index] = true;
            return newLoadings;
        });
    };

    const stopLoading = (index) => {
        setLoadings((prevLoadings) => {
            const newLoadings = [...prevLoadings];
            newLoadings[index] = false;
            return newLoadings;
        });
    }

    const sendOtp = async () => {
        enterLoading(0)
        if (!validPhone.test(form.getFieldValue('phone'))) {
            message.error('Số điện thoại không hợp lệ! Số điện thoại bao gồm 10 ký tự số bắt đầu là 84 hoặc 03, 05, 07, 08, 09');
            stopLoading(0);
            phoneRef.current.focus();
            // form.getFieldValue('phone').;
            return;
        }
        const params = {
            phone: form.getFieldValue('phone'),
        };
        try {
            const response = await accountApi.forgot_password(params);
            if (response.data.code == 1) {
                message.success("Mã OTP đã được gửi tới số điện thoại " + form.getFieldValue('phone') + ", vui lòng nhập mã OTP để xác nhận.");
                setSentOtp({ value: true })
                codeRef.current.focus()
            } else {
                message.error("Số điện thoại không chính xác")
            }
        } catch (error) {
            console.log('Failed:', error);
            message.error("Số điện thoại không chính xác")
        } finally {
            stopLoading(0)
        }
    }

    useEffect(() => {
        if (sentOtp.value == true) {
            codeRef.current.focus()
        } else {
            phoneRef.current.focus()
        }
    }, []);

    useEffect(() => {
        document.title = "Quên mật khẩu - Quản lý siêu thị mini NT"
    }, [])

    const onFinish = async (values) => {
        enterLoading(1)
        const params = {
            phone: values.phone,
            code: values.code,
        };
        try {
            const response = await accountApi.forgot_password_verify(params);
            console.log(response)
            if (response.data.code == 1) {
                message.success("Mật khẩu mới sẽ được gửi tới số điện thoại " + values.phone + ", vui lòng đổi mật khẩu ngay.");
                setTimeout(() => {
                    navigate('/login');
                }, 3000)
            } else {
                message.error("Số điện thoại hoặc mã OTP không chính xác")
            }
        } catch (error) {
            console.log('Failed:', error);
            message.error("Số điện thoại hoặc mã OTP không chính xác")
        } finally {
            stopLoading(1)
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        message.error("Lỗi")
    };

    return (
        <>
            <div style={{
                backgroundImage: `url(${require("../../assets/bg.jpg")})`,
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                position: 'absolute',
                top: '0',
                left: '0',
                height: '100vh',
                width: '100vw',
                filter: 'brightness(0.5)'
            }}>
            </div>
            <Row justify="space-around" align="middle" style={{
                height: '100vh'
            }}>
                <Col span={8} xs={18} sm={14} md={10} lg={8} style={{}}>
                    <div style={{
                        transform: 'translateY(-90px)'
                    }}>
                        <img style={{
                            filter: 'invert(1)',
                            width: '150px'
                        }} src={require('../../assets/logo.png')}></img>
                        <Title level={2} style={{
                            color: 'white'
                        }}>Công ty Siêu thị mini NT</Title>
                    </div>
                </Col>
                <Col span={8} xs={18} sm={14} md={10} lg={8} style={{ backgroundColor: "white", padding: "50px", borderRadius: "10px" }}>
                    <Title level={2} style={{ marginBottom: '20px' }}>
                        Quên mật khẩu
                    </Title>
                    <Form
                        form={form}
                        name="basic"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"

                        onValuesChange={onValuesChange}
                    >
                        <Row>
                            <Col flex="auto">
                                <Form.Item
                                    name="phone"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập số điện thoại!',
                                        },
                                    ]}
                                >
                                    <Input
                                        size='large'
                                        ref={phoneRef}
                                        prefix={<PhoneOutlined className="site-form-item-icon" />}
                                        placeholder="Số điện thoại"
                                        onChan />
                                </Form.Item>
                            </Col>
                            <Col flex="none">
                                <Form.Item>
                                    <Button type="primary" htmlType="button" size='large' loading={loadings[0]} onClick={() => sendOtp()}>
                                        Gửi mã OTP
                                    </Button>

                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item
                            name="code"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mã OTP!',
                                },
                            ]}
                            style={{ display: sentOtp.value ? 'block' : 'none' }}
                        >
                            <Input
                                size='large'
                                ref={codeRef}
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                placeholder="Mã OTP" />
                        </Form.Item>
                        <Form.Item
                            wrapperCol={{
                                span: 24,
                            }}
                            style={{ display: sentOtp.value ? 'block' : 'none' }}
                        >
                            <Button type="primary" htmlType="submit" loading={loadings[1]} size='large'>
                                Lấy lại mật khẩu
                            </Button>
                        </Form.Item>
                        <p><Link to="/dang-nhap">Đăng nhập ngay</Link> </p>
                    </Form>
                </Col>
            </Row>
        </>
    )
}

export default ForgotPassword;