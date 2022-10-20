import {
  PlusOutlined, EditOutlined,
  MinusCircleOutlined, HistoryOutlined
} from '@ant-design/icons';
import {
  Button, Form, Input, Select, message, Space, Popconfirm,
  Col, Row, Typography
} from 'antd';

import React, { useState, useEffect, useRef } from 'react';
import api from '../../../api/apis'
import ChangeForm from '../templates/changeform';
import { useNavigate, useParams } from 'react-router-dom'
import Loading from '../../basic/loading';
import paths from '../../../utils/paths'
import messages from '../../../utils/messages'

const { Option } = Select;
const { TextArea } = Input;

const titleCol = {
  fontWeight: 500
}

const InventoryRecordChangeForm = (props) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [formPrice] = Form.useForm();
  const [loadings, setLoadings] = useState([]);
  const [baseProductOptions, setBaseProductOptions] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [idxBtnSave, setIdxBtnSave] = useState([]);
  const [baseUnitOptions, setBaseUnitOptions] = useState([]);
  const [priceList, setPriceList] = useState([]);
  let { id } = useParams();
  const [is_create, setCreate] = useState(null); // create
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [is_status, setStatus] = useState(null);
  const refAutoFocus = useRef(null)
  const listPrice = [];
  const [unit, setUnit] = useState("")
  const [quantity, setQuantity] = useState("")
  // const onChange = (checked) => {
  //   console.log(`switch to ${checked}`);
  // };

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
      navigate(paths.inventory_record.list)
    } else if (idxBtnSave == 1) {
      if (is_create) {
        navigate(paths.inventory_record.change(response.data.data.id))
        setCreate(false)
      }
      refAutoFocus.current && refAutoFocus.current.focus()
    } else if (idxBtnSave == 2) {
      if (!is_create) {
        navigate(paths.inventory_record.add)
        setCreate(true)
      }
      form.resetFields()
      refAutoFocus.current && refAutoFocus.current.focus()
    }

  }

  const create = async (values) => {
    try {
      const response = await api.inventory_record.add(values);
      if (response.data.code == 1) {
        message.success(messages.inventory_record.SUCCESS_SAVE())
        directAfterSubmit(response)
        return true
      } else if (response.data.code == 0) {
        message.error("Vui lòng nhập từng sản phẩm")
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
      const response = await api.inventory_record.update(id, values)
      if (response.data.code == 1) {
        message.success(messages.inventory_record.SUCCESS_SAVE(id))
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
      const response = await api.inventory_record.delete(id)
      if (response.data.code == 1) {
        message.success(messages.inventory_record.SUCCESS_DELETE(id))
        navigate(paths.inventory_record.list)
        return true
      } else {
        message.error(messages.inventory_record.ERROR_DELETE(id))
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
    if (values.status == null) {
      values.status = "pending";
    }
    if (is_create) {
      await create(values)
    } else {
      // if (is_status == "complete") {
      //   if (values.status == "pending" || values.status == "cancel") {
      //     message.error("Phiếu kiểm kê này đã hoàn thành không thể sửa trạng thái!")
      //     stopLoading(idxBtnSave)
      //     setDisableSubmit(false)
      //     return;
      //   }
      // }
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
      const response = await api.inventory_record.get(id);
      const values = response.data.data
      setStatus(values.status);
      // values.start_date = moment(values.start_date)
      // values.status = values.status.toString()
      // values.end_date = moment(values.end_date)
      ///
      values.details = values.details.map(elm => {
        elm.unit = elm.product.base_unit.name;
        elm.product = elm.product.id;

        // elm.product = elm.product.id;
        return elm;

      })
      console.log("handleData", values)

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
  // const unit = []
  // const handleDataBaseUnit = async (unit_exchange) => {
  //   setLoadingData(true)
  //   try {

  //     const options = unit_exchange.map(elm => {
  //       return (
  //         <Option key={elm.id} value={elm.id}>{elm.unit_name}</Option>
  //       )
  //     })
  //     // console.log(unit);
  //     setBaseUnitOptions(options);
  //   } catch (error) {
  //     message.error(messages.ERROR)
  //   } finally {
  //     setLoadingData(false)
  //   }
  // }

  // async function dataBaseUnit(params) {
  //   console.log(params)
  //   const response = await api.unit.get(params.unit);
  //   const result={
  //     unit_exchange: params.id,
  //     nameUnit: response.data.data.name
  //   }
  //   unit.push(result)
  //   return result;
  // }

  const onProductSelect = async (option, key) => {
    try {
      const response = await api.product.get(option);
      setQuantity(response.data.data.stock);
      setUnit(response.data.data.base_unit.name);
      const a = form.getFieldsValue()
      a.details[key].quantity = response.data.data.stock;
      a.details[key].unit = response.data.data.base_unit.name;
      console.log(a);
      form.setFieldsValue(a);

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
      { title: "Phiếu kiểm kê", href: paths.inventory_record.list },
      { title: is_create ? "Kiểm kê" : "Chỉnh sửa" }])

    if (is_create == false) {
      props.setBreadcrumbExtras([
        // <Popconfirm
        //   placement="bottomRight"
        //   title="Xác nhận xóa phiếu kiểm kê này"
        //   onConfirm={_delete}
        //   okText="Đồng ý"
        //   okType="danger"
        //   cancelText="Hủy bỏ"
        // >
        //   <Button type="danger" icon={<DeleteOutlined />}
        //   >Xóa</Button>
        // </Popconfirm>,
        // <Button type="info" icon={<HistoryOutlined />}
        // >Lịch sử chỉnh sửa</Button>
        <Button type="info" icon={<HistoryOutlined />} onClick={() => { navigate(paths.inventory_record.list) }}
        >Thoát</Button>
      ])
    } else {
      props.setBreadcrumbExtras([
        <Button type="info" icon={<HistoryOutlined />} onClick={() => { navigate(paths.inventory_record.list) }}
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
            </>
              <Row>
                <Col span={1}></Col>
                <Col span={10}>
                  <Form.Item label="Trạng thái" name="status"
                    style={{
                      textAlign: 'left'
                    }}>
                    <Select
                      defaultValue="pending"
                      style={{
                        width: '100%',
                      }}
                    >
                      <Option value="pending">Chờ xác nhận</Option>
                      <Option value="complete">Hoàn thành</Option>
                      <Option value="cancel">Hủy</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={2}></Col>
                <Col span={10}>
                  <Form.Item label="Ghi chú" name="note"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: 'Vui lòng nhập ghi chú!',
                  //   },
                  // ]}
                  >
                    <TextArea rows={1} />
                  </Form.Item>
                </Col>
              </Row>


              <Col>
                <label><h2 style={{ marginTop: '10px', marginBottom: '30px', textAlign: 'center' }}>Kiểm kê</h2></label>

                <Form.List name="details" label="Bảng giá sản phẩm">
                  {(fields, { add, remove }) => (
                    <>
                      <Row>
                        <Col span={1}></Col>
                        <Col span={5} style={titleCol}>
                          <Typography.Text>Sản phẩm</Typography.Text>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={3} style={titleCol}>
                          <Typography.Text>Số lượng trên hệ thống</Typography.Text>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={3} style={titleCol}>
                          <Typography.Text>Đơn vị tính</Typography.Text>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={3} style={titleCol}>
                          <Typography.Text>Số lượng thực tế</Typography.Text>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={3} style={titleCol}>
                          <Typography.Text>Ghi chú</Typography.Text>
                        </Col>
                        <Col span={2}></Col>
                      </Row>
                      {fields.map(({ key, name, ...restField }) => (
                        <Row>
                          <Col span={1}></Col>
                          <Col span={5}>
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
                                textAlign: 'left',
                                width: '100%',
                              }}
                            >
                              <Select
                                showSearch
                                onChange={(option) => onProductSelect(option, key)}
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
                          <Col span={3}>
                            <Form.Item
                              {...restField}
                              name={[name, 'quantity_before']}
                              style={{
                                textAlign: 'left'
                              }}
                            >
                              <Input min='0' type='number' readOnly value={quantity} 
                                key={key} disabled={true} 
                                placeholder="Số lượng tồn" className='inputDisableText'/>
                            </Form.Item>
                          </Col>
                          <Col span={1}></Col>
                          <Col span={3}>
                            <Form.Item
                              {...restField}
                              name={[name, 'unit']}
                              style={{
                                textAlign: 'left'
                              }}
                            >
                              <Input type='text' value={unit} readOnly key={key} disabled={is_create ? false : true} placeholder="Đơn vị cơ bản" />
                            </Form.Item>
                          </Col>
                          <Col span={1}></Col>
                          <Col span={3}>
                            <Form.Item
                              {...restField}
                              name={[name, 'quantity_after']}
                              rules={[
                                {
                                  required: true,
                                  message: 'Vui lòng nhập số lượng!',
                                },
                              ]}
                              style={{
                                textAlign: 'left'
                              }}
                            >
                              <Input placeholder="Số lượng thực tế" min='0' type='number' disabled={is_create ? false : true} />
                            </Form.Item>

                          </Col>
                          <Col span={1}></Col>
                          <Col span={3}>
                            <Form.Item
                              {...restField}
                              name={[name, 'note']}
                              style={{
                                textAlign: 'left'
                              }}
                            >
                              <Input placeholder="Ghi chú" type='text' disabled={is_create ? false : true} />
                            </Form.Item>
                          </Col>
                          <Col span={1}>
                            <Popconfirm
                              placement="bottomRight"
                              title="Xác nhận xóa bảng giá này"
                              onConfirm={() => remove(name)}
                              okText="Đồng ý"
                              okType="danger"
                              cancelText="Hủy bỏ"
                              style={{ width: '10%' }}
                              disabled={is_create ? false : true}
                            >
                              <MinusCircleOutlined />
                            </Popconfirm>
                          </Col>
                          <Col span={1}></Col>
                        </Row>
                      ))}
                      <Form.Item style={{ width: '170px', margin: 'auto' }}>
                        <Button type="dashed" disabled={is_create ? false : true} onClick={() => add()} block icon={<PlusOutlined />} >
                          Thêm sản phẩm
                        </Button>
                      </Form.Item>
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

export default InventoryRecordChangeForm;