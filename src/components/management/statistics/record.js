import {
    PlusOutlined, EditOutlined, DeleteOutlined, HistoryOutlined
  } from '@ant-design/icons';
  import { Button, Form, Input, Select, message, Space, Popconfirm, Switch, Row, Col } from 'antd';
  import { Typography } from 'antd';
  import React, { useState, useEffect, useRef } from 'react';
  import api from '../../../api/apis'
  import ChangeForm from '../templates/changeform';
  import { useNavigate, useParams } from 'react-router-dom'
  import Loading from '../../basic/loading';
  import paths from '../../../utils/paths'
  import messages from '../../../utils/messages'
  import { validPhone, validName } from '../../../resources/regexp'
  
  const { Option } = Select;
  const { TextArea } = Input;
  const idCity = 0;
  
  const StatisticsRecord = () => {
    // const navigate = useNavigate();
    // const [form] = Form.useForm();
    // const [loadings, setLoadings] = useState([]);
    // const [loadingData, setLoadingData] = useState(true);
    // const [disableSubmit, setDisableSubmit] = useState(false);
    // const [idxBtnSave, setIdxBtnSave] = useState([]);
    // let { id } = useParams();
    // const [is_create, setCreate] = useState(null); // create
    // const refAutoFocus = useRef(null)

  
    // const enterLoading = (index) => {
    //   setLoadings((prevLoadings) => {
    //     const newLoadings = [...prevLoadings];
    //     newLoadings[index] = true;
    //     return newLoadings;
    //   });
    // };
  
    // const stopLoading = (index) => {
    //   setLoadings((prevLoadings) => {
    //     const newLoadings = [...prevLoadings];
    //     newLoadings[index] = false;
    //     return newLoadings;
    //   });
    // }
  
    // const onFinish = async (values) => {
    //   setDisableSubmit(true)
    //   enterLoading(idxBtnSave)
    //   // console.log(state);
    //   if (!validName.test(values.fullname)) {
    //     message.error('Tên không hợp lệ! Ký tự đầu mỗi từ phải viết hoa');
    //     setDisableSubmit(false)
    //     stopLoading(idxBtnSave)
    //     return;
    //   }
    //   if (!validPhone.test(values.phone)) {
    //     message.error('Số điện thoại không hợp lệ! Số điện thoại bao gồm 10 ký tự số bắt đầu là 84 hoặc 03, 05, 07, 08, 09');
    //     setDisableSubmit(false)
    //     stopLoading(idxBtnSave)
    //     return;
    //   }
    // //   if (is_create) {
    // //     await create(values)
    // //   } else {
    // //     await update(values)
    // //   }
    //   stopLoading(idxBtnSave)
    //   setDisableSubmit(false)
    // }
  
    // const onFinishFailed = (errorInfo) => {
    //   // console.log("props.create", props.create)
    //   console.log('Failed:', errorInfo)
    //   stopLoading(0)
    // };
  
    // const handleData = async () => {
    //   setLoadingData(true)
    //   try {
    //     const response = await api.staff.get(id);
    //     const values = response.data.data
    //     // console.log(values)
    //     form.setFieldsValue(values)
    //   } catch (error) {
    //     message.error(messages.ERROR)
    //   } finally {
    //     setLoadingData(false)
    //   }
    // }
  
    return (
        <div><h3 style={{textAlign:'center'}}>Thống kê kiểm kê</h3></div>
        
    )
  
  }
  
  export default StatisticsRecord;