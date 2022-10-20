import {
  PlusOutlined, EditOutlined, DeleteOutlined, HistoryOutlined
} from '@ant-design/icons';
import { Button, Form, Input, message, Space, Popconfirm, Row, Col } from 'antd';

import React, { useState, useEffect, useRef } from 'react';
import api from '../../../api/apis'
import ChangeForm from '../templates/changeform';
import { useNavigate, useParams } from 'react-router-dom'
import Loading from '../../basic/loading';
import paths from '../../../utils/paths'
import messages from '../../../utils/messages'
import { validName1, validCode } from '../../../resources/regexp'

const { TextArea } = Input;

const ProductGroupForm = (props) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loadings, setLoadings] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [idxBtnSave, setIdxBtnSave] = useState([]);
  let { id } = useParams();
  const [is_create, setCreate] = useState(null); // create
  const refAutoFocus = useRef(null)

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
    if (!props.is_modal){
      props.setBreadcrumb([
        { title: "Nhóm sản phẩm", href: paths.product_group.list },
        { title: is_create ? "Thêm mới" : "Chỉnh sửa" }])
    }

    if (is_create == false) {
      props.setBreadcrumbExtras([
        <Popconfirm
          placement="bottomRight"
          title="Xác nhận xóa nhóm sản phẩm này"
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
        <Button type="info" icon={<HistoryOutlined />} onClick={() => { navigate(paths.product_group.list) }}
        >Thoát</Button>
      ])
    } else {
      props.setBreadcrumbExtras([
        <Button type="info" icon={<HistoryOutlined />} onClick={() => { navigate(paths.product_group.list) }}
        >Thoát</Button>
      ])
    }
  }, [is_create])

  // useEffect(() => {
  //   console.log("props.modalSubmit", props.modalSubmit)
  //   if(props.modalSubmit){
  //     form.submit()
  //   }
  //   props.setModalSubmit(false)
  // }, [props.modalSubmit])

  useEffect(() => {
    setTimeout(() => refAutoFocus.current && refAutoFocus.current.focus(), 500)
  }, [refAutoFocus])

  const handleData = async () => {
    setLoadingData(true)
    try {
      const response = await api.product_group.get(id);
      const values = response.data.data
      form.setFieldsValue(values)
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
    if (props.is_modal){ // modal
      form.resetFields()
      props.onFinishSave()
      return;
    }
    if (idxBtnSave == 0) {
      navigate(paths.product_group.list)
    } else if (idxBtnSave == 1) {
      if (is_create) {
        navigate(paths.product_group.change(response.data.data.id))
        setCreate(false)
      }
      refAutoFocus.current && refAutoFocus.current.focus()
    } else if (idxBtnSave == 2) {
      if (!is_create) {
        navigate(paths.product_group.add)
        setCreate(true)
      }
      form.resetFields()
      refAutoFocus.current && refAutoFocus.current.focus()
    }

  }

  const create = async (values) => {
    try {
      const response = await api.product_group.add(values);
      if (response.data.code == 1) {
        message.success(messages.product_group.SUCCESS_SAVE())
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
      const response = await api.product_group.update(id, values)
      if (response.data.code == 1) {
        message.success(messages.product_group.SUCCESS_SAVE(id))
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
      const response = await api.product_group.delete(id)
      if (response.data.code == 1) {
        message.success(messages.product_group.SUCCESS_DELETE(id))
        navigate(paths.product_group.list)
        return true
      } else {
        message.error(messages.product_group.ERROR_DELETE(id))
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
    if (!validName1.test(values.name)) {
      message.error('Tên không hợp lệ! Chữ cái đầu của từ đầu tiên phải viết hoa');
      setDisableSubmit(false)
      stopLoading(idxBtnSave)
      return;
    }
    if (!validCode.test(values.product_group_code)) {
      message.error('Code nhóm sản phẩm không hợp lệ! Code bao gồm 3 ký tự in hoa và 3 ký tự số phía sau (VD: AAA000)');
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
                  <Form.Item label="Tên nhóm sản phẩm" name="name" required
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập tên nhóm sản phẩm!',
                      },
                    ]}
                  >
                    <Input autoFocus ref={refAutoFocus} />
                  </Form.Item>
                </Col>
                <Col span={2}></Col>
                <Col span={10}>
                  <Form.Item label="Code nhóm sản phẩm" name="product_group_code" required
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập code nhóm sản phẩm!',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={1}></Col>
                <Col span={22}>
                  <Form.Item label="Mô tả" name="description" >
                    <TextArea rows={4} />
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

export default ProductGroupForm;