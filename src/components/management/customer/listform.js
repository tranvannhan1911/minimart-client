import {
    PlusOutlined, ImportOutlined,
    ExportOutlined, ReloadOutlined,
    SearchOutlined
  } from '@ant-design/icons';
import { Button, Col, Row, Space, Input, message } from 'antd';
import { Typography } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import ListForm from '../templates/listform';
import CustomerTable from './table';
import api from '../../../api/apis'
import { useNavigate } from 'react-router-dom'
import paths from '../../../utils/paths'
import messages from '../../../utils/messages'
const { Title } = Typography;
const { Search } = Input;

const CustomerListForm = (props) => {
    const [data, setData] = useState([])
    const [dataCustomerGroup, setDataCustomerGroup] = useState([])
    const [filteredInfo, setFilteredInfo] = useState({})
    const [searchInfo, setSearchInfo] = useState([])
    const [sortedInfo, setSortedInfo] = useState({})
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const refSearch = useRef()

    const handleGetData = async () => {
        setLoading(true)
        try{
            const response = await api.customer.list()
            const _data = response.data.data.results.map(elm => {
                elm.key = elm.id
                const _customer_groups = []
                elm.customer_group.forEach(gr => _customer_groups.push(gr.name))
                elm.customer_group = _customer_groups
                switch(elm.gender){
                    case "M":
                        elm.gender = "Nam"
                        break
                    case "F":
                        elm.gender = "Nữ"
                        break
                    case "U":
                        elm.gender = "Không xác định"
                        break
                }
                // let date=elm.date_joined.slice(0, 10);
                // let time=elm.date_joined.slice(12, 19);
                // elm.date_joined=date+" "+time;
                return elm
            })
            setData(_data)
        }catch(error){
            console.log('Failed:', error)
            message.error(messages.ERROR_REFRESH)
        }
        setLoading(false)
    }

    const handleGetDataCustomerGroup = async () => {
        try{
            const response = await api.customer_group.list()
            setDataCustomerGroup(response.data.data.results)
        }catch(error){
            console.log('Failed:', error)
            message.error(messages.ERROR_REFRESH)
        }
    }

    useEffect(() => {
        handleGetData()
        handleGetDataCustomerGroup()
        props.setBreadcrumb(false)
    }, []);

    const clearFiltersAndSort = () => {
        setFilteredInfo({})
        setSortedInfo({})
        setSearchInfo([])
    };

    return (
        <ListForm 
            title="Khách hàng" 
            actions={[
                <Button onClick={() => handleGetData()} icon={<ReloadOutlined/>}>Làm mới</Button>,
                // <Button icon={<ImportOutlined />}>Nhập excel</Button>,
                // <Button icon={<ExportOutlined />}>Xuất excel</Button>,
                <Button onClick={() => navigate(paths.customer.add)} type="primary" icon={<PlusOutlined />}>Thêm</Button>,
            ]}
            table={
                <CustomerTable 
                    data={data} 
                    data_customer_group={dataCustomerGroup}
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
                    placeholder="Tìm kiếm khách hàng" 
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

export default CustomerListForm;