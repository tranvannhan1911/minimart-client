import {
    PhoneOutlined, LockOutlined
} from '@ant-design/icons'
import { Button, Col, Row, Checkbox, Form, Input, message } from 'antd'
import { Typography } from 'antd'
import React, { useState, useRef, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import AccountApi from "../../api/apis"

const { Title } = Typography;


const ForgotPassword = () => {
    const [form] = Form.useForm();
    const [fieldValue, setFieldvalue] = useState([]);
    const accountApi = new AccountApi();
    const navigate = useNavigate();
    const [loadings, setLoadings] = useState([]);

    const phoneRef = useRef()
    const codeRef = useRef()
    const [sentOtp, setSentOtp] = useState({value: false})

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
        const params = {
            phone: form.getFieldValue('phone'),
        };
        try {
            const response = await accountApi.forgot_password(params);
            if (response.data.code == 1) {
                message.success("Mã OTP đã được gửi tới số điện thoại "+ form.getFieldValue('phone') +", vui lòng nhập mã OTP để xác nhận.");
                setSentOtp({value: true})
                codeRef.current.focus()
            }else{
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
        if(sentOtp.value == true){
            codeRef.current.focus()
        }else{
            phoneRef.current.focus()
        }
    }, []);

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
                message.success("Mật khẩu mới sẽ được gửi tới số điện thoại "+ values.phone +", vui lòng đổi mật khẩu ngay.");
                setTimeout(() => {
                    navigate('/login');
                }, 3000)
            } else {
                message.error("Số điện thoại hoặc mã OTP không chính xác")
            }
        } catch (error) {
            console.log('Failed:', error);
            message.error("Số điện thoại hoặc mã OTP không chính xác")
        } finally{
            stopLoading(1)
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        message.error("Lỗi")
    };

    return (
        <Row justify="space-around" align="middle" style={{
            height: '100vh'
        }}>
            <Col span={8} xs={18} sm={14} md={10} lg={8}>
                <Title level={3} style={{marginBottom: '20px'}}>
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
                                    ref={phoneRef}
                                    prefix={<PhoneOutlined className="site-form-item-icon" />}
                                    placeholder="Số điện thoại"
                                    onChan/>
                            </Form.Item>
                        </Col>
                        <Col flex="none">
                            <Form.Item>
                                <Button type="primary" htmlType="button" loading={loadings[0]} onClick={() => sendOtp()}>
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
                        style={{display: sentOtp.value ? 'block' : 'none' }}
                    >
                        <Input
                            ref={codeRef}
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            placeholder="Mã OTP" />
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{
                            span: 24,
                        }}
                        style={{display: sentOtp.value ? 'block' : 'none' }}
                    >
                        <Button type="primary" htmlType="submit" loading={loadings[1]} >
                            Lấy lại mật khẩu
                        </Button>
                    </Form.Item>
                    <p><Link to="/login">Đăng nhập ngay</Link> </p>
                </Form>
            </Col>
        </Row>
    )
}

export default ForgotPassword;