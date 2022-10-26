import {
  PlusOutlined, EditOutlined, DeleteOutlined, HistoryOutlined, MinusCircleOutlined, UploadOutlined
} from '@ant-design/icons';
import {
  Button, Form, Input, Select, message, Space, Popconfirm,
  DatePicker, Col, Row, notification, Typography, Upload, InputNumber
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
import * as XLSX from 'xlsx';
import { validNumber } from '../../../resources/regexp';
import ProductSelect from '../barcode/input';
import Item from 'antd/lib/list/Item';
import ExcelJS from "exceljs";
import saveAs from "file-saver";


const dateFormat = "YYYY/MM/DD";

const { Option } = Select;

const titleCol = {
  fontWeight: 500,
  textAlign: 'left',
  marginLeft: '3px'
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
  const [dataProduct, setDataProduct] = useState([]); // create
  const [dataUnit, setDataUnit] = useState([]); // create
  let { id } = useParams();
  const [is_create, setCreate] = useState(null); // create
  const [priceDetails, setPriceDetails] = useState([]);
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
        let dataFormDetails = form.getFieldValue("pricedetails");
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
          let kqUnit = false;
          if (!validNumber.test(element.gia)) {
            loi = "Giá phải là số, "
          }
          dataUnit.forEach(ell => {
            if (ell.code.toLowerCase() == element.maDonVi.toLowerCase()) {
              kqUnit = true;
            }
          });
          if (kqUnit == false) {
            loi += "Mã đơn vị tính không chính xác, ";
          }
          dataProduct.forEach(elementt => {
            if (elementt.product_code.toLowerCase() == element.maSP.toLowerCase() || elementt.barcode == element.maSP) {
              let unit = "";
              if (kqUnit == true) {
                elementt.units.forEach(elm => {
                  if (elm.unit_code.toLowerCase() == element.maDonVi.toLowerCase()) {
                    unit = elm.id;
                  }
                });
              }
              if (unit == "" && kqUnit == true) {
                notification.open({
                  message: 'Lỗi tải dữ liệu',
                  description:
                    "Không tìm thấy đơn vị tính " + element.maDonVi + " của mã sản phẩm " + element.maSP + " để thêm dữ liệu !!",
                  // duration: 50,
                });
                loi += "Sản phẩm không có mã đơn vị này, ";
                result = true;
              }
              if (validNumber.test(element.gia) && kqUnit == true && unit != "") {
                let re = false;

                let indexx = {
                  // "key": elementt.id,
                  "price": element.gia,
                  "product": elementt.id,
                  "unit_exchange": unit
                };
                dataerrorr.push({
                  "maSP": element.maSP,
                  "maDonVi": element.maDonVi,
                  "gia": element.gia,
                  "loi": ""
                });
                handleDataBaseUnit(elementt.units)
                datadetail.push(indexx);
                result = true;
                resultTotal++;
                re = true;
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
            loi += "Mã sản phẩm không chính xác, ";
          }
          if (loi != "") {
            dataerrorr.push({
              "maSP": element.maSP,
              "maDonVi": element.maDonVi,
              "gia": element.gia,
              "loi": loi
            });
          }
          if (index == jsonData.length - 1) {
            if (resultTotal == jsonData.length) {
              message.success("Xong quá trình thêm dữ liệu");
              form.setFieldValue("pricedetails", datadetail)
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

    worksheet.addRow(["maSP", "maDonVi", "gia", "loi"]);
    let i = 2;
    data.forEach(element => {
      if (element.loi == "") {
        worksheet.addRow([element.maSP, element.maDonVi, element.gia, element.loi]);
        i++;
      } else {
        worksheet.addRow([element.maSP, element.maDonVi, element.gia, element.loi]);
        worksheet.getRow(i).font = { color: { argb: 'ffff0000' } };
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
          ...elm.product,
          _product: elm.product,
          key: elm.product.id,
          product: elm.product.id,
          product_name: elm.product.name,
          unit_exchange: elm.unit_exchange.id,
          unit_exchange_name: elm.unit_exchange.unit_name,
          unit_exchange_value: elm.unit_exchange.value,
          unit_exchange_value_str: `${elm.unit_exchange.value} ${elm.product.base_unit.name}`,
          disable_unit: true,
          price: elm.price,
          note: elm.note,
        }
        return i;
      });
      values.start_date = moment(values.start_date)
      values.status = values.status.toString()
      values.end_date = moment(values.end_date)
      values.pricedetails = details
      // setPriceDetails(details);
      // values.pricedetails = values.pricedetails.map(elm => {
      //   elm.product = elm.product.id;
      //   if (elm.unit_exchange == null) {
      //     elm.unit_exchange = null;
      //   } else {
      //     elm.unit_exchange = elm.unit_exchange.unit_name;
      //   }
      //   return elm;
      // });

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

  const handleDataUnit = async () => {
    setLoadingData(true)
    try {
      const response = await api.unit.list();
      setDataUnit(response.data.data.results);
    } catch (error) {
      message.error(messages.ERROR)
    } finally {
      setLoadingData(false)
    }
  }

  const handleDataBaseUnit = async (unit_exchange, disable_base_unit) => {
    setLoadingData(true)
    try {
      const options = []
      for (var i = 0; i < unit_exchange.length; i++) {
        const elm = unit_exchange[i]
        elm.unit_exchange_value = elm.value
        delete elm.value
        // console.log("handleDataBaseUnit", elm, disable_base_unit && elm.is_base_unit)
        if (disable_base_unit && elm.is_base_unit) {
          continue;
        }
        options.push(
          <Option key={elm.id} value={elm.id} {...elm}>{elm.unit_name}</Option>
        )
      }
      setBaseUnitOptions([...baseUnitOptions, options]);
    } catch (error) {
      message.error(messages.ERROR)
    } finally {
      setLoadingData(false)
    }
  }

  useEffect(() => {
    if (is_create == null) {
      setCreate(props.is_create)
      if (!props.is_create) {
        handleData()
        handleDataBaseProduct();
        handleDataUnit()
      }
      setLoadingData(false)
    }
    handleDataBaseProduct();
    handleDataUnit()
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
        >Thoát</Button>,

      ])
    }
  }, [is_create])

  useEffect(() => {
    setTimeout(() => refAutoFocus.current && refAutoFocus.current.focus(), 500)
  }, [refAutoFocus])


  const onSelectProduct = async (product_id, add) => {
    const response = await api.product.get(product_id)
    console.log("onSelectProduct", response.data)
    if (response.data.code == 1) {
      // console.log(response.data.data)
      const product = response.data.data
      var base_unit_exchange;
      product.units.forEach(elm => {
        if (elm.unit == product.base_unit.id) {
          base_unit_exchange = elm
        }
      })

      if (!checkUnitAvail(base_unit_exchange.id, product.id)) {
        message.error("Sản phẩm và đã tồn tại!")
        return
      }
      for (var i = 0; i < product.units.length; i++) {
        const value = {
          ...product,
          _product: product,
          key: product.id,
          product: product.id,
          product_name: product.name,
          unit_exchange: product.units[i].id,
          unit_exchange_value: product.units[i].value,
          unit_exchange_value_str: `${product.units[i].value} ${base_unit_exchange.unit_name}`,
          unit_exchange_name: product.units[i].unit_name,
          disable_unit: true,
          price: 0,
        }
        if (product.units[i].id == base_unit_exchange.id) {
          value.is_base_unit = true
        }
        add(value)

      }
    } else {
      message.error(messages.ERROR_REFRESH)
    }
  }

  const checkUnitAvail = (unit_exchange, product_id) => {
    var pricedetails = form.getFieldValue("pricedetails")
    if (!pricedetails)
      return true

    for (var i = 0; i < pricedetails.length; i++) {
      console.log("checkUnitAvail", pricedetails[i], unit_exchange)
      if (pricedetails[i].id == product_id && pricedetails[i].unit_exchange == unit_exchange) {
        return false
      }
    }
    return true
  }

  const getUnitAvail = (product) => {
    for (var i = 0; i < product.units.length; i++) {
      // console.log("getUnitAvail", currentRecord.units[i])
      const unit_ex = product.units[i]
      // console.log("getUnitAvail", unit_ex, checkUnitAvail(unit_ex.id, currentRecord.id))
      if (checkUnitAvail(unit_ex.id, product.id))
        return unit_ex
    }
    return null
  }

  const onUnitSelect = async (value, name) => {
    try {
      const pricedetails = form.getFieldValue("pricedetails")
      const currentRecord = pricedetails[name]
      for (var i = 0; i < pricedetails.length; i++) {
        console.log("onUnitSelect", pricedetails[i], value)
        if (i != name && pricedetails[i].id == currentRecord.id) {
          if (pricedetails[i].unit_exchange == value) {
            message.error("Đã tồn tại sản phẩm với đơn vị tính này")
            return
          }
        }
      }
    } catch (error) {
      message.error(messages.ERROR)
    } finally {
    }
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
                <div><h2 style={{ marginTop: '10px', marginBottom: '10px', textAlign: 'center', display: 'inline-block' }}>Bảng giá sản phẩm</h2>
                  {/* {is_create ?
                    <><span style={{
                      position: 'absolute',
                      right: '0',
                      float: 'right',
                      marginTop: '10px',
                      marginRight: '45px'
                    }}>

                    </span></>
                    : null} */}
                </div>

                <Form.List name="pricedetails" label="Bảng giá sản phẩm">
                  {(fields, { add, remove }) => (
                    <>
                      {is_create ?
                        <><ProductSelect
                          style={{
                            marginBottom: '20px'
                          }}
                          placeholder="Thêm sản phẩm vào bảng giá"
                          onSelectProduct={(value) => onSelectProduct(value, add)} /><Upload showUploadList={false} {...uploadData} style={{}}>
                            <Button icon={<UploadOutlined />}>Nhập Excel</Button>
                          </Upload></>
                        : null}

                      <Row style={{
                        marginBottom: '10px'
                      }}>
                        <Col span={1}></Col>
                        <Col span={2} style={titleCol}>
                          <Typography.Text>Mã SP</Typography.Text>
                        </Col>
                        <Col span={5} style={titleCol}>
                          <Typography.Text>Sản phẩm</Typography.Text>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={4} style={titleCol}>
                          <Typography.Text>Đơn vị tính</Typography.Text>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={4} style={titleCol}>
                          <Typography.Text>Giá trị quy đổi (ĐVT Cơ bản)</Typography.Text>
                        </Col>
                        <Col span={4} style={titleCol}>
                          <Typography.Text>Giá bán</Typography.Text>
                        </Col>
                        <Col span={2}></Col>
                      </Row>
                      <div style={{
                        maxHeight: '350px',
                        overflow: 'auto'
                      }}>
                        {fields.map(({ key, name, ...restField }) => (
                          <>
                            <Row style={{
                              borderTop: `${form.getFieldValue("pricedetails")[name].is_base_unit ? '1px solid #eee' : '0px'}`,
                              paddingTop: `${form.getFieldValue("pricedetails")[name].is_base_unit ? '10px' : '0px'}`,
                            }}>
                              <Col span={1}></Col>
                              <Col span={2}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'product_code']}
                                >
                                  <Input
                                    disabled={true}
                                    className='inputDisableText' />
                                </Form.Item>
                              </Col>
                              <Col span={5}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'product_name']}
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
                                  <Input
                                    disabled={true}
                                    className='inputDisableText' />
                                </Form.Item>
                              </Col>
                              <Col span={1}></Col>
                              <Col span={4}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'unit_exchange_name']}
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
                                  <Input
                                    disabled={true}
                                    className='inputDisableText' />
                                </Form.Item>
                              </Col>
                              <Col span={1}></Col>
                              <Col span={4}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'unit_exchange_value_str']}
                                  style={{
                                    textAlign: 'left'
                                  }}
                                >
                                  <Input
                                    disabled={true}
                                    className='inputDisableText' />
                                </Form.Item>
                              </Col>
                              <Col span={4}>
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
                                  <InputNumber
                                    placeholder="Giá"
                                    style={{ width: 150 }} min='0'
                                    disabled={is_create ? false : true}
                                    className={is_create ? "" : "inputDisableText"}
                                    step={100}
                                    onChange={(value) => {
                                      if (form.getFieldValue("pricedetails")[name].is_base_unit) {
                                        const _pricedetails = form.getFieldValue("pricedetails")
                                        const product_id = _pricedetails[name]._product.id
                                        for (var i = _pricedetails.length - 1; i >= 0; i--) {
                                          console.log(_pricedetails[i])
                                          if (_pricedetails[i]._product.id == product_id) {
                                            // remove(i);
                                            _pricedetails[i].price = value * _pricedetails[i].unit_exchange_value
                                          }
                                        }
                                        form.setFieldValue("pricedetails", _pricedetails)
                                      }
                                    }} />
                                </Form.Item>
                              </Col>
                              <Col span={1}>
                                {
                                  form.getFieldValue("pricedetails")[name].is_base_unit ?
                                    <Popconfirm
                                      placement="bottomRight"
                                      title="Xác nhận xóa bảng giá này"
                                      onConfirm={() => {
                                        const _pricedetails = form.getFieldValue("pricedetails")
                                        const product_id = _pricedetails[name]._product.id
                                        for (var i = _pricedetails.length - 1; i >= 0; i--) {
                                          if (_pricedetails[i]._product.id == product_id) {
                                            remove(i);
                                          }
                                        }
                                      }}
                                      okText="Đồng ý"
                                      okType="danger"
                                      cancelText="Hủy bỏ"
                                      disabled={is_create ? false : true}
                                    >
                                      <MinusCircleOutlined />
                                    </Popconfirm>
                                    :
                                    null
                                }

                              </Col>
                              <Col span={1}></Col>
                            </Row></>
                        ))}
                      </div>
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