import {
  PlusOutlined, EditOutlined, DeleteOutlined, HistoryOutlined
} from '@ant-design/icons';
import { Button, Form, Input, Select, message, Space, Popconfirm } from 'antd';
import { Typography } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import { StaffApi } from '../../../api/apis'
import ChangeForm from '../templates/changeform';
import { useNavigate, useParams } from 'react-router-dom'
import Loading from '../../basic/loading';
import paths from '../../../utils/paths'
const { Option } = Select;
const { TextArea } = Input;

const StaffChangeForm = (props) => {
  const staffApi = new StaffApi()
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loadings, setLoadings] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [dataCustomerGroup, setDataCustomerGroup] = useState([]);
  const [idxBtnSave, setIdxBtnSave] = useState([]);
  let { id } = useParams();
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
      navigate(paths.staff.list)
    } else if (idxBtnSave == 1) {
      if (is_create) {
        navigate(paths.staff.change(response.data.data.id))
        setCreate(false)
      }
      refAutoFocus.current && refAutoFocus.current.focus()
    } else if (idxBtnSave == 2) {
      if (!is_create) {
        navigate(paths.staff.add)
        setCreate(true)
      }
      form.resetFields()
      refAutoFocus.current && refAutoFocus.current.focus()
    }

  }

  const create = async (values) => {
    try {
      const response = await staffApi.add(values);
      if (response.data.code == 1) {
        message.success('Lưu nhân viên thành công')
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
      const response = await staffApi.update(id, values)
      console.log("update", response)
      if (response.data.code == 1) {

        message.success('Lưu nhân viên thành công')
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
  
  const deleteCustomer = async () => {
    try {
      const response = await staffApi.delete(id)
      console.log("delete", response)
      if (response.data.code == 1) {

        message.success('Xóa nhân viên thành công')
        navigate(paths.staff.list)
        return true
      } else {
        message.error("Không thể xóa nhân viên này")
      }
    } catch (error) {
      message.error('Có lỗi xảy ra')
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

  const handleData = async () => {
    setLoadingData(true)
    try {
      const response = await staffApi.get(id);
      const values = response.data.data
      form.setFieldsValue(values)
    } catch (error) {
      message.error("Có lỗi xảy ra")
    } finally {
      setLoadingData(false)
    }
  }

  useEffect(() => {
    if (is_create == null) {
      setCreate(props.is_create)
      if (!props.is_create) {
        handleData()
      }
      setLoadingData(false)
    }
  }, [])

  useEffect(() => {
    props.setBreadcrumb([
      { title: "Nhân viên", href: paths.staff.list },
      { title: is_create ? "Thêm mới" : "Chỉnh sửa" }])

    if (is_create==false) {
      props.setBreadcrumbExtras([
        <Popconfirm
          placement="bottomRight"
          title="Xác nhận xóa nhân viên này"
          onConfirm={deleteCustomer}
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
              <Form.Item label="Tên nhân viên" name="fullname" required
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập tên nhân viên!',
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

export default StaffChangeForm;