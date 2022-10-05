import { Avatar, Button, Drawer, Input, List, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import api from '../../../../api/apis';
const { Search } = Input;

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
        handlePromotionLineByTypeOrder()
    }, [props.customerId])

    
    const handlePromotionLineByTypeOrder = async () => {
        const params = {
            params: {
                type: "Order",
                customer_id: props.customerId
            }
        }
        const response = await api.promotion_line.by_type(params)
        setData(response.data.data.results)
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
                    renderItem={(item) => (
                        <List.Item
                            extra={
                                <Button type="primary" onClick={() => {
                                    props.onFinish(item)
                                    props.setOpen(false);
                                }}>Sử dụng</Button>
                            }>
                            <List.Item.Meta
                                avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                                title={<span>{item.title}</span>}
                                description={item.description}
                            />
                        </List.Item>
                    )}
                />
            </Drawer>
        </>
    );
};

export default PromotionPicker;