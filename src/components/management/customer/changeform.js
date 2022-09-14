import {
  PlusOutlined, EditOutlined, DeleteOutlined, HistoryOutlined
} from '@ant-design/icons';
import { Button, Form, Input, Select, message, Space, Popconfirm } from 'antd';
import { Typography } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import api from '../../../api/apis'
import ChangeForm from '../templates/changeform';
import { useNavigate, useParams } from 'react-router-dom'
import Loading from '../../basic/loading';
import paths from '../../../utils/paths'
import messages from '../../../utils/messages'
const { Option } = Select;
const { TextArea } = Input;

const CustomerChangeForm = (props) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loadings, setLoadings] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [dataCustomerGroup, setDataCustomerGroup] = useState([]);
  const [idxBtnSave, setIdxBtnSave] = useState([]);
  let { customer_id } = useParams();
  const [is_create, setCreate] = useState(null); // create
  const refAutoFocus = useRef(null)

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
    if (idxBtnSave == 0) {
      navigate(paths.customer.list)
    } else if (idxBtnSave == 1) {
      if (is_create) {
        navigate(paths.customer.change(response.data.data.id))
        setCreate(false)
      }
      refAutoFocus.current && refAutoFocus.current.focus()
    } else if (idxBtnSave == 2) {
      if (!is_create) {
        navigate(paths.customer.add)
        setCreate(true)
      }
      form.resetFields()
      refAutoFocus.current && refAutoFocus.current.focus()
    }

  }

  const create = async (values) => {
    try {
      const response = await api.customer.add(values);
      if (response.data.code == 1) {
        message.success(messages.customer.SUCCESS_SAVE())
        directAfterSubmit(response)
        return true
      } else {
        message.error(response.data.message.toString())
      }
    } catch (error) {
      message.error(messages.ERROR)
      console.log('Failed:', error)
    }
    return false
  }

  const update = async (values) => {
    try {
      const response = await api.customer.update(customer_id, values)
      if (response.data.code == 1) {

        message.success(messages.customer.SUCCESS_SAVE(customer_id))
        directAfterSubmit(response)
        return true
      } else {
        message.error(response.data.message.toString())
      }
    } catch (error) {
      message.error(messages.ERROR)
      console.log('Failed:', error)
    }
    return false
  }
  
  const _delete = async () => {
    try {
      const response = await api.customer.delete(customer_id)
      if (response.data.code == 1) {
        message.success(messages.customer.SUCCESS_DELETE(customer_id))
        navigate(paths.customer.list)
        return true
      } else {
        message.error(messages.customer.ERROR_DELETE(customer_id))
      }
    } catch (error) {
      message.error(messages.ERROR)
      console.log('Failed:', error)
    }
    return false
  };

  const onFinish = async (values) => {
    setDisableSubmit(true)
    enterLoading(idxBtnSave)
    if (is_create) {
      await create(values)
    } else {
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
    setLoadingData(true)
    try {
      const response = await api.customer.get(customer_id);
      const values = response.data.data
      values.customer_group = values.customer_group.map(elm => elm.id.toString())
      form.setFieldsValue(values)
    } catch (error) {
      message.error(messages.ERROR)
    } finally {
      setLoadingData(false)
    }
  }

  const handleDataCustomerGroup = async () => {
    const response = await api.customer_group.list();
    console.log("handleDataCustomerGroup", response)
    const _dataCustomerGroup = []
    response.data.data.results.forEach(cg => {
      _dataCustomerGroup.push(<Option key={cg.id}>{cg.name}</Option>)
    })
    setDataCustomerGroup(_dataCustomerGroup)
  }


  useEffect(() => {
    handleDataCustomerGroup()
    if (is_create == null) {
      setCreate(props.is_create)
      if (!props.is_create) {
        handleDataCustomer()
      }
      setLoadingData(false)
    }
  }, [])

  useEffect(() => {
    props.setBreadcrumb([
      { title: "Khách hàng", href: paths.customer.list },
      { title: is_create ? "Thêm mới" : "Chỉnh sửa" }])

    if (is_create==false) {
      props.setBreadcrumbExtras([
        <Popconfirm
          placement="bottomRight"
          title="Xác nhận xóa khách hàng này"
          onConfirm={_delete}
          okText="Đồng ý"
          okType="danger"
          cancelText="Hủy bỏ"
        >
          <Button type="danger" icon={<DeleteOutlined />}
          >Xóa</Button>
        </Popconfirm>,
        <Button type="info" icon={<HistoryOutlined />}
        >Lịch sử chỉnh sửa</Button>
      ])
    } else {
      props.setBreadcrumbExtras(null)
    }
  }, [is_create])

  useEffect(() => {
    setTimeout(() => refAutoFocus.current && refAutoFocus.current.focus(), 500)
  }, [refAutoFocus])

  return (
    <>
      {loadingData ? <Loading /> :
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
                <Input autoFocus ref={refAutoFocus} />
              </Form.Item>
              <Form.Item label="Số điện thoại" name="phone" required
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số điện thoại!',
                  },
                ]}
              >
                <Input disabled={is_create ? false : true} />
              </Form.Item>
              <Form.Item label="Nhóm khách hàng" name="customer_group"
              >
                <Select
                  mode="multiple"
                  allowClear
                  style={{
                    width: '100%',
                  }}
                  filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
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
      }
    </>
  )

}

export default CustomerChangeForm;