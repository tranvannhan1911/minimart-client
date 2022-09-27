import {
  PlusOutlined, FormOutlined, DeleteOutlined, HistoryOutlined, EyeOutlined, ReloadOutlined
} from '@ant-design/icons';
import { Button, Form, Input, Select, message, Space, Popconfirm, Switch, DatePicker, Col, Row, Table, Checkbox, Modal, Divider } from 'antd';
import { Typography } from 'antd';
import React, { useContext, useState, useEffect, useRef } from 'react';
import api from '../../../../api/apis'
import ChangeForm from '../../templates/changeform';
import { useNavigate, useParams } from 'react-router-dom'
import Loading from '../../../basic/loading';
import paths from '../../../../utils/paths'
import messages from '../../../../utils/messages'
import { validName1 } from '../../../../resources/regexp'
import PromotionLineModal from './modal';
import moment from "moment";
const { RangePicker } = DatePicker;

const EditableContext = React.createContext(null);
const dateFormat = "YYYY/MM/DD";

const { TextArea } = Input;
const { Option } = Select;

const PromotionChangeForm = (props) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
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

  const handleDataCustomerGroup = async () => {
    setLoadingData(true)
    try {
      const response = await api.customer_group.list();
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

  const onFinish = async (values) => {

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

      values.lines.forEach(element => {
        if (element.type == 'Product') {
          loai = 'Sản phẩm';
        } else if (element.type == 'Fixed') {
          loai = 'Tiền';
        } else {
          loai = 'Chiết khấu';
        }

        let date = element.start_date.slice(0, 10);

        let date2 = element.end_date.slice(0, 10);

        let lineIndex = {
          promotion_code: element.promotion_code,
          description: element.description,
          type: loai,
          start_date: date,
          end_date: date2,
          id: element.id,
          status:element.status ? 'Hoạt động': 'Khóa'
        }
        dataline.push(lineIndex);
      });
      setDataLine(dataline);
      // console.log(values.lines)
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
        <Button type="info" icon={<HistoryOutlined />}
        >Lịch sử chỉnh sửa</Button>
      ])
    // } else {
    //   props.setBreadcrumbExtras(null)
    // }
  }, [is_create])

  useEffect(() => {
    setTimeout(() => refAutoFocus.current && refAutoFocus.current.focus(), 500)
  }, [refAutoFocus])

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
        <span>
          <a onClick={() => onOpenPromotionLine(id)} key={id}><EyeOutlined title='Xem chi tiết' className="site-form-item-icon" style={{ fontSize: '20px' }} /></a>
          <a onClick={() => setIdxBtn(id)}><FormOutlined title='Chỉnh sửa' className="site-form-item-icon" style={{ fontSize: '20px', marginLeft: '10px' }} /></a>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa dòng khuyến mãi này?"
            onConfirm={() => setDeleteIdxBtn(id)}
            onCancel={cancel}
            okText="Xóa"
            cancelText="Thoát"
          >
            <a><DeleteOutlined title='Xóa' className="site-form-item-icon" style={{ fontSize: '20px', marginLeft: '10px' }} /></a>
          </Popconfirm>
        </span>
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
                    <Option value="false">Khóa</Option>
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

              </Col>
              <Col span={2}></Col>
              <Col span={10} style={{ backgroundColor: "white" }}>
                <Form.Item label="Ghi chú" name="note"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </>
            <Divider />
            <Row>
              <label><h2 style={{ marginRight: '20px', marginBottom: '30px', textAlign: 'left' }}>Dòng</h2></label>
              <Button type="primary" onClick={() => onOpen()}>Thêm mới</Button>
            </Row>
            <Col>
              <Table columns={columns} dataSource={dataLine}>

              </Table>
            </Col>
          </>}>
        </ChangeForm>

          <PromotionLineModal data={dataUpdate} open={open} start_date={start_date} end_date={end_date} id={id} dataProduct={products} dataGroupProduct={productGroup} setOpen={setOpen} setCreate={is_create} /></>
      }
    </>
  )

}

export default PromotionChangeForm;