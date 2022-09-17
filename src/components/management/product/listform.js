import {
    PlusOutlined, ImportOutlined,
    ExportOutlined, ReloadOutlined,
    SearchOutlined
  } from '@ant-design/icons';
import { Button, Col, Row, Space, Input, message } from 'antd';
import { Typography } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import ListForm from '../templates/listform';
import ProductTable from './table';
import api from '../../../api/apis'
import { useNavigate } from 'react-router-dom'
import paths from '../../../utils/paths'
import messages from '../../../utils/messages'

const ProductListForm = (props) => {
    const [data, setData] = useState([])
    const [dataProductGroups, setDataProductGroups] = useState([])
    const [filteredInfo, setFilteredInfo] = useState({})
    const [searchInfo, setSearchInfo] = useState([])
    const [sortedInfo, setSortedInfo] = useState({})
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const handleGetData = async () => {
        setLoading(true)
        try{
            const response = await api.product.list()
            const _data = response.data.data.results.map(elm => {
                const _product_groups = []
                elm.product_groups.forEach(gr => _product_groups.push(gr.name))
                elm.product_groups = _product_groups
                return elm
            })
            setData(_data)
        }catch(error){
            console.log('Failed:', error)
            message.error(messages.ERROR_REFRESH)
        }
        setLoading(false)
    }

    const handleGetDataProductGroups = async () => {
        setLoading(true)
        try{
            const response = await api.product_group.list()
            setDataProductGroups(response.data.data.results)
        }catch(error){
            console.log('Failed:', error)
            message.error(messages.ERROR_REFRESH)
        }
        setLoading(false)
    }

    useEffect(() => {
        handleGetData()
        handleGetDataProductGroups()
        props.setBreadcrumb(false)
    }, []);

    const clearFiltersAndSort = () => {
        setFilteredInfo({})
        setSortedInfo({})
        setSearchInfo([])
    };

    return (
        <ListForm 
            title="Sản phẩm" 
            actions={[
                <Button onClick={() => handleGetData()} icon={<ReloadOutlined/>}>Làm mới</Button>,
                <Button onClick={() => navigate(paths.product.add)} type="primary" icon={<PlusOutlined />}>Thêm</Button>,
            ]}
            table={
                <ProductTable 
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
                    placeholder="Tìm kiếm sản phẩm" 
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

export default ProductListForm;