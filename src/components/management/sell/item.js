import {
    PlusOutlined, EditOutlined, DeleteOutlined, HistoryOutlined,
    LoadingOutlined, MinusCircleOutlined, TagOutlined
} from '@ant-design/icons';
import React, { useRef, useState } from 'react';
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
    const [productData, setProductData] = useState()
    const [openPopover, setOpenPopover] = useState([])

    const onSelectProduct = async (product_id, add) => {
        const response = await api.product.get(product_id)
        console.log(response.data.data)
        if (response.data.code == 1) {
            setProductData(response.data.data)
            add({
                product: response.data.data.name,
                unit_exchange: response.data.data.base_unit.id,
                price: response.data.data.price_detail.price
            })
            const _open = [...openPopover, false]
            setOpenPopover(_open)
        } else {
            message.error(messages.ERROR_REFRESH)
        }
    }

    return (
        <Form.List name="units" label="Đơn vị tính quy đổi">
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
                                        {props.baseUnitOptions}
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
                                    <Input type="number" placeholder="Số lượng" defaultValue={1} />
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
                                    onOpenChange={() => {}}
                                >
                                    <TagOutlined
                                        twoToneColor="#eb2f96"
                                        style={{ marginRight: 10 }}/>
                                </Popover>
                                <MinusCircleOutlined onClick={() => remove(name)} />
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
    );
};

export default OrderItem;