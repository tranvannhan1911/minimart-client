import {
    ExpandOutlined
  } from '@ant-design/icons';
import React, { useEffect, useRef, useState } from 'react';
import { Tabs, Form, Input, Select, message, Space, Popconfirm, Upload, Row, Col, Checkbox, Button } from 'antd';
import OrderItem from './item';
import api from '../../../api/apis';
import messages from '../../../utils/messages';
import ProductSelect from '../barcode/input';
import TabContent from './tabcontent';
const { Option } = Select;


const SellPage = () => {
    const [baseUnitOptions, setBaseUnitOptions] = useState([])
    const [customerOptions, setCustomerOptions] = useState([])
    const [staffOptions, setStaffOptions] = useState([])
    const [activeKey, setActiveKey] = useState();
    const [items, setItems] = useState([]);
    const newTabIndex = useRef(0);
    let init = false;
    
    // const initialItems = [
    //     {
    //         label: 'Đơn hàng 1',
    //         children: <TabContent 
    //             baseUnitOptions={baseUnitOptions}
    //             setBaseUnitOptions={setBaseUnitOptions}
    //             customerOptions={customerOptions}
    //             setCustomerOptions={setCustomerOptions}/>,
    //         key: '1',
    //     },
    // ];

    // const init = () => {
    //     setActiveKey(initialItems[0].key)
    //     setItems(initialItems)
    // }

    const onChange = (newActiveKey) => {
        console.log(newActiveKey)
        setActiveKey(newActiveKey);
    };

    const add = () => {
        console.log("add")
        const newActiveKey = `newTab${newTabIndex.current++}`;
        const newPanes = [...items];
        newPanes.push({
            label: `Đơn hàng ${newTabIndex.current}`,
            children: <TabContent 
                baseUnitOptions={baseUnitOptions}
                setBaseUnitOptions={setBaseUnitOptions}
                customerOptions={customerOptions}
                setCustomerOptions={setCustomerOptions}
                staffOptions={staffOptions}
                setStaffOptions={setStaffOptions}
                />,
            key: newActiveKey,
        });
        setItems(newPanes);
        setActiveKey(newActiveKey);
    };

    const remove = (targetKey) => {
        let newActiveKey = activeKey;
        let lastIndex = -1;
        items.forEach((item, i) => {
            if (item.key === targetKey) {
                lastIndex = i - 1;
            }
        });
        const newPanes = items.filter((item) => item.key !== targetKey);

        if (newPanes.length && newActiveKey === targetKey) {
            if (lastIndex >= 0) {
                newActiveKey = newPanes[lastIndex].key;
            } else {
                newActiveKey = newPanes[0].key;
            }
        }

        setItems(newPanes);
        setActiveKey(newActiveKey);
    };

    const onEdit = (targetKey, action) => {
        console.log(targetKey, action)
        if (action === 'add') {
            add();
        } else {
            remove(targetKey);
        }
    };

    
    const handleDataBaseUnit = async () => {
        try {
            const response = await api.unit.list()
            const options = response.data.data.results.map(elm => {
                return (
                    <Option key={elm.id} value={elm.id}>{elm.name}</Option>
                )
            })
            setBaseUnitOptions(options);
        } catch (error) {
            message.error(messages.ERROR)
        }
    }
    
    const handleDataCustomer = async () => {
        try {
            const response = await api.customer.list()
            console.log(response.data)
            const options = response.data.data.results.map(elm => {
                return (
                    <Option key={elm.id} value={elm.id}>{elm.fullname} - {elm.phone}</Option>
                )
            })
            setCustomerOptions(options);
        } catch (error) {
            message.error(messages.ERROR)
        }
    }
    
    const handleDataStaff = async () => {
        try {
            const response = await api.staff.list()
            console.log(response.data)
            const options = response.data.data.results.map(elm => {
                return (
                    <Option key={elm.id} value={elm.id}>{elm.fullname} - {elm.phone}</Option>
                )
            })
            setStaffOptions(options);
        } catch (error) {
            message.error(messages.ERROR)
        }
    }

    useEffect(() => {
        handleDataBaseUnit();
        handleDataCustomer();
        handleDataStaff();
        if(!init){
            init = true
            add()
        }
    }, [])
    
    useEffect(() => {
        console.log("customerOptions", customerOptions)
    }, [customerOptions])

    return (
        <Tabs
            type="editable-card"
            onChange={onChange}
            activeKey={activeKey}
            onEdit={onEdit}
            items={items}
            tabBarExtraContent={{
                right: <Button type="info" icon={<ExpandOutlined />}>Mở rộng</Button>
            }}
        />
    );
};

export default SellPage;