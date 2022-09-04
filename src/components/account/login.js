import {
    PhoneOutlined, LockOutlined
} from '@ant-design/icons'
import { Button, Col, Row, Checkbox, Form, Input, message } from 'antd'
import { Typography } from 'antd'
import React, { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { AccountApi } from "../../api/apis"
import { setToken } from '../../store/store'

const { Title } = Typography;


const Login = () => {
    // const dispatch = useDispatch();
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
        message.error('Sai số điện thoại hoặc mật khẩu')
    };

    const onFinish = async (values) => {
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

                // const action = setToken(response.data.data)
                // dispatch(action)

                navigate('/quan-ly/khach-hang')
            } else {
                error_msg()
            }
        } catch (error) {
            console.log('Failed:', error)
            error_msg()
        } finally{
            stopLoading(0)
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo)
        error_msg()
    };

    return (
        <Row justify="space-around" align="middle" style={{
            height: '100vh'
        }}>
            <Col span={8} xs={18} sm={14} md={10} lg={8}>
                <Title level={3} style={{marginBottom: '20px'}}>
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
                            prefix={<PhoneOutlined className="site-form-item-icon" />} 
                            placeholder="Số điện thoại" 
                            autoFocus/>
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
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Mật khẩu"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button"
                            loading={loadings[0]} onClick={() => enterLoading(0)}>
                            Đăng nhập
                        </Button>
                    </Form.Item>
                    <p>Quên mật khẩu ? <Link to="/quen-mat-khau">Lấy lại mật khẩu</Link> </p>
                </Form>
            </Col>
        </Row >
    )
}

export default Login;