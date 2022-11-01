import {
  FormOutlined, DeleteOutlined, HistoryOutlined, ReloadOutlined, PlusOutlined, LoadingOutlined, DownloadOutlined
} from '@ant-design/icons';
import {
  Button, Form, Input, Select, message, Popconfirm, DatePicker,
  Col, Row, Table, Divider, Space, Upload
} from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import api from '../../../../api/apis'
import ChangeForm from '../../templates/changeform';
import { useNavigate, useParams } from 'react-router-dom'
import Loading from '../../../basic/loading';
import paths from '../../../../utils/paths'
import uploadFile from '../../../../utils/s3';
import messages from '../../../../utils/messages'
import { ExportReactCSV } from '../../../../utils/exportExcel';
import { validName1 } from '../../../../resources/regexp'
import PromotionLineModal from './modal';
import moment from "moment";
import ExcelJS from "exceljs";
import saveAs from "file-saver";

const dateFormat = "YYYY/MM/DD";

const { Option } = Select;

const PromotionChangeForm = (props) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [dataMain, setDataMain] = useState([]);
  const [dataCustomerGroup, setDataCustomerGroup] = useState([]);
  const [dataUpdate, setDataUpdate] = useState([]);
  const [loadings, setLoadings] = useState([]);
  const [customerGroupOptions, setCustomerGroupOptions] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [idxBtnSave, setIdxBtnSave] = useState([]);
  const [baseProductOptions, setBaseProductOptions] = useState([]);
  const [baseUnitOptions, setBaseUnitOptions] = useState([]);
  let { id } = useParams();
  const [is_create, setCreate] = useState(true); // create
  const refAutoFocus = useRef(null)
  const [open, setOpen] = useState(false);
  const [start_date, setStartDate] = useState('');
  const [end_date, setEndDate] = useState('');
  const [products, setProducts] = useState([]);
  const [productGroup, setProductGroup] = useState([]);
  const [dataLine, setDataLine] = useState([]);

  /////////////////

  // const exportExcel = () => {
  //   var ExcelJSWorkbook = new ExcelJS.Workbook();
  //   var worksheet = ExcelJSWorkbook.addWorksheet("KhuyenMai");

  //   worksheet.mergeCells("A2:E2");

  //   const customCell = worksheet.getCell("A2");
  //   customCell.font = {
  //     name: "Times New Roman",
  //     family: 4,
  //     size: 20,
  //     underline: true,
  //     bold: true,
  //   };
  //   customCell.alignment = { vertical: 'middle', horizontal: 'center' };

  //   customCell.value = dataMain.title;

  //   let header = ["Mã áp dụng", "Tiêu đề", "Diễn giải", "Loại khuyến mãi",
  //     "Ngày bắt đầu", "Ngày kết thúc", "Trạng thái",
  //     "Số lượng tối đa áp dụng", "Số lượng tối đa cho 1 khách", "Số lượng tối đa cho 1 khách trong 1 ngày",
  //     "Ghi chú", "Nhóm sản phẩm áp dụng", "Sản phẩm áp dụng", "Số lượng mua", "Sản phẩm khuyến mãi",
  //     "Số lượng khuyến mãi", "Số tiền ít nhất để được khuyến mãi", "Chiết khấu",
  //     "Số tiền giảm giá", "Số tiền giảm tối đa"];

  //   var headerRow = worksheet.addRow();
  //   var headerRow = worksheet.addRow();

  //   const customCellA5 = worksheet.getCell("A5");
  //   customCellA5.value = "Mã chương trình khuyến mãi:";
  //   const customCellB5 = worksheet.getCell("B5");
  //   customCellB5.value = dataMain.id + "";

  //   const customCellC5 = worksheet.getCell("C5");
  //   customCellC5.value = "Mô tả:";
  //   const customCellD5 = worksheet.getCell("D5");
  //   customCellD5.value = dataMain.description;

  //   let tt = "";
  //   if (dataMain.status == true) {
  //     tt = "Hoạt động";
  //   } else {
  //     tt = 'Khóa';
  //   }

  //   const customCellA6 = worksheet.getCell("A6");
  //   customCellA6.value = "Ngày bắt đầu:";
  //   const customCellB6 = worksheet.getCell("B6");
  //   customCellB6.value = start_date.format('DD-MM-YYYY');

  //   const customCellC6 = worksheet.getCell("C6");
  //   customCellC6.value = "Ngày kết thúc:";
  //   const customCellD6 = worksheet.getCell("D6");
  //   customCellD6.value = end_date.format('DD-MM-YYYY');

  //   const customCellA7 = worksheet.getCell("A7");
  //   customCellA7.value = "Trạng thái:";
  //   const customCellB7 = worksheet.getCell("B7");
  //   customCellB7.value = tt;

  //   let groupcustomer = "";
  //   if (dataMain.applicable_customer_groups.length != 0) {
  //     dataMain.applicable_customer_groups.forEach(element => {
  //       dataCustomerGroup.forEach(elementt => {
  //         if (element == elementt.id) {
  //           groupcustomer += elementt.name + ", ";
  //         }
  //       });
  //     });
  //   }

  //   const customCellC7 = worksheet.getCell("C7");
  //   customCellC7.value = "Nhóm khách hàng áp dụng:";
  //   const customCellD7 = worksheet.getCell("D7");
  //   customCellD7.value = groupcustomer;

  //   const customCellA8 = worksheet.getCell("A8");
  //   customCellA8.value = "Ghi chú:";
  //   const customCellB8 = worksheet.getCell("B8");
  //   customCellB8.value = dataMain.note == null ? "" : dataMain.note;

  //   var headerRow = worksheet.addRow();
  //   var headerRow = worksheet.addRow();
  //   var headerRow = worksheet.addRow();

  //   worksheet.getRow(11).font = { bold: true };

  //   for (let i = 0; i < 20; i++) {
  //     let currentColumnWidth = "123";
  //     worksheet.getColumn(i + 1).width =
  //       currentColumnWidth !== undefined ? currentColumnWidth / 6 : 20;
  //     let cell = headerRow.getCell(i + 1);
  //     cell.value = header[i];
  //   }

  //   worksheet.autoFilter = {
  //     from: {
  //       row: 11,
  //       column: 1
  //     },
  //     to: {
  //       row: 11,
  //       column: 20
  //     }
  //   };

  //   dataLine.forEach(element => {

  //     let groupproduct = "";
  //     element.detail.applicable_products.forEach(element => {
  //       products.forEach(elementt => {
  //         if (element == elementt.id) {
  //           groupproduct += elementt.name + ", ";
  //         }
  //       });
  //     });

  //     let listgroupproduct = "";
  //     element.detail.applicable_product_groups.forEach(element => {
  //       productGroup.forEach(elementt => {
  //         if (element == elementt.id) {
  //           listgroupproduct += elementt.name + ", ";
  //         }
  //       });
  //     });

  //     let product_received = "";
  //     products.forEach(elementt => {
  //       if (element.detail.product_received == elementt.id) {
  //         product_received = elementt.name;
  //       }
  //     });

  //     worksheet.addRow([element.promotion_code, element.title, element.description, element.type,
  //     element.start_date, element.end_date, element.status, element.max_quantity,
  //     element.max_quantity_per_customer, element.max_quantity_per_customer_per_day,
  //     element.note, listgroupproduct,
  //       groupproduct, element.detail.quantity_buy,
  //       product_received, element.detail.quantity_received,
  //     element.detail.minimum_total?.toLocaleString(), element.detail.percent,
  //     element.detail.reduction_amount?.toLocaleString(), element.detail.maximum_reduction_amount?.toLocaleString()]);
  //   });

  //   ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
  //     saveAs(
  //       new Blob([buffer], { type: "application/octet-stream" }),
  //       `KhuyenMaiSo${dataMain.id}.xlsx`
  //     );
  //   });
  // };

  ////////////////

  const handleDataCustomerGroup = async () => {
    setLoadingData(true)
    try {
      const response = await api.customer_group.list();
      setDataCustomerGroup(response.data.data.results);
      const options = response.data.data.results.map(elm => {
        return (
          <Option key={elm.id}>{elm.name}</Option>
        )
      })
      setCustomerGroupOptions(options)
    } catch (error) {
      message.error(messages.ERROR)
    } finally {
      setLoadingData(false)
    }
  }

  const handleDataProductGroup = async () => {
    setLoadingData(true)
    try {
      const response = await api.product_group.list();
      setProductGroup(response.data.data.results);
    } catch (error) {
      message.error(messages.ERROR)
    } finally {
      setLoadingData(false)
    }
  }



  const stopLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = false;
      return newLoadings;
    });
  }


  const _delete = async (idd) => {
    try {
      const response = await api.promotion_line.delete(idd)
      if (response.data.code == 1) {
        message.success(messages.promotion_line.SUCCESS_DELETE(idd))
        // navigate(paths.promotion.addline(id))
        handleData();
        return true
      } else {
        message.error(messages.promotion_line.ERROR_DELETE(idd))
      }
    } catch (error) {
      message.error(messages.ERROR)
      console.log('Failed:', error)
    }
    return false
  };

  const update = async (values) => {
    try {
      const response = await api.promotion.update(id, values)
      if (response.data.code == 1) {
        message.success(messages.promotion.SUCCESS_SAVE(id))
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

  const onFinish = async (values) => {
    setDisableSubmit(true)
    // console.log(state);
    if (!validName1.test(values.title)) {
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
    values.image = imageUrl;
    values.start_date = values.start_date._i;
    values.end_date = values.end_date._i;
    await update(values)
    setDisableSubmit(false)
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
    stopLoading(0)
  };

  const handleData = async () => {
    setLoadingData(true)
    try {
      let dataline = [];
      let loai = '';
      const response = await api.promotion.get(id);
      const values = response.data.data;
      // console.log(values)
      values.start_date = moment(values.start_date);
      values.status = values.status.toString();
      values.end_date = moment(values.end_date);
      values.applicable_customer_groups = values.applicable_customer_groups.map(elm => elm.toString());
      form.setFieldsValue(values);
      setImageUrl(values.image)
      values.lines.forEach(element => {
        if (element.type == 'Product') {
          loai = 'Sản phẩm';
        } else if (element.type == 'Fixed') {
          loai = 'Tiền';
        } else {
          loai = 'Chiết khấu';
        }

        let date = moment(element.start_date).format('DD-MM-YYYY');

        let date2 = moment(element.end_date).format('DD-MM-YYYY');

        let lineIndex = {
          title: element.title,
          detail: element.detail,
          promotion_code: element.promotion_code,
          description: element.description,
          type: loai,
          start_date: date,
          end_date: date2,
          id: element.id,
          note: element.note,
          max_quantity: element.max_quantity,
          max_quantity_per_customer: element.max_quantity_per_customer,
          max_quantity_per_customer_per_day: element.max_quantity_per_customer_per_day,
          status: element.status ? 'Hoạt động' : 'Ngưng hoạt động'
        }
        dataline.push(lineIndex);
      });
      setDataLine(dataline);
      setDataMain(values);
      setData(values.lines);
      setStartDate(values.start_date);
      setEndDate(values.end_date);
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
      setProducts(response.data.data.results);
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
        return (
          <Option key={elm.id} value={elm.id}>{elm.unit_name}</Option>
        )
      })
      setBaseUnitOptions(options);
    } catch (error) {
      message.error(messages.ERROR)
    } finally {
      setLoadingData(false)
    }
  }

  const onOpen = () => {
    setCreate(true);
    setDataUpdate([]);
    setOpen(true);
  };

  const setIdxBtn = (id) => {

    // console.log(data)
    data.forEach(element => {
      if (element.id == id) {
        let index = {
          "detail": {
            "quantity_buy": element.detail.quantity_buy,
            "quantity_received": element.detail.quantity_received,
            "minimum_total": element.detail.minimum_total,
            "percent": element.detail.percent,
            "maximum_reduction_amount": element.detail.maximum_reduction_amount,
            "reduction_amount": element.detail.reduction_amount,
            "promotion_line": element.detail.promotion_line,
            "product_received": element.detail.product_received,
            "applicable_products": element.detail.applicable_products,
            "applicable_product_groups": element.detail.applicable_product_groups
          },
          "id": element.id,
          "title": element.title,
          "description": element.description,
          "promotion_code": element.promotion_code,
          "type": element.type,
          "start_date": moment(element.start_date),
          "end_date": moment(element.end_date),
          "status": element.status.toString(),
          "max_quantity": element.max_quantity,
          "max_quantity_per_customer": element.max_quantity_per_customer,
          "max_quantity_per_customer_per_day": element.max_quantity_per_customer_per_day,
          "note": element.note,
          "date_updated": null,
          "promotion": element.promotion,
          "user_created": null,
          "user_updated": null
        }
        setDataUpdate(index);
      }
    });
    setCreate(false);
    setOpen(true);

  };

  const setDeleteIdxBtn = (id) => {
    console.log(id)
    _delete(id);
  };

  const onOpenPromotionLine = (id) => {
    setOpen(true);
  };

  const cancel = (e) => {
  };

  useEffect(() => {

    handleDataBaseProduct();
    handleDataCustomerGroup();
    handleDataProductGroup()
    handleData();

  }, [])

  useEffect(() => {
    props.setBreadcrumb([
      { title: "Chương trình khuyến mãi", href: paths.promotion.list },
      { title: is_create ? "Khuyến mãi" : "Khuyến mãi " }])

    // if (is_create == true) {
    props.setBreadcrumbExtras([
      <Button type="info" icon={<ReloadOutlined />} onClick={() => handleData()}
      >Làm mới</Button>,
      // <Button type="info" icon={<HistoryOutlined />}
      // >Lịch sử chỉnh sửa</Button>,
      <Button type="info" icon={<HistoryOutlined />} onClick={() => { navigate(paths.promotion.list) }}
      >Thoát</Button>
    ])
    // } else {
    //   props.setBreadcrumbExtras(null)
    // }
  }, [is_create])

  useEffect(() => {
    setTimeout(() => refAutoFocus.current && refAutoFocus.current.focus(), 500)
  }, [refAutoFocus])

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';

    if (!isJpgOrPng) {
      message.error('Chỉ tải lên các file JPG/PNG!');
    }

    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isLt2M) {
      message.error('File phải nhỏ hơn 2MB!');
    }

    return isJpgOrPng && isLt2M;
  };


  const [loadingImage, setLoadingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState();

  const handleChange = (info) => {
    console.log(info)
    if (info.file.status === 'uploading') {
      setImageUrl(null);
      setLoadingImage(true);
      return;
    }

    if (info.file.status === 'done') {
      setImageUrl(info.file.response);
      // Get this url from response in real world.
      // getBase64(info.file.originFileObj, (url) => {
      //   setLoadingImage(false);
      //   setImageUrl(url);
      // });
    }
  };

  const uploadButton = (
    <div>
      {loadingImage ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  const columns = [
    // {
    //   title: 'Loại',
    //   dataIndex: loai,
    //   key: 'name',
    // },
    {
      title: 'Mã áp dụng',
      dataIndex: 'promotion_code',
      key: 'address',
    },
    {
      title: 'Diễn giải',
      dataIndex: 'description',
      key: 'age',
    },
    {
      title: 'Loại khuyến mãi',
      dataIndex: 'type',
      key: 'address',
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'start_date',
      key: 'address',
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'end_date',
      key: 'address',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'address',
    },
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      width: "11%",
      render: (id) => (
        <Space>
          <Button
            type="text"
            icon={<FormOutlined title='Chỉnh sửa' />}
            onClick={() => setIdxBtn(id)} ></Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa dòng khuyến mãi này?"
            onConfirm={() => setDeleteIdxBtn(id)}
            onCancel={cancel}
            okText="Xóa"
            cancelText="Thoát"
          >
            <Button
              type="text"
              icon={<DeleteOutlined title='Xóa' />}
            ></Button>
          </Popconfirm>
        </Space>
        // <span>
        //   {/* <a onClick={() => onOpenPromotionLine(id)} key={id}><EyeOutlined title='Xem chi tiết' className="site-form-item-icon" style={{ fontSize: '20px' }} /></a> */}
        //   <a onClick={() => setIdxBtn(id)}><FormOutlined title='Chỉnh sửa' className="site-form-item-icon" style={{ fontSize: '20px', marginLeft: '10px' }} /></a>
        //   <Popconfirm
        //     title="Bạn có chắc chắn muốn xóa dòng khuyến mãi này?"
        //     onConfirm={() => setDeleteIdxBtn(id)}
        //     onCancel={cancel}
        //     okText="Xóa"
        //     cancelText="Thoát"
        //   >
        //     <a><DeleteOutlined title='Xóa' className="site-form-item-icon" style={{ fontSize: '20px', marginLeft: '10px' }} /></a>
        //   </Popconfirm>
        // </span>
      ),
    },
  ];

  return (
    <>
      {loadingData ? <Loading /> :
        <><ChangeForm
          form={form}
          setBreadcrumb={props.setBreadcrumb}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          forms={<><>
            <Row>
              <Col span={1}></Col>
              <Col span={10} style={{ backgroundColor: "white" }}>
                <Form.Item label="Mã id chương trình khuyến mãi" name="id">
                  <Input name="id" disabled={true} className="inputBorderDisableText"/>
                </Form.Item>
              </Col>
              <Col span={2}></Col>
              <Col span={10} style={{ backgroundColor: "white" }}>
              </Col>
            </Row>
            <Row>
              <Col span={1}></Col>
              <Col span={10} style={{ backgroundColor: "white" }}>
                <Form.Item label="Tiêu đề" name="title" required
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập tiêu đề khuyến mãi!',
                    },
                  ]}
                >
                  <Input autoFocus ref={refAutoFocus} />
                </Form.Item>
              </Col>
              <Col span={2}></Col>
              <Col span={10} style={{ backgroundColor: "white" }}>
                <Form.Item label="Ngày bắt đầu" name="start_date" required
                  style={{
                    textAlign: "left",
                    width: '100%',
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
                  <DatePicker format={dateFormat} disabled='true' style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={1}></Col>
              <Col span={10} style={{ backgroundColor: "white" }}>
                <Form.Item label="Mô tả" name="description" required
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập mô tả khuyến mãi!',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={2}></Col>
              <Col span={10} style={{ backgroundColor: "white" }}>
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
                  <DatePicker format={dateFormat} disabled='true' style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={1}></Col>
              <Col span={10} style={{ backgroundColor: "white" }}>
                <Form.Item label="Trạng thái" name="status" required
                  style={{
                    textAlign: 'left'
                  }}>
                  <Select
                    defaultValue="true"
                    style={{
                      width: '100%',
                    }}
                  >
                    <Option value="true">Hoạt động</Option>
                    <Option value="false">Ngưng hoạt động</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={2}></Col>
              <Col span={10} style={{ backgroundColor: "white" }}>
                <Form.Item label="Nhóm khách hàng áp dụng" name="applicable_customer_groups" required
                >
                  <Select
                    mode="multiple"
                    allowClear
                    style={{
                      width: '100%',
                    }}
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                  >
                    {customerGroupOptions}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={1}></Col>
              <Col span={10} style={{ backgroundColor: "white" }}>
                <Form.Item label="Hình ảnh" name="image"
                  style={{
                    textAlign: 'left'
                  }}>
                  <Upload
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                    progress={{
                      type: "circle"
                    }}
                    customRequest={(options) => {
                      options.prefix = "promotion"
                      uploadFile(options)
                    }}
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="avatar"
                        style={{
                          width: '100%',
                        }}
                      />
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                </Form.Item>
              </Col>
              <Col span={2}></Col>
              <Col span={10} style={{ backgroundColor: "white" }}>
                <Form.Item label="Ghi chú" name="note"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item style={{ marginTop: '-70px' }}>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<PlusOutlined />}
                  loading={loadings[0]}
                // onClick={() => setIdxBtnSave(0)}
                >Cập nhật</Button>
              </Space>
            </Form.Item>
          </>
            <Divider />
            <Row>
              <label><h2 style={{ marginRight: '20px', marginBottom: '30px', textAlign: 'left' }}>Dòng</h2></label>
              <Button type="primary" onClick={() => onOpen()}>Thêm mới</Button>
              {/* <span style={{ marginLeft: '10px' }}>
                <Button onClick={() => exportExcel()}> <DownloadOutlined /> Xuất Excel</Button>
              </span> */}
            </Row>
            <Col>
              <Table columns={columns} dataSource={dataLine} size='small'>

              </Table>
            </Col>
          </>}>
        </ChangeForm>

          <PromotionLineModal data={dataUpdate} open={open} start_date={start_date} end_date={end_date} id={id} dataProduct={products} dataGroupProduct={productGroup} setOpen={setOpen} setCreate={is_create} handleData={handleData} /></>
      }
    </>
  )

}

export default PromotionChangeForm;