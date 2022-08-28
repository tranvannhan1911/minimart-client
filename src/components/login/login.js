import {
} from '@ant-design/icons';
import { Button, Col, Row, Checkbox, Form, Input } from 'antd';
import { Typography } from 'antd';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Background from '../../assets/BG.svg';
const { Title } = Typography;


const Login = () => {
    const onFinish = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Row justify="space-around" align="middle" style={{
            height: '100vh'
        }}>
            <Col span={8} >
                <Form
                    name="basic"
                    labelCol={{
                        span: 5,
                    }}
                    wrapperCol={{
                        span: 19,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Số điện thoại"
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập số điện thoại!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập mật khẩu!',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
{/* 
                    <Form.Item
                        name="remember"
                        valuePropName="checked"
                        wrapperCol={{
                            span: 24,
                        }}
                    >
                        <Checkbox>Lưu trạng thái đăng nhập</Checkbox>
                    </Form.Item> */}

                    <Form.Item
                        wrapperCol={{
                            span: 24,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                    <p>Quên mật khẩu ? <Link to="/management">Lấy lại mật khẩu</Link> </p>
                </Form>
            </Col>
        </Row>
    )
}

export default Login;