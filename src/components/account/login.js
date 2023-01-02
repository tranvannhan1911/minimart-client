import {
    PhoneOutlined, LockOutlined
} from '@ant-design/icons'
import { Button, Col, Row, notification, Form, Input, message } from 'antd'
import { Typography } from 'antd'
import React, { useState, useRef, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { AccountApi } from "../../api/apis"
import store, { setUser } from '../../store/store'
import { validPhone, validPassword } from '../../resources/regexp'

const { Title } = Typography;


const Login = () => {
    // const dispatch = useDispatch();
    // let history = useHistory();
    const phoneRef = useRef();
    const passwordRef = useRef();
    const navigate = useNavigate();
    const [loadings, setLoadings] = useState([]);
    var oneTime = true;

    useEffect(() => {
        document.title = "Đăng nhập - Quản lý siêu thị mini NT"
        if(oneTime){
            notification.open({
                message: `Notification`,
                description: <p>
                            Thông tin tài khoản: 0987654321/nhan12345 <br/>
                            Source code và tài liệu liên hệ: <a href='https://www.facebook.com/NHAN.30082001/'>Facebook</a>
                        </p>,
                placement: "bottomRight",
                duration: 0
            });
            oneTime = false;
        }
    }, [])

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


    const error_msg = () => {
        message.error('Sai số điện thoại hoặc mật khẩu')
    };

    const onFinish = async (values) => {

        if (!validPhone.test(values.phone)) {
            message.error('Số điện thoại không hợp lệ! Số điện thoại bao gồm 10 ký tự số bắt đầu là 84 hoặc 03, 05, 07, 08, 09');
            stopLoading(0);
            phoneRef.current.focus();
            return;
        }
        if (!validPassword.test(values.password)) {
            message.error('Mật khẩu ít nhất 6 ký tự');
            stopLoading(0);
            passwordRef.current.focus();
            return;
        }

        const params = {
            phone: values.phone,
            password: values.password,
        };
        const accountApi = new AccountApi()
        try {
            const response = await accountApi.login(params);
            console.log(response)
            if (response.data.code == 1) {
                accountApi.save_token(response)

                // const action = setUser(response.data.data)
                // store.dispatch(action)

                navigate('/quan-ly')
            } else {
                error_msg()
            }
        } catch (error) {
            console.log('Failed:', error)
            error_msg()
        } finally {
            stopLoading(0)
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo)
        error_msg()
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
                height: '100vh',

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
                        }}>Siêu thị mini NT</Title>
                    </div>
                </Col>
                <Col span={8} xs={18} sm={14} md={10} lg={8} style={{ backgroundColor: "white", padding: "50px", borderRadius: "10px" }}>
                    <Title level={2} style={{ marginBottom: '20px' }}>
                        Đăng nhập
                    </Title>
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                    >
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
                                size="large"
                                ref={phoneRef}
                                prefix={<PhoneOutlined className="site-form-item-icon" />}
                                placeholder="Số điện thoại"
                                autoFocus />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mật khẩu!',
                                },
                            ]}
                        >
                            <Input.Password
                                size="large"
                                ref={passwordRef}
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="Mật khẩu"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button" size="large"
                                loading={loadings[0]} onClick={() => enterLoading(0)}>
                                Đăng nhập
                            </Button>
                        </Form.Item>
                        <p>Quên mật khẩu ? <Link to="/quen-mat-khau">Lấy lại mật khẩu</Link> </p>
                    </Form>
                </Col>
            </Row >
        </>
    )
}

export default Login;