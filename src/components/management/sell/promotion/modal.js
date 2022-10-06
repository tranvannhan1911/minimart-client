import { Avatar, Button, Drawer, Image, Input, List, Typography  } from 'antd';
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
    const [loading, setLoading] = useState(true);

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
            handlePromotionLineByTypeProduct()
        }
    }, [props.customerId])

    useEffect(() => {
        handlePromotionLineByTypeOrder()
    }, [props.totalProduct])

    useEffect(() => {
        handlePromotionLineByTypeProduct()
    }, [props.productId])

    
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
            setData(response.data.data.results)
        }catch{
            
        }
        
        setLoading(false)
    }

    const handlePromotionLineByTypeProduct = async () => {
        console.log("handlePromotionLineByTypeProduct")
        setLoading(true)
        // try{
            const params = {
                params: {
                    product_id: props.productId,
                    customer_id: props.customerId,
                }
            }
            const response = await api.promotion_line.by_product(params)
            console.log("response", response)
            setData(response.data.data.results)
        // }catch{
            
        // }
        
        setLoading(false)
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
                <Search placeholder="Tìm kiếm mã giảm giá" enterButton />
                <List
                    itemLayout="horizontal"
                    dataSource={data}
                    loading={loading}
                    renderItem={(item) => {
                        var useable = props.type == "Order" && 
                            (false | (item.benefit <= 0) | (props.plOrder && props.plOrder.id == item.id))
                        const isUse = props.type == "Order" && (props.plOrder && props.plOrder.id == item.id)

                        return (
                            <List.Item
                                extra={
                                    <Button type="primary" disabled={useable} onClick={() => {
                                        props.onFinish(item)
                                        props.setOpen(false);
                                    }}>{isUse ? "Đang sử dụng": "Sử dụng"}</Button>
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
                                            <Text type='success'>Được giảm: {item.benefit}</Text><br/>
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