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
import { validName1 } from '../../../resources/regexp'
import store, { setInfoCreateUpdate } from '../../../store/store';

const { Option } = Select;
const { TextArea } = Input;

const UnitChangeForm = (props) => {
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
    document.title = "Đơn vị tính - Quản lý siêu thị mini NT"
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
      { title: "Đơn vị tính", href: paths.unit.list },
      { title: is_create ? "Thêm mới" : "Chỉnh sửa" }])

    if (is_create == false) {
      props.setBreadcrumbExtras([
        <Popconfirm
          placement="bottomRight"
          title="Xác nhận xóa đơn vị tính này"
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
        <Button type="info" icon={<HistoryOutlined />} onClick={() => { navigate(paths.unit.list) }}
        >Thoát</Button>
      ])
    } else {
      props.setBreadcrumbExtras([
      <Button type="info" icon={<HistoryOutlined />} onClick={() => { navigate(paths.unit.list) }}
      >Thoát</Button>])
    }
  }, [is_create])

  useEffect(() => {
    setTimeout(() => refAutoFocus.current && refAutoFocus.current.focus(), 500)
  }, [refAutoFocus])

  const handleData = async () => {
    setLoadingData(true)
    try {
      const response = await api.unit.get(id);
      const values = response.data.data
      form.setFieldsValue(values)
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
      navigate(paths.unit.list)
    } else if (idxBtnSave == 1) {
      if (is_create) {
        navigate(paths.unit.change(response.data.data.id))
        setCreate(false)
      }
      refAutoFocus.current && refAutoFocus.current.focus()
    } else if (idxBtnSave == 2) {
      if (!is_create) {
        navigate(paths.unit.add)
        setCreate(true)
      }
      form.resetFields()
      refAutoFocus.current && refAutoFocus.current.focus()
    }

  }

  const create = async (values) => {
    try {
      const response = await api.unit.add(values);
      if (response.data.code == 1) {
        message.success(messages.unit.SUCCESS_SAVE())
        directAfterSubmit(response)
        return true
      } else if (response.data.message.code) {
        message.error("Mã đơn vị tính bị trùng! Vui lòng chọn mã khác!")
      } else if (response.data.message.name) {
        message.error("Tên đơn vị tính bị trùng!")
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
      const response = await api.unit.update(id, values)
      if (response.data.code == 1) {
        message.success(messages.unit.SUCCESS_SAVE(response.data.data.code))
        directAfterSubmit(response)
        return true
      } else if (response.data.message.code) {
        message.error("Mã đơn vị tính bị trùng!")
      } else if (response.data.message.name) {
        message.error("Tên đơn vị tính bị trùng!")
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
      const response = await api.unit.delete(id)
      if (response.data.code == 1) {
        message.success(messages.unit.SUCCESS_DELETE(form.getFieldValue("code")))
        navigate(paths.unit.list)
        return true
      } else {
        message.error(messages.unit.ERROR_DELETE(form.getFieldValue("code")))
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
              <Form.Item label="Mã đơn vị tính" name="code" required
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập mã đơn vị tính!',
                  },
                ]}
              >
                <Input autoFocus ref={refAutoFocus} disabled={is_create ? false : true} className="inputBorderDisableText"/>
              </Form.Item>
              <Form.Item label="Tên đơn vị tính" name="name" required
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập tên đơn vị tính!',
                  },
                ]}
              >
                <Input />
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

export default UnitChangeForm;