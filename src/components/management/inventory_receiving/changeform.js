import {
  PlusOutlined, EditOutlined, MinusCircleOutlined, HistoryOutlined, UploadOutlined
} from '@ant-design/icons';
import {
  Button, Form, Input, Select, message, Space, Popconfirm,
  Col, Row, Typography, InputNumber, Upload, notification
} from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import api from '../../../api/apis'
import ChangeForm from '../templates/changeform';
import { useNavigate, useParams } from 'react-router-dom'
import Loading from '../../basic/loading';
import paths from '../../../utils/paths'
import messages from '../../../utils/messages'
import ProductSelect from '../barcode/input';
import * as XLSX from 'xlsx';
import { validNumber } from '../../../resources/regexp';
import ExcelJS from "exceljs";
import saveAs from "file-saver";

const { Option } = Select;
const { TextArea } = Input;

const titleCol = {
  fontWeight: 500
}

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
  const [detailss, setDetailss] = useState([]); // create
  const [dataProduct, setDataProduct] = useState([]); // create
  let { id } = useParams();
  const [is_create, setCreate] = useState(null); // create
  const [is_status, setStatus] = useState(null);
  const refAutoFocus = useRef(null)

  const uploadData = {
    async beforeUpload(file) {
      // console.log(file.name)
      var typeFile = file.name.split('.').pop().toLowerCase();
      if (typeFile == "xlsx" || typeFile == "csv") {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        let datadetail = [];
        let dataFormDetails = form.getFieldValue("details");
        if (dataFormDetails != null) {
          dataFormDetails.forEach(elmm => {
            datadetail.push(elmm);
          });
        }
        let resultTotal = 0;
        let dataerrorr = [];
        for (let index = 0; index < jsonData.length; index++) {
          let result = false;
          const element = jsonData[index];
          let loi = "";
          if ((!validNumber.test(element.soluong)) || (!validNumber.test(element.gia))) {
            loi = "Số lượng và giá phải là số,  ";
          }
          dataProduct.forEach(elementt => {
            if (elementt.product_code.toLowerCase() == element.maSP.toLowerCase() || elementt.barcode == element.maSP) {
              if (validNumber.test(element.soluong) && validNumber.test(element.gia)) {
                let unit = "";
                let unitname = "";
                elementt.units.forEach(elm => {
                  if (elm.is_base_unit == true) {
                    unit = elm.id;
                    unitname = elm.unit_name;
                  }
                })
                let indexx = {
                  "key": elementt.id,
                  "quantity": element.soluong,
                  "quantity_base_unit": element.soluong + " " + unitname,
                  "price": element.gia,
                  "note": element.ghichu,
                  "product": elementt.name,
                  "unit_exchange": unit,
                  "product_obj": elementt
                };
                dataerrorr.push({
                  "maSP": element.maSP,
                  "soluong": element.soluong,
                  "gia": element.gia,
                  "ghichu": element.ghichu,
                  "loi": ""
                });
                handleDataBaseUnit(elementt.units)
                datadetail.push(indexx);
                result = true;
                resultTotal++;
              } else {
                result = true;
              }
            }
          });
          if (result == false) {
            notification.open({
              message: 'Lỗi tải dữ liệu',
              description:
                'Không tìm thấy mã sản phẩm ' + element.maSP + " để thêm dữ liệu !!",
              // duration: 50,
            });

            loi = loi + "Mã sản phẩm không chính xác, ";
          }
          if (loi != '') {
            dataerrorr.push({
              "maSP": element.maSP,
              "soluong": element.soluong,
              "gia": element.gia,
              "ghichu": element.ghichu,
              "loi": loi
            });
          }
          if (index == jsonData.length - 1) {
            if (resultTotal == jsonData.length) {
              message.success("Xong quá trình thêm dữ liệu");
              form.setFieldValue("details", datadetail)
            } else {
              message.error("Dữ liệu lỗi!!");
              setTimeout(() => {
                exportDataError(dataerrorr);
              }, 500);
            }
          }
        }
      } else {
        message.error("Chỉ nhập dữ liệu bằng file .csv, .xlsx");
        return;
      }

    }
  };

  const exportDataError = (data) => {
    var ExcelJSWorkbook = new ExcelJS.Workbook();
    var worksheet = ExcelJSWorkbook.addWorksheet("Data");

    worksheet.addRow(["maSP", "soluong", "gia", "ghichu", "loi", "(Số lượng theo đơn vị cơ bản)"]);
    let i = 2;
    data.forEach(element => {
      if (element.loi == "") {
        worksheet.addRow([element.maSP, element.soluong, element.gia, element.ghichu, element.loi]);
        i++;
      } else {
        worksheet.addRow([element.maSP, element.soluong, element.gia, element.ghichu, element.loi]);
        worksheet.getRow(i).font = { color: {argb:'ffff0000'} };
        i++;
      }
    });

    ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
      saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        `DataError.xlsx`
      );
    });
  };

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
    values.details.map(item => {
      item.product = item.key
      item.quantity_base_unit = 0
      return item
    })
    console.log(values)

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
    values.details.map(item => {
      item.product = item.product_obj.id
      item.unit_exchange = item.unit_exchange_obj.id
      item.quantity_base_unit = 0
      return item
    })
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
    // console.log("values1", values)
    if (values.status == null) {
      values.status = "pending";
    }
    if (values.details == null) {
      message.error("Không thể tạo phiếu nhập hàng trống!")
      setDisableSubmit(false)
      stopLoading(idxBtnSave)
      return;
    }
    if (is_create) {

      await create(values)
    } else {
      // if (is_status == "complete") {
      //   if (values.status == "pending" || values.status == "cancel") {
      //     message.error("Phiếu nhập hàng này đã hoàn thành không thể sửa trạng thái!")
      //     stopLoading(idxBtnSave)
      //     setDisableSubmit(false)
      //     return;
      //   }
      // }
      // values.details = detailss;
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
      // setStatus(values.status);
      // let details = values.details.map(elm => {
      //   let i = {
      //     "product": elm.product.id,
      //     "unit_exchange": elm.unit_exchange.id,
      //     "quantity": elm.quantity,
      //     "quantity_base_unit": elm.quantity_base_unit,
      //     "price": elm.price,
      //     "note": elm.note,
      //   }
      //   return i;
      // });
      // setDetailss(details);
      values.supplier = values.supplier.id;

      values.details = values.details.map(elm => {
        // elm.unit_exchange = elm.unit_exchange.unit_name;
        // elm.product = elm.product.id;
        // return elm;
        elm.quantity_base_unit = String(elm.quantity_base_unit) + " " + elm.product.base_unit.name;
        elm.unit_exchange_obj = elm.unit_exchange
        elm.unit_exchange = elm.unit_exchange.unit_name
        elm.product_obj = elm.product
        elm.product = elm.product.name
        return elm

      })

      form.setFieldsValue(values)

    } catch (error) {
      message.error(messages.ERROR)
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
      setDataProduct(response.data.data.results);
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

      const options = unit_exchange.map(elm => {
        elm.unit_exchange_value = elm.value
        delete elm.value
        return (
          <Option key={elm.id} value={elm.id} {...elm}>{elm.unit_name}</Option>
        )
      })
      // console.log(unit);
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
        // <Popconfirm
        //   placement="bottomRight"
        //   title="Xác nhận xóa phiếu nhập hàng này"
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
        <Button type="info" icon={<HistoryOutlined />} onClick={() => { navigate(paths.inventory_receiving.list) }}
        >Thoát</Button>
      ])
    } else {
      props.setBreadcrumbExtras([
        <Button type="info" icon={<HistoryOutlined />} onClick={() => { navigate(paths.inventory_receiving.list) }}
        >Thoát</Button>
      ])
    }
  }, [is_create])

  useEffect(() => {
    setTimeout(() => refAutoFocus.current && refAutoFocus.current.focus(), 500)
  }, [refAutoFocus])

  const onSelectProduct = async (product_id, add) => {
    console.log("onSelectProduct", product_id)
    const response = await api.product.get(product_id)
    if (response.data.code == 1) {
      console.log(response.data.data)
      const product = response.data.data

      var base_unit_exchange;
      var unit_exchange_value;
      response.data.data.units.forEach(element => {
        if (element.is_base_unit == true) {
          base_unit_exchange = element.id;
          unit_exchange_value = element.value;
        }
      });

      const value = {
        ...product,
        key: product.id,
        product: product.name,
        quantity_base_unit: 1,
        quantity: 1,
        unit_exchange: base_unit_exchange,
        unit_exchange_value: unit_exchange_value
      }
      add(value)
      handleDataBaseUnit(response.data.data.units)
    } else {
      message.error(messages.ERROR_REFRESH)
    }
  }

  const calQuantityBaseUnit = (key, name) => {
    const _details = form.getFieldValue("details")
    console.log(_details)

    baseUnitOptions[name].forEach(option => {
      console.log(option)
      if (option.props.id == _details[name].unit_exchange) {
        _details[name].unit_exchange_value = option.props.unit_exchange_value
      }
    })
    _details[name].quantity_base_unit = "" + String(_details[name].quantity * _details[name].unit_exchange_value) + " " + _details[name].base_unit.name
    form.setFieldValue("details", _details)
  }

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
              <Row>
                <Col span={1}></Col>
                <Col span={10}>
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
                        width: '100%',
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
                </Col>
                <Col span={2}></Col>
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
                      <Option value="pending">Chờ giao hàng</Option>
                      <Option value="complete">Hoàn thành</Option>
                      <Option value="cancel">Hủy</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              {/* <Form.Item label="Ngày nhập" name="date_created" required
                style={{
                  textAlign: "left",
                  // width:'500px',
                  marginLeft: '0px',
                  // display:'inline-grid'
                }}
              >
                <Input size="large" placeholder="Ngày nhập" prefix={<CalendarOutlined />} readOnly value={props.data} style={{ width: '200px' }} />
              </Form.Item> */}

              <Row>
                <Col span={1}></Col>
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
                <Col span={2}></Col>
                <Col span={10}>

                </Col>
              </Row>


            </>
              <Col>
                <label><h2 style={{ marginTop: '10px', marginBottom: '30px', textAlign: 'center' }}>Sản phẩm nhập</h2>

                </label>

                <Form.List name="details" label="Sản phẩm nhập">
                  {(fields, { add, remove }) => (
                    <>
                      {is_create ? <><ProductSelect
                        style={{
                          marginBottom: '20px'
                        }}
                        placeholder="Thêm sản phẩm vào phiếu nhập hàng"
                        onSelectProduct={(value) => onSelectProduct(value, add)} /><Upload showUploadList={false} {...uploadData} style={{}}>
                          <Button icon={<UploadOutlined />}>Nhập Excel</Button>
                        </Upload></> : null}
                      <Row style={{ marginBottom: '20px' }}>
                        <Col span={1}></Col>
                        <Col span={5} style={titleCol}>
                          <Typography.Text>Sản phẩm</Typography.Text>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={3} style={titleCol}>
                          <Typography.Text>Đơn vị tính</Typography.Text>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={2} style={titleCol}>
                          <Typography.Text>Số lượng</Typography.Text>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={2} style={titleCol}>
                          <Typography.Text>Số lượng đơn vị cơ bản</Typography.Text>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={2} style={titleCol}>
                          <Typography.Text>Giá nhập</Typography.Text>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={3} style={titleCol}>
                          <Typography.Text>Ghi chú</Typography.Text>
                        </Col>
                        <Col span={2}></Col>
                      </Row>
                      <div style={{
                        maxHeight: '350px',
                        overflow: 'auto'
                      }}>
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
                                  textAlign: 'left'
                                }}
                              >
                                {/* <Select
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
                              </Select> */}
                                <Input
                                  disabled={true}
                                  className='inputDisableText' />
                              </Form.Item>
                            </Col>
                            <Col span={1}></Col>
                            <Col span={3}>
                              <Form.Item
                                {...restField}
                                name={[name, 'unit_exchange']}
                                rules={[
                                  {
                                    required: true,
                                    message: 'Vui lòng chọn đơn vị tính!',
                                  },
                                ]}
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
                                  onChange={() => calQuantityBaseUnit(key, name)}
                                >
                                  {baseUnitOptions[name]}
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col span={1}></Col>
                            <Col span={2}>

                              <Form.Item
                                {...restField}
                                name={[name, 'quantity']}
                                rules={[
                                  {
                                    required: true,
                                    message: 'Vui lòng nhập số lượng!',
                                  },
                                  {
                                    type: 'number',
                                    min: 1,
                                    message: 'Số lượng tối thiểu là 1',
                                  },
                                ]}
                              >
                                {/* <Input placeholder="Số lượng" type='number' min='0' disabled={is_create ? false : true} /> */}
                                <InputNumber
                                  placeholder="Số lượng" type='number'
                                  min='1' disabled={is_create ? false : true}
                                  onChange={() => calQuantityBaseUnit(key, name)} />
                              </Form.Item>
                            </Col>
                            <Col span={1}></Col>
                            <Col span={2}>

                              <Form.Item
                                {...restField}
                                name={[name, 'quantity_base_unit']}
                              >
                                <Input placeholder="Số lượng đơn vị tính cơ bản" disabled className='inputDisableText' />
                              </Form.Item>
                            </Col>
                            <Col span={1}></Col>
                            <Col span={2}>

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
                                <Input placeholder="Giá" type='number' min='0' disabled={is_create ? false : true} />
                              </Form.Item>
                            </Col>
                            <Col span={1}></Col>
                            <Col span={3}>

                              <Form.Item
                                {...restField}
                                name={[name, 'note']}
                              // rules={[
                              //   {
                              //     required: true,
                              //     message: 'Vui lòng nhập ghi chú!',
                              //   },
                              // ]}
                              >
                                <Input placeholder="Ghi chú" disabled={is_create ? false : true} />
                              </Form.Item>
                            </Col>
                            <Col span={1}>
                              <Popconfirm
                                placement="bottomRight"
                                title="Xác nhận xóa sản phẩm này"
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
                      </div>
                      {/* <Form.Item style={{ width: '180px', margin: 'auto' }}>
                        <Button type="dashed" disabled={is_create ? false : true} onClick={() => add()} block icon={<PlusOutlined />} >
                          Thêm sản phẩm nhập
                        </Button>
                      </Form.Item> */}
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

export default InventoryReceivingChangeForm;