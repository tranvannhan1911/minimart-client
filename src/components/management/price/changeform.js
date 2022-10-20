import {
  PlusOutlined, EditOutlined, DeleteOutlined, HistoryOutlined, MinusCircleOutlined
} from '@ant-design/icons';
import {
  Button, Form, Input, Select, message, Space, Popconfirm,
  DatePicker, Col, Row, notification, Typography
} from 'antd';

import React, { useState, useEffect, useRef } from 'react';
import api from '../../../api/apis'
import ChangeForm from '../templates/changeform';
import { useNavigate, useParams } from 'react-router-dom'
import Loading from '../../basic/loading';
import paths from '../../../utils/paths'
import messages from '../../../utils/messages'
import { validName1 } from '../../../resources/regexp'
import moment from "moment";

const dateFormat = "YYYY/MM/DD";

const { Option } = Select;

const titleCol = {
    fontWeight: 500
}

const PriceChangeForm = (props) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [formPrice] = Form.useForm();
  const [loadings, setLoadings] = useState([]);
  const [baseProductOptions, setBaseProductOptions] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [idxBtnSave, setIdxBtnSave] = useState([]);
  const [baseUnitOptions, setBaseUnitOptions] = useState([]);
  let { id } = useParams();
  const [is_create, setCreate] = useState(null); // create
  const [priceDetails, setPriceDetails] = useState([]);
  const refAutoFocus = useRef(null)
  let dataDetails = [];
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
      navigate(paths.price.list)
    } else if (idxBtnSave == 1) {
      if (is_create) {
        navigate(paths.price.change(response.data.data.id))
        setCreate(false)
      }
      refAutoFocus.current && refAutoFocus.current.focus()
    } else if (idxBtnSave == 2) {
      if (!is_create) {
        navigate(paths.price.add)
        setCreate(true)
      }
      form.resetFields()
      refAutoFocus.current && refAutoFocus.current.focus()
    }

  }

  const create = async (values) => {
    if (!values["pricedetails"] || values["pricedetails"].length == 0) {
      message.error("Không thể tạo bảng giá trống")
      return;
    }

    try {
      const response = await api.price.add(values);
      if (response.data.code == 1) {
        message.success(messages.price.SUCCESS_SAVE())
        directAfterSubmit(response)
        return true
      } else {
        if (response.data.message.length > 0) {
          notification.error({
            message: "Sản phẩm đã tồn tại trong bảng giá khác",
            placement: "topRight",
            description: <span>
              {response.data.message[0]}
            </span>,
            duration: 10
          })
        } else {
          message.error(response.data.message)
        }
      }
    } catch (error) {
      message.error(messages.ERROR)
      console.log('Failed:', error)
    }
    return false
  }

  const update = async (values) => {
    try {
      const response = await api.price.update(id, values)
      if (response.data.code == 1) {
        message.success(messages.price.SUCCESS_SAVE(id))
        directAfterSubmit(response)
        return true
      } else {
        if (response.data.message.length > 0) {
          notification.error({
            message: "Sản phẩm đã tồn tại trong bảng giá khác",
            placement: "topRight",
            description: <span>
              {response.data.message[0]}
            </span>,
            duration: 10
          })
        } else {
          message.error(response.data.message)
        }
      }
    } catch (error) {
      message.error(messages.ERROR)
      console.log('Failed:', error)
    }
    return false
  }

  const _delete = async () => {
    try {
      const response = await api.price.delete(id)
      if (response.data.code == 1) {
        message.success(messages.price.SUCCESS_DELETE(id))
        navigate(paths.price.list)
        return true
      } else {
        message.error(messages.price.ERROR_DELETE(id))
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
    // console.log(state);
    if (!validName1.test(values.name)) {
      message.error('Tên không hợp lệ! Ký tự đầu của chữ đầu tiên phải viết hoa');
      setDisableSubmit(false)
      stopLoading(idxBtnSave)
      return;
    }
    if (values.end_date < values.start_date) {
      message.error('Ngày kết thúc phải sau ngày bắt đầu');
      stopLoading(idxBtnSave)
      setDisableSubmit(false)
      return;
    }
    if (is_create) {
      await create(values)
    } else {
      values.pricedetails = priceDetails;
      await update(values)
    }
    stopLoading(idxBtnSave)
    setDisableSubmit(false)
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
    stopLoading(0)
  };

  const handleData = async () => {
    setLoadingData(true)
    try {
      const response = await api.price.get(id);
      const values = response.data.data
      let details = values.pricedetails.map(elm => {
        let i = {
          "price": elm.price,
          "note": elm.note,
          "product": elm.product.id,
          "unit_exchange": elm.unit_exchange.id
        }
        return i;
      });
      values.start_date = moment(values.start_date)
      values.status = values.status.toString()
      values.end_date = moment(values.end_date)
      setPriceDetails(details);
      values.pricedetails = values.pricedetails.map(elm => {
        elm.product = elm.product.id;
        if (elm.unit_exchange == null) {
          elm.unit_exchange = null;
        } else {
          elm.unit_exchange = elm.unit_exchange.unit_name;
        }
        return elm;
      });

      form.setFieldsValue(values)
    } catch (error) {
      message.error(messages.ERROR)
    } finally {
      setLoadingData(false)
    }
  }
  const handleDataBaseProduct = async () => {
    setLoadingData(true)
    try {
      const response = await api.product.list();
      const options = response.data.data.results.map(elm => {
        return (
          <Option key={elm.id} value={elm.id}>{elm.name}</Option>
        )
      })
      setBaseProductOptions(options)
    } catch (error) {
      message.error(messages.ERROR)
    } finally {
      setLoadingData(false)
    }
  }
  const handleDataBaseUnit = async (unit_exchange) => {
    setLoadingData(true)
    try {
      const options = unit_exchange.map(elm => {
        elm.unit_exchange_value = elm.value
        delete elm.value
        return (
          <Option key={elm.id} value={elm.id} {...elm}>{elm.unit_name}</Option>
        )
      })
      setBaseUnitOptions([...baseUnitOptions, options]);
    } catch (error) {
      message.error(messages.ERROR)
    } finally {
      setLoadingData(false)
    }
  }

  const onUnitSelect = async (option) => {
    try {
      const response = await api.product.get(option);
      handleDataBaseUnit(response.data.data.units)

    } catch (error) {
      message.error(messages.ERROR)
    } finally {
    }
  }



  useEffect(() => {
    if (is_create == null) {
      setCreate(props.is_create)
      if (!props.is_create) {
        handleData()
        handleDataBaseProduct();
        // handleDataBaseUnit()
      }
      setLoadingData(false)
    }
    handleDataBaseProduct();
    // handleDataBaseUnit()
  }, [])

  useEffect(() => {
    props.setBreadcrumb([
      { title: "Bảng giá", href: paths.price.list },
      { title: is_create ? "Thêm mới" : "Chỉnh sửa" }])

    if (is_create == false) {
      props.setBreadcrumbExtras([
        <Popconfirm
          placement="bottomRight"
          title="Xác nhận xóa bảng giá này"
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
        <Button type="info" icon={<HistoryOutlined />} onClick={() => { navigate(paths.price.list) }}
        >Thoát</Button>
      ])
    } else {
      props.setBreadcrumbExtras([
        <Button type="info" icon={<HistoryOutlined />} onClick={() => { navigate(paths.price.list) }}
        >Thoát</Button>
      ])
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
            <><>
              <Row>
                <Col span={1}></Col>
                <Col span={10}>
                  <Form.Item label="Tên bảng giá" name="name" required
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập tên bảng giá!',
                      },
                    ]}
                  >
                    <Input autoFocus ref={refAutoFocus} />
                  </Form.Item>
                </Col>
                <Col span={2}></Col>
                <Col span={10}>
                  <Form.Item label="Ngày bắt đầu" name="start_date" required
                    style={{
                      textAlign: "left",
                      // width:'500px',
                      marginLeft: '0px',
                      // display:'inline-grid'
                    }}
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập ngày bắt đầu!',
                      },
                    ]}
                  >
                    <DatePicker format={dateFormat} disabled={is_create ? false : true} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={1}></Col>
                <Col span={10}>
                  <Form.Item label="Trạng thái" name="status" required
                    style={{
                      textAlign: 'left'
                    }}>
                    <Select
                      defaultValue="false"
                      style={{
                        width: '100%',
                      }}
                    >
                      <Option value="true">Hoạt động</Option>
                      <Option value="false">Khóa</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={2}></Col>
                <Col span={10}>
                  <Form.Item label="Ngày kết thúc" name="end_date" required
                    style={{
                      textAlign: "left",
                      // width:'500px',
                      // display:'inline-grid'
                    }}
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập ngày kết thúc!',
                      },
                    ]}
                  >
                    <DatePicker format={dateFormat} disabled={is_create ? false : true} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>

            </>
              <Col>
                <label><h2 style={{ marginTop: '10px', marginBottom: '30px', textAlign: 'center' }}>Bảng giá sản phẩm</h2></label>

                <Form.List name="pricedetails" label="Bảng giá sản phẩm">
                  {(fields, { add, remove }) => (
                    <>
                      <Row>
                          <Col span={1}></Col>
                          <Col span={10} style={titleCol}>
                            <Typography.Text>Sản phẩm</Typography.Text>
                          </Col>
                          <Col span={1}></Col>
                          <Col span={5} style={titleCol}>
                            <Typography.Text>Đơn vị tính</Typography.Text>
                          </Col>
                          <Col span={5} style={titleCol}>
                            <Typography.Text>Giá bán</Typography.Text>
                          </Col>
                          <Col span={2}></Col>
                      </Row>
                      {fields.map(({ key, name, ...restField }) => (
                        <Row>
                          <Col span={1}></Col>
                          <Col span={10}>
                            <Form.Item
                              {...restField}
                              name={[name, 'product']}
                              rules={[
                                {
                                  required: true,
                                  message: 'Vui lòng chọn sản phẩm!',
                                },
                              ]}
                              style={{
                                textAlign: 'left'
                              }}
                            >
                              <Select
                                showSearch
                                onChange={(option) => onUnitSelect(option)}
                                placeholder="Sản phẩm"
                                optionFilterProp="children"
                                filterOption={(input, option) => option.children.includes(input)}
                                filterSort={(optionA, optionB) =>
                                  optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                }
                                disabled={is_create ? false : true}
                              >
                                {baseProductOptions}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col span={1}></Col>
                          <Col span={5}>
                            <Form.Item
                              {...restField}
                              name={[name, 'unit_exchange']}
                              rules={[
                                {
                                  required: true,
                                  message: 'Vui lòng chọn đơn vị tính!',
                                },
                              ]}
                              required
                              style={{
                                textAlign: 'left'
                              }}
                            >
                              <Select
                                showSearch
                                placeholder="Đơn vị tính"
                                optionFilterProp="children"
                                filterOption={(input, option) => option.children.includes(input)}
                                filterSort={(optionA, optionB) =>
                                  optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                }

                                disabled={is_create ? false : true}
                              >
                                {baseUnitOptions[name]}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col span={5}>
                            <Form.Item
                              {...restField}
                              name={[name, 'price']}
                              rules={[
                                {
                                  required: true,
                                  message: 'Vui lòng nhập giá!',
                                },
                              ]}
                            >
                              <Input placeholder="Giá" type='number' style={{ width: 150 }} min='0' disabled={is_create ? false : true} />
                            </Form.Item>
                          </Col>
                          <Col span={1}>

                            <Popconfirm
                              placement="bottomRight"
                              title="Xác nhận xóa bảng giá này"
                              onConfirm={() => {
                                remove(name)
                                var _baseUnitOptions = [...baseUnitOptions]
                                _baseUnitOptions.splice(name, 1)
                                setBaseUnitOptions(_baseUnitOptions)
                              }}
                              okText="Đồng ý"
                              okType="danger"
                              cancelText="Hủy bỏ"
                              disabled={is_create ? false : true}
                            >
                              <MinusCircleOutlined />
                            </Popconfirm>
                          </Col>
                          <Col span={1}></Col>
                        </Row>
                      ))}
                      <Row>

                        <Form.Item style={{ width: '170px', margin: 'auto' }}>
                          <Button type="dashed" disabled={is_create ? false : true} onClick={() => add()} block icon={<PlusOutlined />} >
                            Thêm giá sản phẩm
                          </Button>
                        </Form.Item>

                      </Row>
                    </>
                  )}
                </Form.List>
              </Col>
              <Form.Item style={{ marginTop: '40px' }}>
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
              </Form.Item></>
          }>
        </ChangeForm>
      }
    </>
  )

}

export default PriceChangeForm;