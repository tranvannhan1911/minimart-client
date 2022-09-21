import {
  PlusOutlined, EditOutlined, DeleteOutlined, HistoryOutlined, MinusCircleOutlined
} from '@ant-design/icons';
import { Button, Form, Input, Select, message, Space, Popconfirm, Switch, DatePicker, Col, Row, Table, Checkbox, Modal } from 'antd';
import { Typography } from 'antd';
import React, { useContext, useState, useEffect, useRef } from 'react';
import api from '../../../api/apis'
import ChangeForm from '../templates/changeform';
import { useNavigate, useParams } from 'react-router-dom'
import Loading from '../../basic/loading';
import paths from '../../../utils/paths'
import messages from '../../../utils/messages'
import { validName1 } from '../../../resources/regexp'
import moment from "moment";
const { RangePicker } = DatePicker;


const EditableContext = React.createContext(null);
const dateFormat = "YYYY/MM/DD";

const { Option } = Select;
const { TextArea } = Input;

const InventoryReceivingChangeForm = (props) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loadings, setLoadings] = useState([]);
  const [baseProductOptions, setBaseProductOptions] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [idxBtnSave, setIdxBtnSave] = useState([]);
  const [baseUnitOptions, setBaseUnitOptions] = useState([]);
  const [baseSupplierOptions, setBaseSupplierOptions] = useState([]);
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
      navigate(paths.inventory_receiving.list)
    } else if (idxBtnSave == 1) {
      if (is_create) {
        navigate(paths.inventory_receiving.change(response.data.data.id))
        setCreate(false)
      }
      refAutoFocus.current && refAutoFocus.current.focus()
    } else if (idxBtnSave == 2) {
      if (!is_create) {
        navigate(paths.inventory_receiving.add)
        setCreate(true)
      }
      form.resetFields()
      refAutoFocus.current && refAutoFocus.current.focus()
    }

  }

  const create = async (values) => {
    try {
      const response = await api.inventory_receiving.add(values);
      if (response.data.code == 1) {
        message.success(messages.inventory_receiving.SUCCESS_SAVE())
        directAfterSubmit(response)
        return true
      } else if (response.data.code == 0) {
        message.error("Lỗi")
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
      const response = await api.inventory_receiving.update(id, values)
      if (response.data.code == 1) {
        message.success(messages.inventory_receiving.SUCCESS_SAVE(id))
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
      const response = await api.inventory_receiving.delete(id)
      if (response.data.code == 1) {
        message.success(messages.inventory_receiving.SUCCESS_DELETE(id))
        navigate(paths.inventory_receiving.list)
        return true
      } else {
        message.error(messages.inventory_receiving.ERROR_DELETE(id))
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
    
    let index={
      "details": [
      ],
      "status": values.status,
      "note": values.note,
      "total": 0,
      "supplier": values.supplier
    }
    let details=[];
    values.details.forEach(async element => {
        const response = await api.product.get(element.product);
        response.data.data.units.forEach(elementt => {
          if(element.unit_exchange == elementt.id){
            let detail={
              "quantity": elementt.value*element.quantity,
              "price": element.price,
              "note": element.note,
              "product": element.product
            }
            
            details.push(detail);
          }
        });
      }); 
      index.details=details;
      console.log(index,1);
    if (is_create) {

      await create(index)
    } else {
      // console.log(values.start_date._i)
      // values.start_date = values.start_date._i;
      // values.end_date = values.end_date._i;
      // values.pricedetails=dataIndex.pricedetails;
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
      const response = await api.inventory_receiving.get(id);
      const values = response.data.data;
      values.supplier = values.supplier.name;
      values.details = values.details.map(elm => {
        elm.product = elm.product.id;
        // elm.unit_exchange = elm.unit_exchange.unit_name;
        return elm;

      })

      form.setFieldsValue(values)

    } catch (error) {
      message.error(messages.ERROR+"hhhh")
    } finally {
      setLoadingData(false)
    }
  }

  const handleDataBaseSupplier = async () => {
    setLoadingData(true)
    try {
      const response = await api.supplier.list();
      const options = response.data.data.results.map(elm => {
        return (
          <Option key={elm.id} value={elm.id}>{elm.name}</Option>
        )
      })
      setBaseSupplierOptions(options)
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
  const handleDataBaseUnit = async (unit_exchange) => {
    setLoadingData(true)
    try {
      // await unit_exchange.forEach(gr => dataBaseUnit(gr));
      // // console.log(unit,11111);
      //  const options = unit.map(elm => {
      //   return (
      //     <Option key={elm.unit_exchange} value={elm.unit_exchange}>{elm.nameUnit}</Option>
      //   )
      // })
      const options = unit_exchange.map(elm => {
        return (
          <Option key={elm.id} value={elm.id}>{elm.unit_name}</Option>
        )
      })
      // console.log(unit);
      setBaseUnitOptions(options);
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
        handleDataBaseSupplier()
      }
      setLoadingData(false)
    }
    handleDataBaseProduct();
    handleDataBaseSupplier()
  }, [])

  useEffect(() => {
    props.setBreadcrumb([
      { title: "Phiếu nhập hàng", href: paths.inventory_receiving.list },
      { title: is_create ? "Thêm mới" : "Chỉnh sửa" }])

    if (is_create == false) {
      props.setBreadcrumbExtras([
        <Popconfirm
          placement="bottomRight"
          title="Xác nhận xóa phiếu nhập hàng này"
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
            <><>
              <Form.Item label="Tên bảng giá" name="total" style={{ display: 'none' }}
              >
                <Input value={0} />
              </Form.Item>

              <Form.Item label="Ngày nhập" name="start_date" required
                style={{
                  textAlign: "left",
                  // width:'500px',
                  marginLeft: '0px',
                  // display:'inline-grid'
                }}
              // rules={[
              //   {
              //     required: true,
              //     message: 'Vui lòng chọn ngày nhập!',
              //   },
              // ]}
              >
                <DatePicker format={dateFormat} disabled={is_create ? false : true} style={{ width: '200px' }} />
              </Form.Item>

              <Form.Item
                label="Nhà cung cấp" name="supplier" required
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng chọn nhà cung cấp!',
                  },
                ]}
                style={{
                  textAlign: 'left'
                }}
              >
                <Select
                  showSearch
                  // onChange={(option) => onUnitSelect(option)}
                  style={{
                    width: 200,
                  }}
                  placeholder="Nhà cung cấp"
                  optionFilterProp="children"
                  filterOption={(input, option) => option.children.includes(input)}
                  filterSort={(optionA, optionB) =>
                    optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                  }
                >
                  {baseSupplierOptions}
                </Select>
              </Form.Item>
              <Form.Item label="Trạng thái" name="status"
                style={{
                  textAlign: 'left'
                }}>
                <Select
                  defaultValue="pending"
                  style={{
                    width: 200,
                  }}
                >
                  <Option value="pending">Chờ xác nhận</Option>
                  <Option value="complete">Hoàn thành</Option>
                  <Option value="cancel">Hủy</Option>
                </Select>
              </Form.Item>
            </>
              <Col>
                <label><h2 style={{ marginTop: '10px', marginBottom: '30px', textAlign: 'center' }}>Sản phẩm nhập</h2></label>
                {/* <Button type="primary" onClick={showModal}>
                  Thêm giá sản phẩm
                </Button>
                <Table
                  columns={columns}
                  dataSource={priceList}
                >

                </Table> */}
                <Form.List name="details" label="Sản phẩm nhập">
                  {(fields, { add, remove }) => (
                    <>

                      {fields.map(({ key, name, ...restField }) => (
                        <Space
                          key={key}
                          style={{
                            display: 'flex',
                            marginBottom: 0,
                          }}
                          align="baseline"
                        >
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
                              style={{
                                width: 200,
                              }}
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
                          <Form.Item
                            {...restField}
                            name={[name, 'unit_exchange']}
                            // rules={[
                            //   {
                            //     required: true,
                            //     message: 'Vui lòng chọn đơn vị tính!',
                            //   },
                            // ]}
                            style={{
                              textAlign: 'left'
                            }}
                          >
                            <Select
                              showSearch
                              style={{
                                width: 200,
                              }}
                              placeholder="Đơn vị tính"
                              optionFilterProp="children"
                              filterOption={(input, option) => option.children.includes(input)}
                              filterSort={(optionA, optionB) =>
                                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                              }
                              disabled={is_create ? false : true}
                            >
                              {baseUnitOptions}
                            </Select>
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, 'quantity']}
                            rules={[
                              {
                                required: true,
                                message: 'Vui lòng nhập số lượng!',
                              },
                            ]}
                          >
                            <Input placeholder="Số lượng" type='number' disabled={is_create ? false : true} />
                          </Form.Item>

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
                            <Input placeholder="Giá" type='number' disabled={is_create ? false : true} />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, 'note']}
                            rules={[
                              {
                                required: true,
                                message: 'Vui lòng nhập ghi chú!',
                              },
                            ]}
                          >
                            <Input placeholder="Ghi chú" disabled={is_create ? false : true} />
                          </Form.Item>


                          <Popconfirm
                            placement="bottomRight"
                            title="Xác nhận xóa sản phẩm này"
                            onConfirm={() => remove(name)}
                            okText="Đồng ý"
                            okType="danger"
                            cancelText="Hủy bỏ"
                            disabled={is_create ? false : true}
                          >
                            <MinusCircleOutlined />
                          </Popconfirm>
                        </Space>
                      ))}
                      <Form.Item style={{ width: '170px' }}>
                        <Button type="dashed" disabled={is_create ? false : true} onClick={() => add()} block icon={<PlusOutlined />} >
                          Thêm giá sản phẩm
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Col>
              <Form.Item label="Ghi chú" name="note"
              // rules={[
              //   {
              //     required: true,
              //     message: 'Vui lòng nhập ghi chú!',
              //   },
              // ]}
              >
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
              </Form.Item></>

          }>

        </ChangeForm>
      }


    </>
  )

}

export default InventoryReceivingChangeForm;