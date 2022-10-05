import {
    PlusOutlined, ImportOutlined,
    ExportOutlined, ReloadOutlined,
    SearchOutlined
} from '@ant-design/icons';
import { Button, Col, Row, Space, Input, message } from 'antd';
import { Typography } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import ListForm from '../templates/listform';
import OrderTable from './table';
import api from '../../../api/apis'
import { useNavigate } from 'react-router-dom'
import paths from '../../../utils/paths'
import messages from '../../../utils/messages'
import axios from 'axios';


const OrderListForm = (props) => {
    const [data, setData] = useState([])
    const [dataProductGroups, setDataProductGroups] = useState([])
    const [filteredInfo, setFilteredInfo] = useState({})
    const [searchInfo, setSearchInfo] = useState([])
    const [sortedInfo, setSortedInfo] = useState({})
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const handleGetData = async () => {
        setLoading(true)
        try {
            // const response = await api.order.list()
            const response = (await axios.get('https://63252b299075b9cbee471829.mockapi.io/api/order')).data;
            const _data = response.map(elm => {
            // const _data = response.data.data.results.map(elm => {
                elm.details = elm.details.map(element => {
                    element.product = element.product.name;
                    element.price = element.price.price;
                    element.unit_exchange = element.unit_exchange.unit_name;
                    return element;
                });
                let date = elm.date_created.slice(0, 10);
                let time = elm.date_created.slice(12, 19);
                elm.date_created = date + " " + time;

                let index = {
                    "key": elm.id,
                    "details": elm.details,
                    "note": elm.note,
                    "total": elm.total,
                    "status": elm.status,
                    "date_created": elm.date_created,
                    "date_updated": elm.date_updated,
                    "customer": elm.customer,
                    "user_created": elm.user_created,
                    "user_updated": elm.user_updated,
                };
                return index;
            })
            // console.log(data)
            setData(_data)
        } catch (error) {
            console.log('Failed:', error)
            message.error(messages.ERROR_REFRESH)
        }
        setLoading(false)
    }

    useEffect(() => {
        handleGetData()
        // handleGetDataProductGroups()
        props.setBreadcrumb(false)
    }, []);

    const clearFiltersAndSort = () => {
        setFilteredInfo({})
        setSortedInfo({})
        setSearchInfo([])
    };

    return (
        <ListForm
            title="Hóa đơn bán hàng"
            actions={[

                <Button onClick={() => handleGetData()} icon={<ReloadOutlined />}>Làm mới</Button>,
                // <Button onClick={() => navigate(paths.product.add)} type="primary" icon={<PlusOutlined />}>Thêm</Button>,
            ]}
            table={
                <OrderTable
                    data={data}
                    dataProductGroups={dataProductGroups}
                    loading={loading}
                    setLoading={setLoading}
                    filteredInfo={filteredInfo}
                    setFilteredInfo={setFilteredInfo}
                    searchInfo={searchInfo}
                    setSearchInfo={setSearchInfo}
                    sortedInfo={sortedInfo}
                    setSortedInfo={setSortedInfo}
                />
            }
            extra_actions={[
                <Input
                    placeholder="Tìm kiếm hóa đơn"
                    allowClear value={searchInfo[0]}
                    prefix={<SearchOutlined />}
                    onChange={(e) => setSearchInfo([e.target.value])}
                />,
                <Button onClick={clearFiltersAndSort}>Xóa lọc</Button>
            ]}
        >

        </ListForm>
    )
}

export default OrderListForm;