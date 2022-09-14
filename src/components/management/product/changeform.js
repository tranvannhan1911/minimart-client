import {
  PlusOutlined, EditOutlined, DeleteOutlined, HistoryOutlined,
  LoadingOutlined, MinusCircleOutlined
} from '@ant-design/icons';
import { Button, Form, Input, Select, message, Space, Popconfirm, Upload, Row, Col, Checkbox } from 'antd';
import { Typography } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import api from '../../../api/apis'
import ChangeForm from '../templates/changeform';
import { useNavigate, useParams } from 'react-router-dom'
import Loading from '../../basic/loading';
import paths from '../../../utils/paths'
import messages from '../../../utils/messages'
import ProductGroupModal from '../product_group/modal';
import uploadFile from '../../../utils/s3';
const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

const ProductChangeForm = (props) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [baseUnitOptions, setBaseUnitOptions] = useState([]);
  const [productGroupOptions, setProductGroupOptions] = useState([]);
  const [loadings, setLoadings] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [idxBtnSave, setIdxBtnSave] = useState([]);
  const [open, setOpen] = useState(false);
  let { id } = useParams();
  const [is_create, setCreate] = useState(null); // create
  const refAutoFocus = useRef(null)

  useEffect(() => {
    if (is_create == null) {
      setCreate(props.is_create)
      if (!props.is_create) {
        handleData()
      }
      setLoadingData(false)
    }
    handleDataBaseUnit()
    handleDataProductGroup()
  }, [])

  useEffect(() => {
    props.setBreadcrumb([
      { title: "Sản phẩm", href: paths.product.list },
      { title: is_create ? "Thêm mới" : "Chỉnh sửa" }])

    if (is_create == false) {
      props.setBreadcrumbExtras([
        <Popconfirm
          placement="bottomRight"
          title="Xác nhận xóa sản phẩm này"
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

  const handleData = async () => {
    setLoadingData(true)
    try {
      const response = await api.product.get(id);
      const values = response.data.data
      values.product_groups = values.product_groups.map(elm => elm.id.toString())
      setImageUrl(values.image)
      form.setFieldsValue(values)
    } catch (error) {
      message.error(messages.ERROR)
    } finally {
      setLoadingData(false)
    }
  }

  const handleDataBaseUnit = async () => {
    setLoadingData(true)
    try {
      const response = await api.unit.list();
      const options = response.data.data.results.map(elm => {
        return (
          <Option key={elm.id} value={elm.id}>{elm.name}</Option>
        )
      })
      setBaseUnitOptions(options)
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
      const options = response.data.data.results.map(elm => {
        return (
          <Option 
            title={elm.name}
            key={elm.id}>{elm.name}</Option>
        )
      })
      setProductGroupOptions(options)
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
      navigate(paths.product.list)
    } else if (idxBtnSave == 1) {
      if (is_create) {
        navigate(paths.product.change(response.data.data.id))
        setCreate(false)
      }
      refAutoFocus.current && refAutoFocus.current.focus()
    } else if (idxBtnSave == 2) {
      if (!is_create) {
        navigate(paths.product.add)
        setCreate(true)
      }
      form.resetFields()
      refAutoFocus.current && refAutoFocus.current.focus()
    }

  }

  const create = async (values) => {
    try {
      const response = await api.product.add(values);
      if (response.data.code == 1) {
        message.success(messages.product.SUCCESS_SAVE())
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

  const update = async (values) => {
    try {
      const response = await api.product.update(id, values)
      if (response.data.code == 1) {
        message.success(messages.product.SUCCESS_SAVE(id))
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
      const response = await api.product.delete(id)
      if (response.data.code == 1) {
        message.success(messages.product.SUCCESS_DELETE(id))
        navigate(paths.product.list)
        return true
      } else {
        message.error(messages.product.ERROR_DELETE(id))
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
    values.image = imageUrl
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

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';

    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }

    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
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
        <>
          <ChangeForm
            form={form}
            setBreadcrumb={props.setBreadcrumb}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            forms={
              <>
                <Form.Item label="Tên sản phẩm" name="name" required
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập tên sản phẩm!',
                    },
                  ]}
                >
                  <Input autoFocus ref={refAutoFocus} />
                </Form.Item>
                <Form.Item label="Code sản phẩm" name="product_code" required
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập code sản phẩm!',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item label="Mã vạch" name="barcode" required
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập mã vạch!',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item label="Mô tả sản phẩm" name="description" >
                  <TextArea rows={4} />
                </Form.Item>
                <Form.Item label="Ghi chú" name="note" >
                  <TextArea rows={4} />
                </Form.Item>

                <Row>
                  <Col flex="auto">
                    <Form.Item label="Nhóm sản phẩm" name="product_groups"
                    >
                      <Select
                        mode="multiple"
                        allowClear
                        style={{
                          width: '100%',
                        }}
                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                      >
                        {productGroupOptions}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col flex="none"
                    style={{
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                    <Button type="link" shape="circle" icon={<PlusOutlined />}
                      style={{
                        marginTop: '5px'
                      }}
                      onClick={() => {
                        setOpen(true)
                      }} />
                  </Col>
                </Row>
                <Form.Item label="Đơn vị cơ bản" name="base_unit"
                  style={{
                    textAlign: 'left'
                  }}>
                  <Select
                    showSearch
                    style={{
                      width: 200,
                    }}
                    placeholder="Tìm kiếm đơn vị tính"
                    optionFilterProp="children"
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                    filterSort={(optionA, optionB) =>
                      optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                    }
                  >
                    {baseUnitOptions}
                  </Select>
                </Form.Item>
                <Form.List name="units" label="Đơn vị tính quy đổi">
                  {(fields, { add, remove }) => (
                    <>
                      <div style={{
                          textAlign: 'left',
                          paddingBottom: '7px'
                      }}>
                      <Typography.Text >Các đơn vị tính khác</Typography.Text>
                      </div>
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
                            name={[name, 'unit']}
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
                              style={{
                                width: 200,
                              }}
                              placeholder="Đơn vị tính"
                              optionFilterProp="children"
                              filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                              filterSort={(optionA, optionB) =>
                                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                              }
                            >
                              {baseUnitOptions}
                            </Select>
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, 'value']}
                            rules={[
                              {
                                required: true,
                                message: 'Vui lòng nhập giá trị quy đổi!',
                              },
                            ]}
                          >
                            <Input placeholder="Giá trị quy đổi" />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            valuePropName="checked"
                            name={[name, 'allow_sale']}
                          >
                            <Checkbox >Cho phép bán hàng</Checkbox>
                          </Form.Item>
                          {/* <Popconfirm
                            placement="bottomRight"
                            title="Xác nhận xóa đơn vị tính này"
                            onConfirm={() => remove(name)}
                            okText="Đồng ý"
                            okType="danger"
                            cancelText="Hủy bỏ"
                          > */}
                            <MinusCircleOutlined onClick={() => remove(name)} />
                          {/* </Popconfirm> */}
                        </Space>
                      ))}
                      <Form.Item>
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                          Thêm đơn vị tính
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>

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
                      type:"circle"
                    }}
                    customRequest={(options) => {
                      options.prefix="product"
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
          <ProductGroupModal open={open} setOpen={setOpen} 
            {...props} is_create={true} is_modal={true}
            onFinishModal={() => {
              // refAutoFocus.curent = 
              handleDataProductGroup()
            }}/>
        </>
      }
    </>
  )

}

export default ProductChangeForm;