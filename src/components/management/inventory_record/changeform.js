import {
  PlusOutlined, EditOutlined, CheckCircleOutlined,
  MinusCircleOutlined, HistoryOutlined, UploadOutlined
} from '@ant-design/icons';
import {
  Button, Form, Input, Select, message, Space, Popconfirm,
  Col, Row, Typography, Upload, notification, Switch
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
import { ExportTemplateReactCSV } from '../../../utils/exportTemplate';
import ShowForPermission from '../../basic/permission';
import store, { setInfoCreateUpdate } from '../../../store/store';

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
  const [dataProduct, setDataProduct] = useState([]); // create
  let { id } = useParams();
  const [is_create, setCreate] = useState(null); // create
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [is_status, setStatus] = useState(null);
  const refAutoFocus = useRef(null)
  const listPrice = [];
  const [unit, setUnit] = useState("")
  const [quantity, setQuantity] = useState("")
  const [checked, setChecked] = useState(false);
  const [dataPrimary, setDataPrimary] = useState({});

  useEffect(() => {
    document.title = "Phiếu kiểm kê - Quản lý siêu thị mini NT"
  }, [])

  const saveComplete = () => {
    if (is_status == "pending") {
      form.setFieldValue("status", "complete");
      setStatus("complete");
      onFinish(form.getFieldsValue());
    } else {
      message.warning("Phiếu nhập hàng này đã hoàn thành");
    }
  };

  const uploadData = {
    async beforeUpload(file) {
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
          if (!validNumber.test(element.soluong)) {
            loi = "Số lượng phải là số, ";
          }
          dataProduct.forEach(elementt => {
            if (elementt.product_code.toLowerCase() == element.maSP.toLowerCase() || elementt.barcode == element.maSP) {
              if (validNumber.test(element.soluong)) {
                let indexx = {
                  key: elementt.id,
                  product: elementt.name,
                  unit: elementt.base_unit.name,
                  quantity_before_int: elementt.stock,
                  quantity_before: `${elementt.stock} ${elementt.base_unit.name}`,
                  quantity_after: element.soluong,
                  diff: element.soluong - elementt.stock + ` ${elementt.base_unit.name}`,

                };
                dataerrorr.push({
                  "maSP": element.maSP,
                  "soluong": element.soluong,
                  "ghichu": element.ghichu,
                  "loi": ""
                });
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
              // duration: 0,
            });
            loi += "Mã sản phẩm không chính xác, ";

          }
          if (loi != "") {
            dataerrorr.push({
              "maSP": element.maSP,
              "soluong": element.soluong,
              "ghichu": element.ghichu,
              "loi": loi
            });
          }
          if (index == jsonData.length - 1) {
            if (resultTotal == jsonData.length) {
              // message.success("Xong quá trình thêm dữ liệu");
              form.setFieldValue("details", datadetail)
              ///
              onFinish(form.getFieldsValue());
              ///
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

    worksheet.addRow(["maSP", "soluong", "ghichu", "loi", "", "", "", "(Số lượng theo đơn vị cơ bản)"]);
    let i = 2;
    data.forEach(element => {
      if (element.loi == "") {
        worksheet.addRow([element.maSP, element.soluong, element.ghichu, element.loi]);
        i++;
      } else {
        worksheet.addRow([element.maSP, element.soluong, element.ghichu, element.loi]);
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
    values.details.map(item => {
      item.product = item.key
      return item
    })
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
    values.details.map(item => {
      item.product = item.product_obj.id
      return item
    })
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
    if (values.details == null) {
      message.error("Không thể tạo phiếu kiểm kê trống!")
      setDisableSubmit(false)
      stopLoading(idxBtnSave)
      return;
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
      setDataPrimary(response.data.data)
      // values.start_date = moment(values.start_date)
      // values.status = values.status.toString()
      // values.end_date = moment(values.end_date)
      ///
      values.details = values.details.map(elm => {
        elm.unit = elm.product.base_unit.name;
        elm.diff = `${elm.quantity_after - elm.quantity_before} ${elm.product.base_unit.name}`
        elm.quantity_before_int = elm.quantity_before
        elm.quantity_before = `${elm.quantity_before} ${elm.product.base_unit.name}`
        elm.product_obj = elm.product
        elm.product = elm.product.name

        // elm.product = elm.product.id;
        return elm;

      })
      console.log("handleData", values)

      form.setFieldsValue(values)
      store.dispatch(setInfoCreateUpdate(values))
      setStatus(values.status);
      if (values.status == "complete") {
        setChecked(true);
      } else {
        setChecked(false)
      }
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
        <Button type="primary" icon={<CheckCircleOutlined />} onClick={() => saveComplete()}
        >Hoàn thành</Button>,
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
        // <Upload showUploadList={false} {...uploadData} style={{}}>
        //   <Button type='primary' icon={<UploadOutlined />}>Nhập Excel và Lưu</Button>
        // </Upload>,
        <ShowForPermission>
          <ExportTemplateReactCSV csvData={[]} fileName='template_kiem_ke.xlsx'
            header={[
              { label: 'maSP', key: 'maSP' },
              { label: 'soluong', key: 'soluong' },
              { label: 'ghichu', key: 'ghichu' },
              { label: '', key: '' },
              { label: '', key: '' },
              { label: '', key: '' },
              { label: '(Số lượng theo đơn vị cơ bản)', key: 'note' },
            ]}
          />
        </ShowForPermission>,
        <Button type="info" icon={<HistoryOutlined />} onClick={() => { navigate(paths.inventory_record.list) }}
        >Thoát</Button>
      ])
    }
  }, [is_create])

  useEffect(() => {
    setTimeout(() => refAutoFocus.current && refAutoFocus.current.focus(), 500)
  }, [refAutoFocus])

  useEffect(() => {
    console.log("dataPrimary", dataPrimary)
  }, [dataPrimary])

  const onSelectProduct = async (product_id, add) => {

    if (form.getFieldValue("details")) {
      for (var i = 0; i < form.getFieldValue("details").length; i++) {
        if (form.getFieldValue("details")[i].key == product_id) {
          message.error("Đã tồn tại sản phẩm này!")
          return
        }
      }
    }

    const response = await api.product.get(product_id)
    console.log("onSelectProduct", response.data)
    if (response.data.code == 1) {
      console.log(response.data.data)
      const product = response.data.data

      const value = {
        ...product,
        key: product.id,
        product: product.name,
        unit: product.base_unit.name,
        quantity_before_int: product.stock,
        quantity_before: `${product.stock} ${product.base_unit.name}`,
        quantity_after: product.stock,
        diff: `0 ${product.base_unit.name}`
      }
      add(value)
      // handleDataBaseUnit(response.data.data.units)
    } else {
      message.error(messages.ERROR_REFRESH)
    }
  }

  const handleDiff = (key, name) => {
    const _details = form.getFieldValue("details")
    _details[name].diff = _details[name].quantity_after - _details[name].quantity_before_int
    console.log("handleDiff", _details[name].quantity_after,
      _details[name].quantity_before_int, _details[name].diff)
    _details[name].diff = `${_details[name].diff} ${_details[name].base_unit.name}`
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
            </>
              {/* {is_create ? null : */}
              <Row>
                <Col span={1}></Col>
                <Col span={10} style={{ backgroundColor: "white" }}>
                  <Form.Item label="Mã id phiếu kiểm kê" name="id">
                    <Input name="id" disabled={true} className="inputBorderDisableText" />
                  </Form.Item>
                </Col>
                <Col span={2}></Col>
                <Col span={10} style={{ backgroundColor: "white" }}>
                  <Form.Item label="Trạng thái" name="status"
                    style={{
                      textAlign: 'left'
                    }}>
                    <Select
                      defaultValue="pending"
                      style={{
                        width: '100%',
                      }}
                      disabled={true}
                    >
                      <Option value="pending">Tạo mới</Option>
                      <Option value="complete">Hoàn thành</Option>
                      {/* <Option value="cancel">Hủy</Option> */}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              {/* } */}
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


              <Col>
                <label><h2 style={{ marginTop: '10px', marginBottom: '30px', textAlign: 'center' }}>Kiểm kê</h2></label>

                <Form.List name="details" label="Bảng sản phẩm">
                  {(fields, { add, remove }) => (
                    <>
                      {is_create ? <><ProductSelect
                        style={{
                          marginBottom: '20px'
                        }}
                        placeholder="Thêm sản phẩm vào phiếu kiểm kê"
                        onSelectProduct={(value) => onSelectProduct(value, add)} />
                        <Upload showUploadList={false} {...uploadData} style={{}}>
                          <Button icon={<UploadOutlined />}>Nhập Excel và Lưu</Button>
                        </Upload>
                      </> : null}
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
                        <Col span={2} style={titleCol}>
                          <Typography.Text>Số lượng thực tế</Typography.Text>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={2} style={titleCol}>
                          <Typography.Text>Đơn vị tính</Typography.Text>
                        </Col>
                        <Col span={1}></Col>
                        <Col span={2} style={titleCol}>
                          <Typography.Text>Chênh lệch</Typography.Text>
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
                                  textAlign: 'left',
                                  width: '100%',
                                }}
                              >
                                {/* <Select
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
                                name={[name, 'quantity_before']}
                                style={{
                                  textAlign: 'left'
                                }}
                              >
                                <Input readOnly value={quantity}
                                  key={key} disabled={true}
                                  placeholder="Số lượng tồn" className='inputDisableText' />
                              </Form.Item>
                            </Col>
                            <Col span={1}></Col>
                            <Col span={2}>
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
                                <Input placeholder="Số lượng thực tế" min='0' type='number'
                                  disabled={is_create ? false : true}
                                  onChange={() => { handleDiff(key, name) }} />
                              </Form.Item>

                            </Col>
                            <Col span={1}></Col>
                            <Col span={2}>
                              <Form.Item
                                {...restField}
                                name={[name, 'unit']}
                                style={{
                                  textAlign: 'left'
                                }}
                              >
                                <Input type='text' value={unit} readOnly key={key}
                                  disabled={true} className='inputDisableText' placeholder="Đơn vị cơ bản" />
                              </Form.Item>
                            </Col>
                            <Col span={1}></Col>
                            <Col span={2}>
                              <Form.Item
                                {...restField}
                                name={[name, 'diff']}
                                style={{
                                  textAlign: 'left'
                                }}
                              >
                                <Input type='text'
                                  disabled={true} className='inputDisableText'
                                  placeholder="Số lượng chênh lệch" />
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

export default InventoryRecordChangeForm;