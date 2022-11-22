import { Button, Modal, Form, Input,message } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { AccountApi } from "../../../api/apis"
import store, { setUser } from '../../../store/store';

const ModalLogin = (props) => {
    const [form] = Form.useForm();
    const [isModalLoginOpen, setIsModalLoginOpen] = useState(false);
    const passwordRef = useRef();

    const showModal = () => {
        setIsModalLoginOpen(true);
    };

    useEffect(() => {
        setTimeout(() => {
            if(passwordRef.current){
                passwordRef.current.focus()
            }
        }, 200)
        
      }, [props.open])

    const handleOk = () => {
        props.setOpen(false);
        props.errorStaff();
    };

    const handleCancel = () => {
        props.setOpen(false);
        props.errorStaff();
        form.resetFields();
    };

    // useEffect(() => {
    //     passwordRef.current.focus();
    // }, [props.open]);

    const onFinish = async (values) => {
        console.log('Success:', props.phone);

        if (form.getFieldValue("password") == null || form.getFieldValue("password") == "") {
            message.error('Vui lòng nhập mật khẩu');
            passwordRef.current.focus();
            return;
        }

        const params = {
            phone: props.phone,
            password: form.getFieldValue("password"),
        };
        const accountApi = new AccountApi()
        try {
            const response = await accountApi.login(params);
            console.log(response)
            if (response.data.code == 1) {

                accountApi.save_token(response)
                message.success('Đăng nhập thành công');
                form.resetFields();
                props.setStaff();
                props.setOpen(false);

                try{
                    const response = await accountApi.get_info()
                    const action = setUser(response.data.data)
                    store.dispatch(action)
                }catch(error){
                    console.log(error)
                }
            } else {
                message.error('Đăng nhập thất bại');
                passwordRef.current.focus();
            }
        } catch (error) {
            console.log('Failed:', error)
        } finally {
        }
      };
    
      const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };

    return (
        <>
            <Modal title="Đăng nhập" open={props.open} onOk={onFinish} onCancel={handleCancel} okText="Đăng nhập" cancelText="Thoát">
                <Form
                form={form}
                    name="basic"
                    labelCol={{
                        span: 4,
                    }}
                    wrapperCol={{
                        span: 20,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >

                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Hãy nhập mật khẩu!',
                            },
                        ]}
                    >
                        <Input.Password ref={passwordRef} onPressEnter={() => onFinish()}/>
                    </Form.Item>

                </Form>
            </Modal>
        </>
    );
};

export default ModalLogin;