import { Button, Drawer, Input, List, Typography  } from 'antd';
import React, { useEffect, useState } from 'react';
import api from '../../../../api/apis';
import { formater } from '../../../../utils/util';
const { Search } = Input;
const { Text } = Typography;

// const data = [
//     {
//         title: 'Ant Design Title 1',
//     },
//     {
//         title: 'Ant Design Title 2',
//     },
//     {
//         title: 'Ant Design Title 3',
//     },
//     {
//         title: 'Ant Design Title 4',
//     },
// ];

const PromotionPicker = (props) => {
    const [placement, setPlacement] = useState('right');
    const [data, setData] = useState([]);
    const [stableData, setStableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchValue, setSearchValue] = useState("");

    const showDrawer = () => {
        props.setOpen(true);
    };

    const onChange = (e) => {
        setPlacement(e.target.value);
    };

    const onClose = () => {
        props.setOpen(false);
    };

    useEffect(() => {
        if(props.type == "Order"){
            handlePromotionLineByTypeOrder()
        }
        if(props.type == "Product"){
            if (props.product)
                handlePromotionLineByTypeProduct()
        }
    }, [props.customerId])

    useEffect(() => {
        handlePromotionLineByTypeOrder()
    }, [props.totalProduct])

    useEffect(() => {
        if (props.product)
            handlePromotionLineByTypeProduct()
    }, [props.product])

    
    const handlePromotionLineByTypeOrder = async () => {
        setLoading(true)
        try{
            const params = {
                params: {
                    type: "Order",
                    customer_id: props.customerId,
                    amount: props.totalProduct
                }
            }
            const response = await api.promotion_line.by_type(params)
            // console.log("handlePromotionLineByTypeOrder", response)
            setData(response.data.data.results)
            setStableData(response.data.data.results)
        }catch{
            
        }
        
        setLoading(false)
    }

    const handlePromotionLineByTypeProduct = async () => {
        setLoading(true)
        // try{
            const params = {
                params: {
                    product_id: props.product.id,
                    customer_id: props.customerId,
                    quantity: Number(props.quantity)
                }
            }
            const response = await api.promotion_line.by_product(params)
            setData(response.data.data.results)
            setStableData(response.data.data.results)
        // }catch{
            
        // }
        
        setLoading(false)
    }

    const searchPromotion = () => {
        console.log("searchValue", searchValue)
        const _data = stableData.filter((elm) => {
            return elm.promotion_code.toLowerCase().includes(searchValue.toLowerCase())
                    || elm.title.toLowerCase().includes(searchValue.toLowerCase())
                    || elm.description.toLowerCase().includes(searchValue.toLowerCase());
        })
        setData(_data);
    }


    return (
        <>
            <Drawer
                title="Chọn khuyến mãi"
                placement={placement}
                width={500}
                onClose={onClose}
                open={props.open}
            >
                <Search 
                    placeholder="Tìm kiếm mã giảm giá"
                    enterButton
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onPressEnter={searchPromotion}
                    onSearch={searchPromotion} />
                <List
                    itemLayout="horizontal"
                    dataSource={data}
                    loading={loading}
                    renderItem={(item) => {
                        var disabled = false;
                        var btnText = "Sử dụng";
                        var benefitText = "Không thể áp dụng";
                        // console.log(item)
                        
                        if (props.type == "Order"){     
                            if (item.benefit <= 0){
                                if(props.totalProduct < item.detail.minimum_total){
                                    disabled = true
                                    if(item.type == "Fixed")
                                        benefitText = `Mua thêm ${item.detail.minimum_total-props.totalProduct} để nhận khuyến mãi ${item.detail.reduction_amount}`
                                    else{
                                        var _received = item.detail.minimum_total*item.detail.percent/100
                                        if (item.detail.maximum_reduction_amount)
                                            _received = Math.min(_received, item.detail.maximum_reduction_amount)
                                        benefitText = `Mua thêm ${item.detail.minimum_total-props.totalProduct} để nhận khuyến mãi ${_received}`

                                    }
                                }
                            }else if(props.plOrder && props.plOrder.id == item.id){
                                disabled = true;
                                benefitText = `Được giảm: ${item.benefit}`
                                btnText = "Đang sử dụng"
                            }else
                                benefitText = `Được giảm: ${item.benefit}`
                        }else if(props.type == "Product"){
                            if (item.actual_received <= 0){
                                disabled = true;
                                benefitText = `Không đủ điều kiện`
                                btnText = "Sử dụng"
                            }else if(props.product.promotion_line == item.id){
                                disabled = true;
                                benefitText = `Nhận ${item.actual_received} ${item.detail.product_received.base_unit.name} ${item.detail.product_received.name} trị giá ${item.benefit}`
                                btnText = "Đang sử dụng"
                            }else{
                                // const res = await api.product.get(item.detail.product_received)
                                // console.log("res", res)
                                // const product_received = res.data.data
                                // console.log("product_received", product_received)
                                benefitText = `Nhận ${item.actual_received} ${item.detail.product_received.base_unit.name} ${item.detail.product_received.name} trị giá ${item.benefit}`
                            }
                        }
                        
                        if(!props.customerId){
                            disabled = true;
                            btnText = "Chọn khách hàng"
                        }
                        benefitText = benefitText[0].toUpperCase() + benefitText.slice(1).toLowerCase()
                        return (
                            <List.Item
                                extra={
                                    <Button type="primary" disabled={disabled} onClick={() => {
                                        props.onFinish(item)
                                        props.setOpen(false);
                                    }}>{btnText}</Button>
                                }>
                                <List.Item.Meta
                                    avatar={
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center'
                                        }}>
                                            <img style={{width: '50px'}} src={require("../../../../assets/voucher.png")} />
                                            <Text>{item.promotion_code}</Text>
                                        </div>}
                                    title={<span>{item.title}</span>}
                                    description={
                                        <p>
                                            <Text>{item.description}</Text><br/>
                                            <Text type='success'>{benefitText}</Text><br/>
                                            <Text>Còn lại {item.remain == -1 ? "Không giới hạn": item.remain}, HSD: {formater(item.end_date)}</Text>
                                        </p>
                                    }
                                />
                            </List.Item>
                        )
                    }}
                />
            </Drawer>
        </>
    );
};

export default PromotionPicker;