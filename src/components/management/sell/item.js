import {
    PlusOutlined, EditOutlined, DeleteOutlined, HistoryOutlined,
    LoadingOutlined, MinusCircleOutlined, TagOutlined
} from '@ant-design/icons';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Select, message, Space, Popconfirm, Upload, Row, Col, Checkbox, Typography, Popover } from 'antd';
import ProductSelect from '../barcode/input';
import api from '../../../api/apis';
import messages from '../../../utils/messages';
const { Option } = Select;
const { Title } = Typography;

const col = {
    padding: '0 5px'
}

const titleCol = {
    paddingLeft: '11px',
    fontWeight: 500
}


const OrderItem = (props) => {

    const [form] = Form.useForm();
    const [productData, setProductData] = useState([])
    const [total, setTotal] = useState(0)
    const [numberDe, setNumberDe] = useState(0)
    const [openPopover, setOpenPopover] = useState([])
    const [baseUnitOptions, setBaseUnitOptions] = useState([])

    useEffect(() => {
        if (props.is_reset == true) {
            form.resetFields();
            setProductData([]);
            setTotal(0);
            if (numberDe > 1) {
                setNumberDe(0);
            }
            else {
                setNumberDe(0);
            }
            props.parentCallbackReset("false");
        }
    }, [props.is_reset]);

    const onSelectProduct = async (product_id, add) => {
        let i = 0;
        productData.forEach(element => {
            if (element.id == product_id) {
                updateQuantityById(product_id);
                i++;
            }
        });
        if (i == 0) {
            const response = await api.product.get(product_id)
            // console.log(response.data.data)
            if (response.data.code == 1) {
                let unit = "";
                response.data.data.units.forEach(element => {
                    if (element.is_base_unit == true) {
                        unit = element.id;
                    }
                });
                calculateTotalAddProduct(10000)
                let index = {
                    key: numberDe,
                    id: response.data.data.id,
                    product: response.data.data.name,
                    // unit_exchange: response.data.data.base_unit.id,
                    // price: response.data.data.price_detail.price
                    unit_exchange: unit,
                    price: 10000,
                    total: 10000
                };
                setNumberDe(numberDe + 1);
                const options = response.data.data.units.map(elm => {
                    return (
                        <Option key={elm.id} value={elm.id}>{elm.unit_name}</Option>
                    )
                })
                setBaseUnitOptions(options);
                add(index);
                setProductData([...productData, index])
                const _open = [...openPopover, false]
                setOpenPopover(_open)
                sendListProduct(form.getFieldValue("productlist"))
            } else {
                message.error(messages.ERROR_REFRESH)
            }
        }
    }

    const updateQuantityById = (id) => {
        form.getFieldValue("productlist").map(element => {
            if (element.id == id) {
                if (element.quantity == null) {
                    element.total = Number(element.total) + Number(element.price);
                    element.quantity = 2;
                } else {
                    element.total = Number(element.total) + Number(element.price);
                    element.quantity = Number(element.quantity) + 1;
                }
            }
        });
        form.setFieldValue("productlist", form.getFieldValue("productlist"));
        calculateTotalAmount(form.getFieldValue("productlist"));
        sendListProduct(form.getFieldValue("productlist"));
    }

    const updateQuantity = (sl, key) => {
        // console.log(key);
        // form.getFieldValue("productlist")[key-numberDe].total = sl * form.getFieldValue("productlist")[key-numberDe].price;
        // form.setFieldValue("productlist", form.getFieldValue("productlist"));
        // calculateTotalAmount(form.getFieldValue("productlist"));
        // sendListProduct(form.getFieldValue("productlist"));
        form.getFieldValue("productlist").map(element => {
            if (element.key == key) {
                element.total = Number(sl) * Number(element.price);

            }

        });
        form.setFieldValue("productlist", form.getFieldValue("productlist"));
        calculateTotalAmount(form.getFieldValue("productlist"));
        sendListProduct(form.getFieldValue("productlist"));
    }

    const updateTotalDelete = () => {
        let tong = 0;
        form.getFieldValue("productlist").forEach(element => {
            tong += Number(element.total);
        });

        setTotal(tong);
        // console.log(tong);
        sendTotal(tong);
        sendListProduct(form.getFieldValue("productlist"));
        setProductData(form.getFieldValue("productlist"));
        // form.setFieldValue("productlist", productData);
        // 
    }

    const calculateTotalAmount = (data) => {
        let tong = 0;
        data.forEach(element => {
            tong += Number(element.total);
        });
        setTotal(tong);
        // console.log(tong);
        sendTotal(tong);
    };

    const calculateTotalAddProduct = (data) => {
        let tong = total + Number(data);
        setTotal(tong);
        // console.log(tong);
        sendTotal(tong);
    };

    const sendTotal = (total) => {
        props.parentCallbackTotal(total);
    }

    const sendListProduct = (data) => {
        props.parentCallbackListProduct(data);
    }

    return (
        <Form layout="vertical" hideRequiredMark form={form}>
            <Form.List name="productlist" label="Sanpham">
                {(fields, { add, remove }) => (
                    <>
                        <Row style={{ textAlign: 'left', marginBottom: '10px' }}>
                            <Col style={titleCol} span={7}>
                                <Typography.Text >Sản phẩm</Typography.Text>
                            </Col>
                            <Col style={titleCol} span={4}>
                                <Typography.Text >Đơn vị</Typography.Text>
                            </Col>
                            <Col style={titleCol} span={4}>
                                <Typography.Text >Giá</Typography.Text>
                            </Col>
                            <Col style={titleCol} span={3}>
                                <Typography.Text >Số lượng</Typography.Text>
                            </Col>
                            <Col style={titleCol} span={4}>
                                <Typography.Text >Thành tiền</Typography.Text>
                            </Col>
                            <Col span={2}></Col>
                        </Row>
                        {fields.map(({ key, name, ...restField }) => (
                            <Row>
                                {/* <Space
                            key={key}
                            style={{
                                display: 'flex',
                                marginBottom: 0,
                            }}
                            align="baseline"
                        > */}
                                <Col span={7} style={{ paddingRight: '5px' }}>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'product']}
                                        style={{
                                            textAlign: 'left'
                                        }}
                                    >
                                        <Input
                                            disabled={true}
                                            placeholder="Sản phẩm"
                                            className='inputDisableText' />
                                    </Form.Item>
                                </Col>
                                <Col span={4} style={col}>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'unit_exchange']}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng chọn đơn vị tính',
                                            },
                                        ]}
                                    >
                                        <Select
                                            showSearch
                                            style={{
                                                textAlign: 'left',
                                            }}
                                            placeholder="Đơn vị tính"
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.children.includes(input)}
                                        // filterSort={(optionA, optionB) =>
                                        //     optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                        // }
                                        >
                                            {baseUnitOptions}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={4} style={col}>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'price']}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Giá bán không được để trống',
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder="Giá"
                                            disabled={true}
                                            className='inputDisableText' />
                                    </Form.Item>
                                </Col>
                                <Col span={3} style={col}>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'quantity']}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Số lượng không được bỏ trống',
                                            },
                                        ]}
                                    >
                                        <Input type="number" placeholder="Số lượng" defaultValue={1} min='1' onChange={(e) => updateQuantity(e.target.value, key)} />
                                    </Form.Item>
                                </Col>
                                <Col span={4} style={col}>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'total']}
                                    >
                                        <Input placeholder="Thành tiền" disabled={true}
                                            className='inputDisableText' />
                                    </Form.Item>
                                </Col>
                                <Col span={2}>
                                    <Popover
                                        content={
                                            <div>
                                                <div className='sb'>
                                                    <span>Mã KM</span>
                                                    <span>9818128128</span>
                                                </div>
                                                <div className='sb'>
                                                    <span>Chi tiết</span>
                                                    <span>Mua 5 tặng 1</span>
                                                </div>
                                                <div>
                                                    <span>Được tặng 2 gói netcafe</span>
                                                </div>
                                            </div>
                                        }
                                        title="Khuyến mãi tặng sản phẩm"
                                        trigger="click"
                                        onOpenChange={() => { }}
                                    >
                                        <TagOutlined
                                            twoToneColor="#eb2f96"
                                            style={{ marginRight: 10 }} />
                                    </Popover>
                                    <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => { remove(name); updateTotalDelete() }}>
                                        <MinusCircleOutlined />
                                    </Popconfirm>
                                    {/* <MinusCircleOutlined onClick={() => remove(name)} /> */}
                                </Col>
                                {/* </Space> */}
                            </Row>
                        ))}
                        <Form.Item>
                            <ProductSelect onSelectProduct={(value) => onSelectProduct(value, add)} />
                            {/* <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                            Thêm đơn vị tính
                        </Button> */}
                        </Form.Item>
                    </>
                )}
            </Form.List>
        </Form>
    );
};

export default OrderItem;