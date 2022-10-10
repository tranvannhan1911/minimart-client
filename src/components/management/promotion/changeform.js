import {
  PlusOutlined, EditOutlined, DeleteOutlined, HistoryOutlined, MinusCircleOutlined, LoadingOutlined
} from '@ant-design/icons';
import { Button, Form, Input, Select, message, Space, Popconfirm, Switch, DatePicker, Col, Row, Table, Upload, Modal } from 'antd';
import { Typography } from 'antd';
import React, { useContext, useState, useEffect, useRef } from 'react';
import api from '../../../api/apis'
import ChangeForm from '../templates/changeform';
import { useNavigate, useParams } from 'react-router-dom'
import Loading from '../../basic/loading';
import paths from '../../../utils/paths'
import messages from '../../../utils/messages'
import uploadFile from '../../../utils/s3';
import { validName1 } from '../../../resources/regexp'
import moment from "moment";
const { RangePicker } = DatePicker;

const EditableContext = React.createContext(null);
const dateFormat = "YYYY/MM/DD";

const { TextArea } = Input;
const { Option } = Select;

const PromotionChangeForm = (props) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [formPrice] = Form.useForm();
  const [loadings, setLoadings] = useState([]);
  const [customerGroupOptions, setCustomerGroupOptions] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [idxBtnSave, setIdxBtnSave] = useState([]);
  const [baseProductOptions, setBaseProductOptions] = useState([]);
  const [baseUnitOptions, setBaseUnitOptions] = useState([]);
  let { id } = useParams();
  const [is_create, setCreate] = useState(null); // create
  const refAutoFocus = useRef(null)

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
      navigate(paths.promotion.list)
    } else if (idxBtnSave == 1) {
      if (is_create) {
        navigate(paths.promotion.change(response.data.data.id))
        setCreate(false)
      }
      refAutoFocus.current && refAutoFocus.current.focus()
    } else if (idxBtnSave == 2) {
      if (!is_create) {
        navigate(paths.promotion.add)
        setCreate(true)
      }
      form.resetFields()
      refAutoFocus.current && refAutoFocus.current.focus()
    }

  }

  const create = async (values) => {
    try {
      const response = await api.promotion.add(values);
      if (response.data.code == 1) {
        message.success(messages.promotion.SUCCESS_SAVE())
        directAfterSubmit(response)
        return true
      } else if (response.data.code == 0) {
        message.error("Vui lòng nhập bảng giá từng sản phẩm")
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
      const response = await api.promotion.update(id, values)
      if (response.data.code == 1) {
        message.success(messages.promotion.SUCCESS_SAVE(id))
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
      const response = await api.promotion.delete(id)
      if (response.data.code == 1) {
        message.success(messages.promotion.SUCCESS_DELETE(id))
        navigate(paths.promotion.list)
        return true
      } else {
        message.error(messages.promotion.ERROR_DELETE(id))
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
    if (is_create) {
      await create(values)
    } else {
      console.log(values.start_date._i)
      values.start_date = values.start_date._i;
      values.end_date = values.end_date._i;
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
      const response = await api.promotion.get(id);
      const values = response.data.data;
      console.log(values)
      values.start_date = moment(values.start_date);
      values.status = values.status.toString();
      values.end_date = moment(values.end_date);
      values.applicable_customer_groups = values.applicable_customer_groups.map(elm => elm.toString());
      form.setFieldsValue(values);
      setImageUrl(values.image)
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
        handleDataBaseProduct();
        handleDataCustomerGroup();
        handleData();
      }
      setLoadingData(false)
    }
    handleDataBaseProduct();
    handleDataCustomerGroup();
  }, [])

  useEffect(() => {
    props.setBreadcrumb([
      { title: "Chương trình khuyến mãi", href: paths.promotion.list },
      { title: is_create ? "Thêm mới" : "Chỉnh sửa" }])

    if (is_create == false) {
      props.setBreadcrumbExtras([
        <Popconfirm
          placement="bottomRight"
          title="Xác nhận xóa chương trình khuyến mãi này"
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
                    <DatePicker format={dateFormat} disabled={is_create ? false : true} style={{ width: '100%' }} />
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
                    <DatePicker format={dateFormat} disabled={is_create ? false : true} style={{ width: '100%' }} />
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
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: 'Vui lòng nhập tiêu đề khuyến mãi!',
                  //   },
                  // ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </>
              {/* <Col>
                <label><h2 style={{ marginTop: '10px', marginBottom: '30px', textAlign: 'center' }}>Bảng giá sản phẩm</h2></label>

                <Form.List name="pricedetails" label="Bảng giá sản phẩm">
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

                          <Popconfirm
                            placement="bottomRight"
                            title="Xác nhận xóa bảng giá này"
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
              </Col> */}
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

export default PromotionChangeForm;