import {
    PhoneOutlined, LockOutlined
} from '@ant-design/icons'
import { Button, Col, Row, Checkbox, Form, Input, message, Space } from 'antd'
import { Typography } from 'antd'
import React, { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { AccountApi } from "../../api/apis"

const { Title } = Typography;


const ChangePassword = () => {
    // let history = useHistory();
    const navigate = useNavigate();
    const [loadings, setLoadings] = useState([]);
    
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
        if(values.new_password != values.repeat_password){
            
            message.error('Mật khẩu mới và lặp lại mật khẩu không trùng');
            return;
        }

        const params = {
            phone: values.phone,
            password: values.old_password,
            new_password: values.new_password,
        };
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
        } finally{
            stopLoading(0)
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        message.error('Có lỗi xảy ra');
    };

    return (
        <Row justify="space-around" align="middle" style={{
            height: '100vh'
        }}>
            <Col span={8} xs={18} sm={14} md={10} lg={8}>
                <Title level={3} style={{marginBottom: '20px'}}>
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
                            prefix={<PhoneOutlined className="site-form-item-icon" />} 
                            placeholder="Số điện thoại" 
                            autoFocus/>
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
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Mật khẩu cũ"
                        />
                    </Form.Item>
                    <Form.Item
                        name="new_password"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập mật khẩu mới!',
                            },
                        ]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Mật khẩu mới"
                        />
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
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Lặp lại mật khẩu mới"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button"
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
    )
}

export default ChangePassword;