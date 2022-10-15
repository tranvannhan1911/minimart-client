import {
    PlusOutlined, EditOutlined, DeleteOutlined, HistoryOutlined,
    LoadingOutlined, MinusCircleOutlined, TagOutlined
} from '@ant-design/icons';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Select, message, Space, Popconfirm, Upload, Row, Col, Checkbox, Typography, Popover, Modal } from 'antd';
import ProductSelect from '../barcode/input';
import api from '../../../api/apis';
import messages from '../../../utils/messages';
import PromotionPicker from './promotion/modal';
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

    const [openPromotionPicker, setOpenPromotionPicker] = useState(false);
    const [form] = Form.useForm();
    const [formQuantity] = Form.useForm();
    const [productData, setProductData] = useState([])
    const [total, setTotal] = useState(0)
    const [numberDe, setNumberDe] = useState(0)
    const [openPopover, setOpenPopover] = useState([])
    const [baseUnitOptions, setBaseUnitOptions] = useState([])
    const [idProduct, setIdProduct] = useState(0);
    const [currentProduct, setCurrentProduct] = useState();
    const [currentQuantity, setCurrentQuantity] = useState(0);
    const [currentNameForm, setCurrentNameForm] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [plProduct, setPlProduct] = useState();
    const quantityBuy = useRef();

    const showModal = () => {
        setIsModalOpen(true);
        setTimeout(() => {
            quantityBuy.current.focus();
        }, 500);

    };

    const handleOk = () => {
        setIsModalOpen(false);
        enterQuantity(formQuantity.getFieldValue("quantityBuy"));

    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

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
            if (response.data.code == 1) {
                var base_unit_exchange = "";
                var price_base_unit;
                response.data.data.units.forEach(element => {
                    if (element.is_base_unit == true) {
                        base_unit_exchange = element.id;
                        price_base_unit = element.price
                    }
                });
                calculateTotalAddProduct(price_base_unit)
                let index = {
                    key: numberDe,
                    id: response.data.data.id,
                    product: response.data.data.name,
                    // unit_exchange: response.data.data.base_unit.id,
                    // price: response.data.data.price_detail.price
                    quantity_base_unit: 1,
                    stock: response.data.data.stock,
                    unit_exchange: base_unit_exchange,
                    unit_exchange_value: 1,
                    price: price_base_unit,
                    total: price_base_unit,
                    promotion_line: null // default 
                };
                setNumberDe(numberDe + 1);
                setCurrentProduct(index)
                setCurrentQuantity(1)
                setCurrentNameForm(productData.length)
                const options = response.data.data.units.map(elm => {
                    elm.unit_exchange_value = elm.value
                    delete elm.value
                    return (
                        <Option key={elm.id} value={elm.id} {...elm}>{elm.unit_name}</Option>
                    )
                })
                setBaseUnitOptions([...baseUnitOptions, options]);
                add(index);
                setProductData([...productData, index])
                const _open = [...openPopover, false]
                setOpenPopover(_open)
                sendListProduct(form.getFieldValue("productlist"))
                showModal()
                setIdProduct(product_id);
            } else {
                message.error(messages.ERROR_REFRESH)
            }
        }
    }

    const changeUnitExchange = (item, name, key) => {
        const _productlist = form.getFieldValue("productlist")
        _productlist[name].price = item.price
        _productlist[name].total = item.price * _productlist[name].quantity
        _productlist[name].unit_exchange_value = item.unit_exchange_value
        _productlist[name].quantity_base_unit = _productlist[name].unit_exchange_value * _productlist[name].quantity
        updateQuantity(_productlist[name].quantity, name)
        form.setFieldValue("productlist", _productlist);
        calculateTotalAmount(_productlist);
        sendListProduct(_productlist);
    }

    const enterQuantity = () => {
        // addProduct(idProduct, value)
        formQuantity.setFieldValue("quantityBuy", 1);
        const value = quantityBuy.current.input.value
        setIsModalOpen(false)
        var name = 0
        form.getFieldValue("productlist").map(element => {
            if (element.id == idProduct) {
                updateQuantity(Number(value), name)
            }
            name++
        });
        form.setFieldValue("productlist", form.getFieldValue("productlist"));
        calculateTotalAmount(form.getFieldValue("productlist"));
        sendListProduct(form.getFieldValue("productlist"));
    }

    const updateQuantityById = (id) => {
        var name = 0
        form.getFieldValue("productlist").map(element => {
            if (element.id == id) {
                updateQuantity(Number(element.quantity) + 1, name)
            }
            name++
        });
        // form.setFieldValue("productlist", form.getFieldValue("productlist"));
        // calculateTotalAmount(form.getFieldValue("productlist"));
        // sendListProduct(form.getFieldValue("productlist"));
    }

    const updateQuantity = (sl, name) => {
        // console.log(key);
        // form.getFieldValue("productlist")[key-numberDe].total = sl * form.getFieldValue("productlist")[key-numberDe].price;
        // form.setFieldValue("productlist", form.getFieldValue("productlist"));
        // calculateTotalAmount(form.getFieldValue("productlist"));
        // sendListProduct(form.getFieldValue("productlist"));
        const productlist = form.getFieldValue("productlist")
        const quantity_base_unit = sl * productlist[name].unit_exchange_value;
        console.log("sl", sl, productlist[name].unit_exchange_value, quantity_base_unit)
        console.log(productlist[name])
        
        if (Number(quantity_base_unit) <= Number(productlist[name].stock)) {
            productlist[name].quantity = sl;
            productlist[name].total = Number(productlist[name].quantity) * Number(productlist[name].price);
            productlist[name].quantity_base_unit = quantity_base_unit;
        } else {
            message.error("Số sản phẩm mua lớn hơn số lượng tồn, còn lại "+productlist[name].stock);
            productlist[name].quantity = Math.floor(productlist[name].stock / productlist[name].unit_exchange_value);
            productlist[name].total = Number(productlist[name].quantity) * Number(productlist[name].price);
            productlist[name].quantity_base_unit = productlist[name].quantity * productlist[name].unit_exchange_value;
        }
        console.log(productlist[name])
        form.setFieldValue("productlist", productlist);
        calculateTotalAmount(form.getFieldValue("productlist"));
        sendListProduct(form.getFieldValue("productlist"));

        setCurrentProduct(productlist[name])
        setCurrentQuantity(productlist[name].quantity_base_unit)
        setCurrentNameForm(name)
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
        let dataa = [];
        data.forEach(element => {
            if (element.price != 0) {
                dataa.push(element)
            }
        });
        // props.parentCallbackListProductAndPromotion(data);
        props.parentCallbackListProduct(dataa);
    }

    const checkPromotion = async (idCustomer, idProduct) => {
        const response = await api.promotion_line.listPromotionByProduct(idProduct, idCustomer);
        console.log(123, response);
    }

    const handleOpenPromotionPicker = (product, quantity) => {
        setCurrentProduct(product)
        setOpenPromotionPicker(true)
        setCurrentQuantity(quantity)
    }

    useEffect(() => {
        autoPickPromotion()
    }, [currentQuantity])
    
    const autoPickPromotion = async () => {
        console.log("autoPickPromotion", currentProduct, currentQuantity)
        if(currentProduct && !currentProduct.promotion_line){ // chưa áp dụng mã
            const params = {
                params: {
                    product_id: currentProduct.id,
                    customer_id: props.customerId,
                    quantity: Number(currentQuantity)
                }
            }
            const response = await api.promotion_line.by_product(params)
            console.log("autoPickPromotion", response)
            if (response.data.code == 1){
                for(var i=0; i<response.data.data.count; i++){
                    if(response.data.data.results[i].actual_received > 0){
                        pickPromotionProduct(response.data.data.results[i])
                        return
                    }
                }
                
            }
        }

        if(currentProduct && currentProduct.promotion_line){ // đã áp dụng mã
            const params = {
                params: {
                    product_id: currentProduct.id,
                    customer_id: props.customerId,
                    quantity: Number(currentQuantity)
                }
            }
            const response = await api.promotion_line.by_product(params)
            console.log("autoPickPromotion", response)
            if (response.data.code == 1){
                const _pl = response.data.data.results
                for(var i=0; i<_pl.length; i++){
                    if(currentProduct.promotion_line.id == _pl.id){
                        if(response.data.data.results[i].actual_received > 0){
                            pickPromotionProduct(response.data.data.results[i])
                        }else{
                            removePromotionByProductId(currentProduct.id)
                        }
                        return
                    }
                }
                
            }
        }
        
    }

    const pickPromotionProduct = (pl) => {
        const _productlist = form.getFieldValue("productlist")
        _productlist[currentNameForm].promotion_line = pl.id
        var base_unit_exchange = "";
        pl.detail.product_received.units.forEach(element => {
            if (element.is_base_unit == true) {
                base_unit_exchange = element.id;
            }
        });
        removePromotionByProductId(_productlist[currentNameForm].id)
        let index = {
            key: numberDe,
            // id: pl.detail.product_received.id,
            id: 10000000,
            product: pl.detail.product_received.name,
            quantity: pl.actual_received,
            quantity_base_unit: pl.actual_received,
            stock: pl.detail.product_received.stock,
            unit_exchange: base_unit_exchange,
            unit_exchange_value: 1,
            price: 0,
            total: 0,
            promotion_line: null, // default 
            promotion_by_product_id: _productlist[currentNameForm].id
        };
        const options = pl.detail.product_received.units.map(elm => {
            elm.unit_exchange_value = elm.value
            delete elm.value
            return (
                <Option key={elm.id} value={elm.id} {...elm}>{elm.unit_name}</Option>
            )
        })
        setBaseUnitOptions([...baseUnitOptions, options]);
        setNumberDe(numberDe + 1);


        const _productData = [..._productlist, index]

        setProductData(_productData);
        form.setFieldValue("productlist", _productData);
        sendListProduct(_productData);
    }

    const findPromotionByProductId = (product_id) => {
        const productlist = form.getFieldValue("productlist")
        for(var i=0; i<productlist.length; i++){
            if(productlist[i].promotion_by_product_id == product_id)
                return i;
        }
        return null;
    }

    const removePromotionByProductId = (product_id) => {
        const idx = findPromotionByProductId(product_id)
        if(idx){
            const productlist = form.getFieldValue("productlist")
            productlist.splice(idx, 1)
            form.setFieldValue("productlist", productlist);
        }
    }

    return (
        <><Form layout="vertical" hideRequiredMark form={form} disabled={props.disabledCreateOrder}>
            <Form.List name="productlist" label="Sanpham">
                {(fields, { add, remove }) => (
                    <>
                        <Form.Item>
                            <ProductSelect
                                onSelectProduct={(value) => onSelectProduct(value, add)}
                                sellable={true} />
                            {/* <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
            Thêm đơn vị tính
        </Button> */}
                        </Form.Item>
                        <Row style={{ textAlign: 'left', marginBottom: '10px' }}>
                            <Col style={titleCol} span={7}>
                                <Typography.Text>Sản phẩm</Typography.Text>
                            </Col>
                            <Col style={titleCol} span={4}>
                                <Typography.Text>Đơn vị</Typography.Text>
                            </Col>
                            <Col style={titleCol} span={4}>
                                <Typography.Text>Giá</Typography.Text>
                            </Col>
                            <Col style={titleCol} span={3}>
                                <Typography.Text>Số lượng</Typography.Text>
                            </Col>
                            <Col style={titleCol} span={4}>
                                <Typography.Text>Thành tiền</Typography.Text>
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
                                            onSelect={(key, item) => {
                                                console.log(item)
                                                changeUnitExchange(item, name, key)

                                            }}
                                            disabled={productData[name].promotion_by_product_id ? true : false}
                                        >
                                            {baseUnitOptions[name]}
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
                                        style={{ display: 'none' }}
                                        {...restField}
                                        name={[name, 'quantity_base_unit']}
                                    >
                                        <Input type="hidden" />
                                    </Form.Item>
                                    <Form.Item
                                        style={{ display: 'none' }}
                                        {...restField}
                                        name={[name, 'unit_exchange_value']}
                                    >
                                        <Input type="hidden" />
                                    </Form.Item>
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
                                        <Input
                                            type="number"
                                            placeholder="Số lượng"
                                            defaultValue={1}
                                            min='1'
                                            onChange={(e) => {
                                                updateQuantity(e.target.value, name)
                                            }}
                                            disabled={productData[name].promotion_by_product_id ? true : false} />
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

                                    <Form.Item
                                        style={{ display: 'none' }}
                                        {...restField}
                                        name={[name, 'promotion_line']}
                                    >
                                        <Input type="hidden" />
                                    </Form.Item>
                                    
                                    <Form.Item
                                        style={{ display: 'none' }}
                                        {...restField}
                                        name={[name, 'promotion_by_product_id']}
                                    >
                                        <Input type="hidden" />
                                    </Form.Item>
                                    {productData[name].promotion_by_product_id ? null :
                                        <>
                                            <TagOutlined
                                                twoToneColor="#eb2f96"
                                                style={{ marginRight: 10 }}
                                                onClick={() => {
                                                    
                                                    if (productData[name].promotion_by_product_id)
                                                        return

                                                    console.log("dataform", form.getFieldValue("productlist")[name])
                                                    setIdProduct(form.getFieldValue("productlist")[name].id)
                                                    const _quantity = form.getFieldValue("productlist")[name]["quantity_base_unit"]
                                                    setCurrentNameForm(name)
                                                    handleOpenPromotionPicker(form.getFieldValue("productlist")[name], _quantity)
                                                }} />
                                            <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => {
                                                removePromotionByProductId(form.getFieldValue("productlist")[name].id)
                                                remove(name);
                                                updateTotalDelete();
                                                var _baseUnitOptions = [...baseUnitOptions]
                                                _baseUnitOptions.splice(name, 1)
                                                setBaseUnitOptions(_baseUnitOptions)
                                            }}>
                                                <MinusCircleOutlined />
                                            </Popconfirm>
                                        </>
                                    }
                                    
                                    {/* <MinusCircleOutlined onClick={() => remove(name)} /> */}
                                </Col>
                                {/* </Space> */}
                            </Row>
                        ))}

                    </>
                )}
            </Form.List>
        </Form>
            <Modal title="Số lượng mua" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Form layout="vertical" hideRequiredMark form={formQuantity}>
                    <Form.Item name='quantityBuy'
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập số lượng mua!',
                            },
                        ]}>
                        <Input
                            placeholder='Số lượng mua'
                            ref={quantityBuy}
                            onPressEnter={(e) => enterQuantity()}
                            defaultValue={1} ></Input>
                    </Form.Item>
                </Form>
            </Modal>

            <PromotionPicker
                open={openPromotionPicker}
                setOpen={setOpenPromotionPicker}
                onFinish={(pl) => pickPromotionProduct(pl)}
                customerId={props.customerId}
                product={currentProduct}
                quantity={currentQuantity}
                type="Product" />
        </>
    );
};

export default OrderItem;