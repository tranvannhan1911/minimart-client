import {
    PlusOutlined, ImportOutlined,
    ExportOutlined, ReloadOutlined,
    SearchOutlined
  } from '@ant-design/icons';
import { Button, Col, Row, Space, Input, message, Modal } from 'antd';
import { Typography } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import ListForm from '../templates/listform';
import InventoryRecordTable from './table';
import api from '../../../api/apis'
import { useNavigate } from 'react-router-dom'
import paths from '../../../utils/paths'
import messages from '../../../utils/messages'

const InventoryRecordListForm = (props) => {
    const [data, setData] = useState([])
    const [filteredInfo, setFilteredInfo] = useState({})
    const [searchInfo, setSearchInfo] = useState([])
    const [sortedInfo, setSortedInfo] = useState({})
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const handleGetData = async () => {
        setLoading(true)
        try{
            const response = await api.inventory_record.list()
            const _data = response.data.data.results.map(elm => {
                elm.key = elm.id
                // switch(elm.gender){
                //     case "M":
                //         elm.gender = "Nam"
                //         break
                //     case "F":
                //         elm.gender = "Nữ"
                //         break
                //     case "U":
                //         elm.gender = "Không xác định"
                //         break
                // }
                // if(elm.is_superuser==true){
                //     elm.is_superuser = "Quản lý";
                // }else{
                //     elm.is_superuser = "Nhân viên";
                // }
                return elm
            })
            setData(_data)
        }catch(error){
            console.log('Failed:', error)
            message.error(messages.ERROR_REFRESH)
        }
        setLoading(false)
    }

    useEffect(() => {
        handleGetData()
        props.setBreadcrumb(false)
    }, []);

    const clearFiltersAndSort = () => {
        setFilteredInfo({})
        setSortedInfo({})
        setSearchInfo([])
    };

    return (
        <>
        
        <ListForm
            title="Phiếu kiểm kê"
            actions={[
                <Button onClick={() => handleGetData()} icon={<ReloadOutlined />}>Làm mới</Button>,
                <Button onClick={() => navigate(paths.inventory_record.add)} type="primary" icon={<PlusOutlined />}>Kiểm kê</Button>,
            ]}
            table={<InventoryRecordTable
                data={data}
                loading={loading}
                setLoading={setLoading}
                filteredInfo={filteredInfo}
                setFilteredInfo={setFilteredInfo}
                searchInfo={searchInfo}
                setSearchInfo={setSearchInfo}
                sortedInfo={sortedInfo}
                setSortedInfo={setSortedInfo} />}
            extra_actions={[
                <Input
                    placeholder="Tìm kiếm phiếu kiểm kê"
                    allowClear value={searchInfo[0]}
                    prefix={<SearchOutlined />}
                    onChange={(e) => setSearchInfo([e.target.value])} />,
                <Button onClick={clearFiltersAndSort}>Xóa lọc</Button>
            ]}
        >

            </ListForm></>
    )
}

export default InventoryRecordListForm;