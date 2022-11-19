import {
  PlusOutlined, EditOutlined, DeleteOutlined, HistoryOutlined
} from '@ant-design/icons';
import { Button, Form, Input, Select, message, Space, 
    Popconfirm, Row, Col } from 'antd';

import React, { useState, useEffect, useRef } from 'react';
import api from '../../../api/apis'
import ChangeForm from '../templates/changeform';
import { useNavigate, useParams } from 'react-router-dom'
import Loading from '../../basic/loading';
import paths from '../../../utils/paths'
import messages from '../../../utils/messages'
import { validPhone, validName1, validEmail, validCodeSupplier } from '../../../resources/regexp'
import AddressSelect from '../address/address_select';
import store, { setInfoCreateUpdate } from '../../../store/store';

const { TextArea } = Input;

const SupplierChangeForm = (props) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loadings, setLoadings] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [idxBtnSave, setIdxBtnSave] = useState([]);
  let { id } = useParams();
  const [is_create, setCreate] = useState(null); // create
  const refAutoFocus = useRef(null)
  const [addressValue, setAddressValue] = useState([]);

  useEffect(() => {
    document.title = "Nhà cung cấp - Quản lý siêu thị mini NT"
  }, [])
  

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
      { title: "Nhà cung cấp", href: paths.supplier.list },
      { title: is_create ? "Thêm mới" : "Chỉnh sửa" }])

    if (is_create == false) {
      props.setBreadcrumbExtras([
        <Popconfirm
          placement="bottomRight"
          title="Xác nhận xóa nhà cung cấp này"
          onConfirm={_delete}
          okText="Đồng ý"
          okType="danger"
          cancelText="Hủy bỏ"
        >
          <Button type="danger" icon={<DeleteOutlined />}
          >Xóa</Button>
        </Popconfirm>,
        // <Button type="info" icon={<HistoryOutlined />}
        // >Lịch sử chỉnh sửa</Button>,
        <Button type="info" icon={<HistoryOutlined />} onClick={() => { navigate(paths.supplier.list) }}
        >Thoát</Button>
      ])
    } else {
      props.setBreadcrumbExtras([
        <Button type="info" icon={<HistoryOutlined />} onClick={() => { navigate(paths.supplier.list) }}
        >Thoát</Button>])
    }
  }, [is_create])

  useEffect(() => {
    setTimeout(() => refAutoFocus.current && refAutoFocus.current.focus(), 500)
  }, [refAutoFocus])

  const handleData = async () => {
    setLoadingData(true)
    try {
      const response = await api.supplier.get(id);
      const values = response.data.data
      form.setFieldsValue(values)

      if(values.ward){
        const response2 = await api.address.get_parent(values.ward);
        setAddressValue(response2.data.data.tree)
      }
      store.dispatch(setInfoCreateUpdate(values))
    } catch (error) {
      message.error(messages.ERROR)
    } finally {
      setLoadingData(false)
    }
  }

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
      navigate(paths.supplier.list)
    } else if (idxBtnSave == 1) {
      if (is_create) {
        navigate(paths.supplier.change(response.data.data.id))
        setCreate(false)
      }
      refAutoFocus.current && refAutoFocus.current.focus()
    } else if (idxBtnSave == 2) {
      if (!is_create) {
        navigate(paths.supplier.add)
        setCreate(true)
      }
      form.resetFields()
      refAutoFocus.current && refAutoFocus.current.focus()
    }

  }

  const create = async (values) => {
    values["ward"] = addressValue && addressValue.length > 0 ? addressValue.at(-1) : undefined
    try {
      const response = await api.supplier.add(values);
      if (response.data.code == 1) {
        message.success(messages.supplier.SUCCESS_SAVE())
        directAfterSubmit(response)
        return true
      } else if (response.data.message.code) {
        message.error("Mã nhà cung cấp bị trùng! Vui lòng chọn mã khác!")
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
    values["ward"] = addressValue && addressValue.length > 0 ? addressValue.at(-1) : undefined
    try {
      const response = await api.supplier.update(id, values)
      if (response.data.code == 1) {
        message.success(messages.supplier.SUCCESS_SAVE(response.data.data.code))
        directAfterSubmit(response)
        return true
      } else {
        message.error(response.data.message.code.toString())
      }
    } catch (error) {
      message.error(messages.ERROR)
      console.log('Failed:', error)
    }
    return false
  }

  const _delete = async () => {
    try {
      const response = await api.supplier.delete(id)
      if (response.data.code == 1) {
        message.success(messages.supplier.SUCCESS_DELETE(form.getFieldValue("code")))
        navigate(paths.supplier.list)
        return true
      } else {
        message.error(messages.supplier.ERROR_DELETE(form.getFieldValue("code")))
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
    if (!validCodeSupplier.test(values.code)) {
      message.error('Mã không hợp lệ! Mã bắt đầu bằng NCC sau đó là 3 ký tự số! VD: NCC001');
      setDisableSubmit(false)
      stopLoading(idxBtnSave)
      return;
    }
    if (!validName1.test(values.name)) {
      message.error('Tên không hợp lệ! Chữ cái đầu của từ đầu tiên phải viết hoa');
      setDisableSubmit(false)
      stopLoading(idxBtnSave)
      return;
    }
    if (!validPhone.test(values.phone)) {
      message.error('Số điện thoại không hợp lệ! Số điện thoại bao gồm 10 chữ số bắt đầu là 84 hoặc 03, 05, 07, 08, 09');
      setDisableSubmit(false)
      stopLoading(idxBtnSave)
      return;
    }
    if (!validEmail.test(values.email)) {
      message.error('Email không hợp lệ');
      setDisableSubmit(false)
      stopLoading(idxBtnSave)
      return;
    }

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
              <Row>
                <Col span={1}></Col>
                <Col span={10}>
                  <Form.Item label="Mã nhà cung cấp" name="code" required
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập mã nhà cung cấp!',
                      },
                    ]}
                  >
                    <Input autoFocus ref={refAutoFocus} disabled={is_create ? false : true} className="inputBorderDisableText"/>
                  </Form.Item>
                </Col>
                <Col span={2}></Col>
                <Col span={10}>
                  
                  <Form.Item label="Tên nhà cung cấp" name="name" required
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập tên nhà cung cấp!',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={1}></Col>
                <Col span={10}>
                  <Form.Item label="Số điện thoại" name="phone" required
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập số điện thoại!',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={2}></Col>
                <Col span={10}>
                  <Form.Item label="Địa chỉ email" name="email" required
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập số email!',
                      },
                    ]}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={1}></Col>
                <Col span={10}>
                  <Form.Item label="Số nhà, đường" name="address">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={2}></Col>
                <Col span={10}>
                  <Form.Item label="Địa chỉ" name="ward">
                    <AddressSelect addressValue={addressValue} setAddressValue={setAddressValue}/>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={1}></Col>
                <Col span={22}>
                  <Form.Item label="Ghi chú" name="note" >
                    <TextArea rows={4} />
                  </Form.Item>
                </Col>
              </Row>

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

export default SupplierChangeForm;