
import { Button, Drawer, Row, Col, 
  Space, Form, Select, Input, DatePicker, message, } from 'antd';
import React, { useState, useEffect } from 'react';
import messages from '../../../../utils/messages'
import api from '../../../../api/apis'
import { useNavigate } from 'react-router-dom'
import { validCode } from '../../../../resources/regexp'

const { Option } = Select;
const dateFormat = "YYYY/MM/DD";

const PromotionLineModal = (props) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [data, setData] = useState("");
  const [dataSource, setDataSource] = useState('');
  const [is_create, setCreate] = useState(null); // create
  const [baseProductOptions, setBaseProductOptions] = useState([]);
  const [baseProductGroupOptions, setBaseProductGroupOptions] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [typeIndex, setTypeIndex] = useState("Product");
  const [idIndex, setIdIndex] = useState(0);

  useEffect(() => {
    setCreate(props.setCreate);
    if (props.data.length != 0) {
      if (idIndex == 0 || idIndex != props.data.id) {
        form.setFieldsValue(props.data);
        form.setFieldsValue(props.data.detail);
        setTypeIndex(props.data.type);
        handleDataBaseProduct();
        handleDataBaseGroupProduct();
        setIdIndex(props.data.id);
      }
    }
    if (props.setCreate == true) {
      form.setFieldValue("start_date", props.start_date);
      form.setFieldValue("end_date", props.end_date);
    }
    // setDataSource(props.data.pricedetails)
  });

  const create = async (values) => {
    try {
      const response = await api.promotion_line.add(values);
      if (response.data.code == 1) {
        message.success(messages.promotion_line.SUCCESS_SAVE())
        return true
      } else if (response.data.code == 0) {
        message.error("Vui lòng nhập mã khuyến mãi khác");
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
      const response = await api.promotion_line.update(props.data.id, values);
      if (response.data.code == 1) {
        message.success(messages.promotion_line.SUCCESS_SAVE(props.data.id));
        return true;
      } else {
        message.error(response.data.message.toString());
        // window.location.reload();
      }
    } catch (error) {
      message.error(messages.ERROR);
      console.log('Failed:', error);
    }
    return false;
  }

  const showDrawer = () => {
    props.setOpen(true);
  };

  const onClose = () => {
    props.setOpen(false);
  };

  const onReset = () => {
    form.resetFields();
    form.setFieldValue("start_date", props.start_date);
    form.setFieldValue("end_date", props.end_date);
    setTypeIndex("Product");
  };

  const onSaveAndClose = async () => {
    if (form.getFieldValue("title") == null || form.getFieldValue("title") == '') {
      message.error("Vui lòng nhập tiêu đề khuyến mãi");
      return;
    }
    if (form.getFieldValue("promotion_code") == null || form.getFieldValue("promotion_code") == '') {
      message.error("Vui lòng nhập mã khuyến mãi");
      return;
    }
    if (form.getFieldValue("description") == null || form.getFieldValue("description") == '') {
      message.error("Vui lòng nhập diễn giải");
      return;
    }
    if (form.getFieldValue("start_date") == null) {
      message.error("Vui lòng chọn ngày bắt đầu khuyến mãi");
      return;
    }
    if (form.getFieldValue("end_date") == null) {
      message.error("Vui lòng chọn ngày kết thúc khuyến mãi");
      return;
    }
    if (form.getFieldValue("start_date") < props.start_date._d || form.getFieldValue("start_date") > props.end_date._d) {
      if (props.start_date._d - form.getFieldValue("start_date")  > 1 || form.getFieldValue("start_date") - props.end_date._d > 1) {
        message.error("Ngày bắt đầu phải trong thời gian chương trình khuyến mãi");
        return;
      }
    }
    if (form.getFieldValue("end_date") < form.getFieldValue("start_date") || form.getFieldValue("end_date") > props.end_date._d) {
      if (form.getFieldValue("start_date") - form.getFieldValue("end_date") > 1 || form.getFieldValue("end_date") - props.end_date._d > 1) {
        message.error("Ngày kết thúc phải trong thời gian chương trình khuyến mãi và trước thời gian bắt đầu");
        return;
      }
    }
    if (!validCode.test(form.getFieldValue("promotion_code"))) {
      message.error("Mã khuyến mãi không hợp lệ! Mã bao gồm 3 ký tự in hoa và 3 ký tự số phía sau (VD: AAA000)");
      return;
    }
    // console.log(form.getFieldValue("title"))
    let sta = "";
    let typ = "";
    if (form.getFieldValue("status") == null) {
      sta = true;
    } else {
      sta = form.getFieldValue("status");
    }
    if (form.getFieldValue("type") == null) {
      typ = 'Product';
    } else {
      typ = form.getFieldValue("type");
    }
    let index = {
      "detail": {
        "quantity_buy": form.getFieldValue("quantity_buy"),
        "quantity_received": form.getFieldValue("quantity_received"),
        "minimum_total": form.getFieldValue("minimum_total"),
        "percent": form.getFieldValue("percent"),
        "maximum_reduction_amount": form.getFieldValue("maximum_reduction_amount"),
        "reduction_amount": form.getFieldValue("reduction_amount"),
        "product_received": form.getFieldValue("product_received"),
        "applicable_products": form.getFieldValue("applicable_products"),
        "applicable_product_groups": form.getFieldValue("applicable_product_groups")
      },
      "title": form.getFieldValue("title"),
      "description": form.getFieldValue("description"),
      "promotion_code": form.getFieldValue("promotion_code"),
      "type": typ,
      "start_date": form.getFieldValue("start_date"),
      "end_date": form.getFieldValue("end_date"),
      "status": sta,
      "max_quantity": form.getFieldValue("max_quantity") == "" ? null : form.getFieldValue("max_quantity"),
      "max_quantity_per_customer": form.getFieldValue("max_quantity_per_customer") == "" ? null : form.getFieldValue("max_quantity_per_customer"),
      "max_quantity_per_customer_per_day": form.getFieldValue("max_quantity_per_customer_per_day") == "" ? null : form.getFieldValue("max_quantity_per_customer_per_day"),
      "note": form.getFieldValue("note"),
      "date_updated": null,
      "promotion": props.id,
      "user_created": null,
      "user_updated": null
    }
    if (typ == 'Product') {
      index.detail.minimum_total = null;
      index.detail.percent = null;
      index.detail.maximum_reduction_amount = null;
      index.detail.reduction_amount = null;

    } else if (typ == "Percent") {
      index.detail.quantity_buy = null;
      index.detail.quantity_received = null;
      index.detail.product_received = null;
      index.detail.applicable_products = [];
      index.detail.applicable_product_groups = [];
      index.detail.reduction_amount = null;
    } else {
      index.detail.quantity_buy = null;
      index.detail.quantity_received = null;
      index.detail.product_received = null;
      index.detail.applicable_products = [];
      index.detail.applicable_product_groups = [];
      index.detail.percent = null;
    }
    console.log(index)
    let kq = false;
    if (is_create == true) {
      kq = await create(index);
    } else {
      let detail = {
        "quantity_buy": form.getFieldValue("quantity_buy"),
        "quantity_received": form.getFieldValue("quantity_received"),
        "minimum_total": form.getFieldValue("minimum_total"),
        "percent": form.getFieldValue("percent"),
        "maximum_reduction_amount": form.getFieldValue("maximum_reduction_amount"),
        "reduction_amount": form.getFieldValue("reduction_amount"),
        "product_received": form.getFieldValue("product_received"),
        "applicable_products": form.getFieldValue("applicable_products"),
        "applicable_product_groups": form.getFieldValue("applicable_product_groups")
      }
      index.detail = detail;
      // console.log(index);
      kq = await update(index);
    }
    if (kq == true) {
      form.resetFields();
      props.setOpen(false);
      props.handleData();
    } else {
    }
  };

  const selectType = (option) => {
    setTypeIndex(option);
    // console.log(typeIndex);
  };

  const handleDataBaseProduct = () => {
    setLoadingData(true);
    const options = props.dataProduct.map(elm => {
      return (
        <Option key={elm.id} value={elm.id}>{elm.name}</Option>
      )
    })
    setBaseProductOptions(options);
  }

  const handleDataBaseGroupProduct = () => {
    setLoadingData(true);
    const options = props.dataGroupProduct.map(elm => {
      return (
        <Option key={elm.id} value={elm.id}>{elm.name}</Option>
      )
    })
    setBaseProductGroupOptions(options)
  }

  return (
    <Drawer
      title="Thêm khuyến mãi"
      width={720}
      onClose={onClose}
      visible={props.open}
      bodyStyle={{
        paddingBottom: 80,
      }}
      extra={
        <Space>
          <Button onClick={onReset} style={{ display: is_create ? 'block' : 'none' }}>Làm mới</Button>
          <Button onClick={onClose}>Thoát</Button>
          <Button onClick={onSaveAndClose} type="primary">
            Lưu
          </Button>
        </Space>
      }
    >
      <Form layout="vertical" hideRequiredMark form={form}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="title"
              label="Tiêu đề"
              rules={[
                {
                  required: true,
                  message: 'Hãy nhập tiêu đề khuyến mãi',
                },
              ]}
            >
              <Input placeholder="Hãy nhập tiêu đề khuyến mãi" />
            </Form.Item>
          </Col>
          <Col span={12}>
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
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="promotion_code"
              label="Mã khuyến mãi"
              rules={[
                {
                  required: true,
                  message: 'Hãy nhập mã khuyến mãi',
                },
              ]}
            >
              <Input placeholder='Hãy nhập mã khuyến mãi'
              />
            </Form.Item>
          </Col>
          <Col span={12}>
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
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="description"
              label="Diễn giải"
              rules={[
                {
                  required: true,
                  message: 'Hãy nhập diễn giải',
                },
              ]}
            >
              <Input placeholder='Hãy nhập diễn giải'
              />
            </Form.Item>

          </Col>
          <Col span={12}>
            <Form.Item
              name="status"
              label="Trạng thái"

            >
              <Select defaultValue='true'>
                <Option value="true">Hoạt động</Option>
                <Option value="false">Khóa</Option>
              </Select>
            </Form.Item>

          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="max_quantity"
              label="Số lượng tối đa áp dụng"
            // rules={[
            //   {
            //     required: true,
            //     message: 'Hãy nhập số lượng tối đa',
            //   },
            // ]}
            >
              <Input type='number' min='0' placeholder="Hãy nhập số lượng tối đa áp dụng" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="max_quantity_per_customer"
              label="Số lượng tối đa cho 1 khách"
            // rules={[
            //   {
            //     required: true,
            //     message: 'Hãy nhập số lượng tối đa cho 1 khách',
            //   },
            // ]}
            >
              <Input type='number' min='0' placeholder="Hãy nhập số lượng tối đa cho 1 khách" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="type"
              label="Loại khuyến mãi"
            >
              <Select defaultValue='Product' onChange={(option) => selectType(option)}>
                <Option value="Percent">Chiết khấu</Option>
                <Option value="Product">Sản phẩm</Option>
                <Option value="Fixed">Tiền</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="max_quantity_per_customer_per_day"
              label="Số lượng tối đa cho 1 khách trong 1 ngày"
            // rules={[
            //   {
            //     required: true,
            //     message: 'Hãy nhập số lượng tối đa cho 1 khách',
            //   },
            // ]}
            >
              <Input type='number' min='0' placeholder="Hãy nhập số lượng tối đa cho 1 khách trong 1 ngày" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="note"
              label="Ghi chú"
            // rules={[
            //   {
            //     required: true,
            //     message: 'Hãy nhập số lượng tối đa',
            //   },
            // ]}
            >
              <Input placeholder="Hãy nhập ghi chú" />
            </Form.Item>
          </Col>
        </Row>

        <label><h2 style={{ marginTop: '10px', marginBottom: '30px', textAlign: 'left' }}>Khuyến mãi</h2></label>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name='applicable_product_groups' label='Nhóm sản phẩm áp dụng'
              style={{ display: typeIndex == 'Product' ? 'block' : "" || typeIndex == 'Fixed' ? 'none' : "" || typeIndex == 'Percent' ? 'none' : "" }}
            // rules={[
            //   {
            //     required: true,
            //     message: 'Chọn nhóm sản phẩm áp dụng!',
            //   },
            // ]}
            >
              <Select
                mode="multiple"
                placeholder="Chọn nhóm sản phẩm áp dụng"
                allowClear
                onClick={() => handleDataBaseGroupProduct()}
                style={{
                  // width: 150,
                }}
                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
              >
                {baseProductGroupOptions}
              </Select>
            </Form.Item>
            <Form.Item
              name='minimum_total' label='Số tiền ít nhất để được khuyến mãi'
              style={{ display: typeIndex == 'Product' ? 'none' : "" || typeIndex == 'Fixed' ? 'block' : "" || typeIndex == 'Percent' ? 'block' : "" }}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập tiền ít nhất!',
                },
              ]}
            >
              <Input placeholder="Số tiền ít nhất" type='number' min='0' disabled={is_create ? false : true} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='applicable_products' label='Sản phẩm áp dụng'
              style={{ display: typeIndex == 'Product' ? 'block' : "" || typeIndex == 'Fixed' ? 'none' : "" || typeIndex == 'Percent' ? 'none' : "" }}
              rules={[
                {
                  required: true,
                  message: 'Chọn sản phẩm áp dụng!',
                },
              ]}
            >
              <Select
                mode="multiple"
                placeholder="Chọn sản phẩm áp dụng"
                allowClear
                onClick={() => handleDataBaseProduct()}
                style={{
                  // width: 150,
                }}
                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
              >
                {baseProductOptions}
              </Select>
            </Form.Item>
            <Form.Item
              name='reduction_amount' label='Số tiền giảm giá'
              style={{ display: typeIndex == 'Product' ? 'none' : "" || typeIndex == 'Fixed' ? 'block' : "" || typeIndex == 'Percent' ? 'none' : "" }}
              rules={[
                {
                  required: true,
                  message: 'Nhập số lượng tiển giảm giá!',
                },
              ]}
            >
              <Input placeholder="Số lượng giảm giá" type='number' min='0' disabled={is_create ? false : true} />
            </Form.Item>
            <Form.Item
              name='percent' label='Chiết khấu'
              style={{ display: typeIndex == 'Product' ? 'none' : "" || typeIndex == 'Fixed' ? 'none' : "" || typeIndex == 'Percent' ? 'block' : "" }}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập chiết khấu!',
                },
              ]}
            >
              <Input placeholder="Số chiết khấu" type='number' min='0' disabled={is_create ? false : true} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name='quantity_buy' label='Số lượng mua'
              style={{ display: typeIndex == 'Product' ? 'block' : "" || typeIndex == 'Fixed' ? 'none' : "" || typeIndex == 'Percent' ? 'none' : "" }}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập số lượng mua!',
                },
              ]}
            >
              <Input placeholder="Số lượng mua" type='number' min='0' disabled={is_create ? false : true} />
            </Form.Item>

            <Form.Item
              name='maximum_reduction_amount' label='Số tiền giảm tối đa'
              style={{ display: typeIndex == 'Product' ? 'none' : "" || typeIndex == 'Fixed' ? 'none' : "" || typeIndex == 'Percent' ? 'block' : "" }}
              rules={[
                {
                  required: true,
                  message: 'Nhập số tiền giảm tối đa!',
                },
              ]}
            >
              <Input placeholder="Số tiền giảm tối đa" type='number' min='0' disabled={is_create ? false : true} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='product_received' label='Sản phẩm khuyến mãi'
              style={{ display: typeIndex == 'Product' ? 'block' : "" || typeIndex == 'Fixed' ? 'none' : "" || typeIndex == 'Percent' ? 'none' : "" }}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn sản phẩm nhận!',
                },
              ]}
            >
              <Select
                showSearch
                onClick={() => handleDataBaseProduct()}
                style={{
                  // width: 150,
                }}
                placeholder="Chọn sản phẩm nhận"
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
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name='quantity_received' label="Số lượng khuyến mãi"
              style={{ display: typeIndex == 'Product' ? 'block' : "" || typeIndex == 'Fixed' ? 'none' : "" || typeIndex == 'Percent' ? 'none' : "" }}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập số lượng nhân!',
                },
              ]}
            >
              <Input placeholder="Số lượng nhận" type='number' min='0' disabled={is_create ? false : true} />
            </Form.Item>
          </Col>
          <Col span={12}>

          </Col>
        </Row>

        {/* <Form.List name="detail" label="Bảng khuyến mãi">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{
                    display: 'block',
                    marginBottom: 10,
                    width: '100%'
                  }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name, 'applicable_product_groups']}
                    style={{ display: typeIndex == 'product' ? 'block' : "" || typeIndex == 'voucher' ? 'none' : "" || typeIndex == 'percent' ? 'block' : "" }}
                    rules={[
                      {
                        required: true,
                        message: 'Chọn nhóm sản phẩm áp dụng!',
                      },
                    ]}
                  >
                    <Select
                      mode="multiple"
                      placeholder="Chọn nhóm sản phẩm áp dụng"
                      allowClear
                      onClick={() => handleDataBaseGroupProduct()}
                      style={{
                        // width: 150,
                      }}
                      filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                    >
                      {baseProductGroupOptions}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'applicable_products']}
                    style={{ display: typeIndex == 'product' ? 'block' : "" || typeIndex == 'voucher' ? 'none' : "" || typeIndex == 'percent' ? 'block' : "" }}
                    rules={[
                      {
                        required: true,
                        message: 'Chọn sản phẩm áp dụng!',
                      },
                    ]}
                  >
                    <Select
                      mode="multiple"
                      placeholder="Chọn sản phẩm áp dụng"
                      allowClear
                      onClick={() => handleDataBaseProduct()}
                      style={{
                        // width: 150,
                      }}
                      filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                    >
                      {baseProductOptions}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'percent']}
                    style={{ display: typeIndex == 'product' ? 'none' : "" || typeIndex == 'voucher' ? 'none' : "" || typeIndex == 'percent' ? 'block' : "" }}
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập chiết khấu!',
                      },
                    ]}
                  >
                    <Input placeholder="Số chiết khấu" type='number' min='0' disabled={is_create ? false : true} />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'quantity_buy']}
                    style={{ display: typeIndex == 'product' ? 'block' : "" || typeIndex == 'voucher' ? 'none' : "" || typeIndex == 'percent' ? 'none' : "" }}
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập số lượng mua!',
                      },
                    ]}
                  >
                    <Input placeholder="Số lượng mua" type='number' min='0' disabled={is_create ? false : true} />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'product']}
                    style={{ display: typeIndex == 'product' ? 'block' : "" || typeIndex == 'voucher' ? 'none' : "" || typeIndex == 'percent' ? 'block' : "" }}
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng chọn sản phẩm nhận!',
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      onClick={() => handleDataBaseProduct()}
                      style={{
                        // width: 150,
                      }}
                      placeholder="Chọn sản phẩm nhận"
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
                    name={[name, 'quantity_received']}
                    style={{ display: typeIndex == 'product' ? 'block' : "" || typeIndex == 'voucher' ? 'none' : "" || typeIndex == 'percent' ? 'none' : "" }}
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập số lượng nhân!',
                      },
                    ]}
                  >
                    <Input placeholder="Số lượng nhận" type='number' min='0' disabled={is_create ? false : true} />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'minimum_total']}
                    style={{ display: typeIndex == 'product' ? 'none' : "" || typeIndex == 'voucher' ? 'block' : "" || typeIndex == 'percent' ? 'none' : "" }}
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập tiền ít nhất!',
                      },
                    ]}
                  >
                    <Input placeholder="Số tiền ít nhất" type='number' min='0' disabled={is_create ? false : true} />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'reduction_amount']}
                    style={{ display: typeIndex == 'product' ? 'none' : "" || typeIndex == 'voucher' ? 'block' : "" || typeIndex == 'percent' ? 'none' : "" }}
                    rules={[
                      {
                        required: true,
                        message: 'Nhập số lượng tiển giảm giá!',
                      },
                    ]}
                  >
                    <Input placeholder="Số lượng giảm giá" type='number' min='0' disabled={is_create ? false : true} />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'maximum_reduction_amount']}
                    style={{ display: typeIndex == 'product' ? 'none' : "" || typeIndex == 'voucher' ? 'block' : "" || typeIndex == 'percent' ? 'none' : "" }}
                    rules={[
                      {
                        required: true,
                        message: 'Nhập số tiền giảm tối đa!',
                      },
                    ]}
                  >
                    <Input placeholder="Số tiền giảm tối đa" type='number' min='0' disabled={is_create ? false : true} />
                  </Form.Item>
                  <Popconfirm
                    placement="bottomRight"
                    title="Xác nhận xóa khuyến mãi này"
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
              <Row>
                <Form.Item style={{ width: '170px', margin: 'auto' }}>
                  <Button type="dashed" disabled={is_create ? false : true} onClick={() => add()} block icon={<PlusOutlined />} >
                    Thêm khuyến mãi
                  </Button>
                </Form.Item>
              </Row>
            </>
          )}
        </Form.List> */}
      </Form>
    </Drawer>
  );
};
export default PromotionLineModal;