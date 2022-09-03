import {
  PlusOutlined, EditOutlined
} from '@ant-design/icons';
import { Button, Form, Input, Select, message, Space } from 'antd';
import { Typography } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import { CustomerApi } from '../../../api/apis'
import ChangeForm from '../templates/changeform';
import { useNavigate, useParams } from 'react-router-dom'
const { Option } = Select;
const { TextArea } = Input;

const CustomerChangeForm = (props) => {
  const customerApi = new CustomerApi()
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loadings, setLoadings] = useState([]);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [dataCustomerGroup, setDataCustomerGroup] = useState([]);
  const [idxBtnSave, setIdxBtnSave] = useState([]);
  let { customer_id } = useParams();
  const [is_create, setCreate] = useState(null); // create 
  
  const fullnameRef = useRef()

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

  const directAfterSubmit = (response) => {
    if(idxBtnSave == 0){
      navigate("/quan-ly/khach-hang")
    }else if(idxBtnSave == 1){
      if(is_create){
        navigate("/quan-ly/khach-hang/"+response.data.data.customer_id)
        setCreate(false)
      }
    }else if(idxBtnSave == 2){
      if(!is_create){
        navigate("/quan-ly/khach-hang/them-moi")
        setCreate(true)
      }
      form.resetFields()
      fullnameRef.current.focus()
    }
    
  }

  const create = async (values) => {
    try {
      const response = await customerApi.add(values);
      console.log(response)
      if (response.data.code == 1) {

        message.success('Lưu khách hàng thành công')
        directAfterSubmit(response)
        return true
      } else {
        message.error(response.data.message.toString())
      }
    } catch (error) {
      message.error('Có lỗi xảy ra')
      console.log('Failed:', error)
    }
    return false
  }

  const update = async (values) => {
    try {
      const response = await customerApi.update(customer_id, values)
      console.log("update", response)
      if (response.data.code == 1) {

        message.success('Lưu khách hàng thành công')
        directAfterSubmit(response)
        return true
      } else {
        message.error(response.data.message.toString())
      }
    } catch (error) {
      message.error('Có lỗi xảy ra')
      console.log('Failed:', error)
    }
    return false
  }

  const onFinish = async (values) => {
    setDisableSubmit(true)
    enterLoading(idxBtnSave)
    if(is_create){
      await create(values)
    }else{
      await update(values)
    }
    stopLoading(idxBtnSave)
    setDisableSubmit(false)
  }

  const onFinishFailed = (errorInfo) => {
    // console.log("props.create", props.create)
    console.log('Failed:', errorInfo)
    stopLoading(0)
  };

  const handleDataCustomer = async () => {
    const response = await customerApi.get(customer_id);
    const values = response.data.data
    values.customer_group = values.customer_group.map(elm => elm.id.toString())
    form.setFieldsValue(values)
  }

  const handleDataCustomerGroup = async () => {
    const response = await customerApi.customer_group_list();
    console.log("handleDataCustomerGroup", response)
    const _dataCustomerGroup = []
    response.data.data.results.forEach(cg => {
      _dataCustomerGroup.push(<Option key={cg.id}>{cg.name}</Option>)
    })
    setDataCustomerGroup(_dataCustomerGroup)
  }

  useEffect(() => {
    handleDataCustomerGroup()
    if(is_create == null){
      setCreate(props.is_create)
      if(!is_create){
        handleDataCustomer()
        // props.setCreate(false)
        console.log("setCreate", false)
      }else{
        // props.setCreate(true)
        console.log("setCreate", true)
      }
    }
  }, [])

  useEffect(() => {
    props.setBreadcrumb([
      {title: "Khách hàng", href: "/quan-ly/khach-hang"}, 
      {title: is_create ? "Thêm mới": "Chỉnh sửa"}])
  }, [is_create])


  return (
    <ChangeForm
      form={form}
      setBreadcrumb={props.setBreadcrumb}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      forms={
        <>
          <Form.Item label="Tên khách hàng" name="fullname" required
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập tên khách hàng!',
              },
            ]}
          >
            <Input ref={fullnameRef}/>
          </Form.Item>
          <Form.Item label="Số điện thoại" name="phone" required
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập số điện thoại!',
              },
            ]}
          >
            <Input disabled={is_create ? false : true}/>
          </Form.Item>
          <Form.Item label="Nhóm khách hàng" name="customer_group" required
          >
            <Select
              mode="multiple"
              allowClear
              style={{
                width: '100%',
              }}
              // placeholder="Please select"
            // defaultValue={['a10', 'c12']}
            // onChange={handleChange}
            >
              {dataCustomerGroup}
            </Select>
          </Form.Item>
          <Form.Item label="Địa chỉ" name="address">
            <Input />
          </Form.Item>
          <Form.Item label="Giới tính" name="gender"
            style={{
              textAlign: 'left'
            }}>
            <Select
              defaultValue="U"
              style={{
                width: 200,
              }}
            >
              <Option value="M">Nam</Option>
              <Option value="F">Nữ</Option>
              <Option value="U">Không xác định</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Ghi chú" name="note" >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<PlusOutlined />}
                loading={loadings[0]}
                onClick={() => setIdxBtnSave(0)}
                disabled={disableSubmit ? true : false}
              >Lưu</Button>
              <Button
                htmlType="submit"
                icon={<EditOutlined />}
                loading={loadings[1]}
                onClick={() => setIdxBtnSave(1)}
                disabled={disableSubmit ? true : false}
              >Lưu và tiếp tục chỉnh sửa</Button>
              <Button
                htmlType="submit"
                icon={<PlusOutlined />}
                loading={loadings[2]}
                onClick={() => setIdxBtnSave(2)}
                disabled={disableSubmit ? true : false}
              >Lưu và thêm mới</Button>
            </Space>
          </Form.Item>

        </>
      }>

    </ChangeForm>
  )

}

export default CustomerChangeForm;