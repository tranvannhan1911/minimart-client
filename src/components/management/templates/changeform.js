import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Form, Input, Radio } from 'antd';
import React, { useEffect, useState } from 'react';

const ChangeForm = (props, {disabled}) => {

    useEffect(() => {
        console.log("ChangeForm", disabled)
    }, [disabled])
    

    return (
        <Form
            form={props.form}
            layout="vertical"
            initialValues={{
                requiredMarkValue: 'required',
            }}
            requiredMark='required'
            onFinish={props.onFinish}
            onFinishFailed={props.onFinishFailed}
        >
            {props.forms}
        </Form>
    );
};

export default ChangeForm;