import {
    PhoneOutlined, LockOutlined
} from '@ant-design/icons'
import { Button, Col, Row, Checkbox, Form, Input, message, Space } from 'antd'
import { Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { AccountApi } from "../../api/apis"
import { validPhone, validPassword } from '../../resources/regexp'
import zxcvbn from 'zxcvbn';

const { Title } = Typography;


const ChangePassword = () => {
    // let history = useHistory();
    const navigate = useNavigate();
    const [loadings, setLoadings] = useState([]);
    const [password, setPassword] = useState("");
    // const [mess, setMess]= useState("Vui lòng nhập mật khẩu mới!");

    const testResult = zxcvbn(password);
    const num = testResult.score * 100 / 4;
    const createPassLabel = () => {
        switch (testResult.score) {
            case 0:
                return '';
            case 1:
                return 'Yếu';
            case 2:
                return 'Trung bình';
            case 3:
                return 'Mạnh';
            case 4:
                return 'Rất mạnh';
            default:
                return '';
        }
    }

    const funcProgressColor = () => {
        switch (testResult.score) {
            case 0:
                return '#828282';
            case 1:
                return '#EA1111';
            case 2:
                return '#FFAD00';
            case 3:
                return '#9bc158';
            case 4:
                return '#00b500';
            default:
                return 'none';
        }
    }

    const changePasswordColor = () => ({
        width: `${num}%`,
        background: funcProgressColor(),
        height: '7px'
    })

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
        message.error('Sai số điện thoại hoặc mật khẩu');
    };

    const onFinish = async (values) => {
        values.new_password = password;
        if (!validPhone.test(values.phone)) {
            message.error('Số điện thoại không hợp lệ! Số điện thoại bao gồm 10 ký tự số bắt đầu là 84 hoặc 03, 05, 07, 08, 09');
            stopLoading(0);
            return;
        }

        if (!validPassword.test(values.old_password)) {
            message.error('Mật khẩu ít nhất 6 ký tự');
            stopLoading(0);
            return;
        }

        if (values.new_password == "") {

            message.error('Vui lòng nhập mật khẩu mới!');
            stopLoading(0);
            return;
        }

        if (values.new_password != values.repeat_password) {

            message.error('Mật khẩu mới và lặp lại mật khẩu không trùng');
            stopLoading(0);
            return;
        }

        if (testResult.score == 1 || testResult.score == 0) {

            message.error('Vui lòng chọn mật khẩu an toàn hơn');
            stopLoading(0);
            return;
        }

        const params = {
            phone: values.phone,
            password: values.old_password,
            new_password: values.new_password,
        };
        console.log(params)
        const accountApi = new AccountApi();
        try {
            const response = await accountApi.change_password(params);
            console.log(response)
            if (response.data.code == 1) {
                message.success("Đổi mật khẩu thành công")
                navigate('/dang-nhap');
            } else {
                message.error('Sai số điện thoại hoặc mật khẩu');
            }
        } catch (error) {
            console.log('Failed:', error);
            message.error('Sai số điện thoại hoặc mật khẩu');
        } finally {
            stopLoading(0)
        }
    };

    useEffect(() => {
        document.title = "Đổi mật khẩu - Quản lý siêu thị mini NT"
    }, [])

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        message.error('Có lỗi xảy ra');
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
                        Đổi mật khẩu
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
                                prefix={<PhoneOutlined className="site-form-item-icon" />}
                                placeholder="Số điện thoại"
                                autoFocus />
                        </Form.Item>
                        <Form.Item
                            name="old_password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mật khẩu cũ!',
                                },
                            ]}
                        >
                            <Input.Password
                                size="large"
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="Mật khẩu cũ"
                            />
                        </Form.Item>
                        <Form.Item
                            name="new_password"
                            style={{
                                marginBottom: '0px'
                            }}
                        // rules={[
                        //     {
                        //         required: true,
                        //         message: "Vui lòng nhập mật khẩu mới!",
                        //     },
                        // ]}
                        >
                            <Input.Password
                                size="large"
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="Mật khẩu mới"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <div className="progress" style={{ height: '7px' }}>
                                <div className="progress-bar" style={changePasswordColor()}></div>
                            </div>
                            <p style={{ color: funcProgressColor(), textAlign: 'right', marginTop: '0px' }}>{createPassLabel()}</p>
                        </Form.Item>

                        <Form.Item
                            name="repeat_password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng lặp lại mật khẩu mới!',
                                },
                            ]}
                        >
                            <Input.Password
                                size="large"
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="Lặp lại mật khẩu mới"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button" size="large"
                                loading={loadings[0]} onClick={() => enterLoading(0)}>
                                Đổi mật khẩu
                            </Button>
                        </Form.Item>

                        <p>
                            <Space>
                                <Link to="/dang-nhap">Đăng nhập ngay</Link>
                                hoặc
                                <Link to="/quen-mat-khau">Lấy lại mật khẩu</Link>
                            </Space>
                        </p>
                    </Form>
                </Col>
            </Row >
        </>
    )
}

export default ChangePassword;