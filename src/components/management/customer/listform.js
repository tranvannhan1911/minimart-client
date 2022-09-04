import {
    PlusOutlined, ImportOutlined,
    ExportOutlined, ReloadOutlined
  } from '@ant-design/icons';
import { Button, Col, Row, Space, Input, message } from 'antd';
import { Typography } from 'antd';
import React, { useState, useEffect } from 'react';
import ListForm from '../templates/listform';
import CustomerTable from './table';
import { CustomerApi } from '../../../api/apis'
import { useNavigate } from 'react-router-dom'
const { Title } = Typography;
const { Search } = Input;

const CustomerListForm = (props) => {
    const customerApi = new CustomerApi()
    // data = await customerApi.list()
    const [data, setData] = useState([]);
    const [dataCustomerGroup, setDataCustomerGroup] = useState([]);
    const [filteredInfo, setFilteredInfo] = useState({});
    const [searchInfo, setSearchInfo] = useState([]);
    const [sortedInfo, setSortedInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleGetData = async () => {
        setLoading(true)
        try{
            const response = await customerApi.list()
            const _data = response.data.data.results.map(elm => {
                elm.key = elm.customer_id
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
                return elm
            })
            setData(_data)
        }catch(error){
            console.log('Failed:', error)
            message.error("Có lỗi xảy ra, vui lòng tải lại trang")
        }
        setLoading(false)
    }

    const handleGetDataCustomerGroup = async () => {
        // setLoading(true)
        try{
            const response = await customerApi.customer_group_list()
            setDataCustomerGroup(response.data.data.results)
        }catch(error){
            console.log('Failed:', error)
            message.error("Có lỗi xảy ra, vui lòng tải lại trang")
        }
        // setLoading(false)
    }

    useEffect(() => {
        handleGetData()
        handleGetDataCustomerGroup()
        props.setBreadcrumb(false)
    }, []);

    const onSearch = (value) => {
        console.log(value)
        // const _filteredInfo = Object.assign({}, filteredInfo)
        // _filteredInfo.fullname = []
        // _filteredInfo.fullname.push(value)
        // setFilteredInfo(_filteredInfo)
        setSearchInfo([value])
    }

    const clearFiltersAndSort = () => {
        setFilteredInfo({});
        setSortedInfo({});
    };

    return (
        <ListForm 
            title="Khách hàng" 
            actions={[
                <Button onClick={() => handleGetData()} icon={<ReloadOutlined/>}>Làm mới</Button>,
                <Button icon={<ImportOutlined />}>Nhập excel</Button>,
                <Button icon={<ExportOutlined />}>Xuất excel</Button>,
                <Button onClick={() => navigate('/quan-ly/khach-hang/them-moi')} type="primary" icon={<PlusOutlined />}>Thêm</Button>,
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
                <Search
                    placeholder="Tìm kiếm khách hàng"
                    allowClear
                    onSearch={onSearch}
                    // style={{
                    //     width: 200,
                    // }}
                />,
                <Button onClick={clearFiltersAndSort}>Xóa lọc</Button>
            ]}
        >

        </ListForm>
    )
}

export default CustomerListForm;