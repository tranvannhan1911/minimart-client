import {
    PlusOutlined, ImportOutlined,
    ExportOutlined, ReloadOutlined,
    SearchOutlined
  } from '@ant-design/icons';
import { Button, Col, Row, Space, Input, message, Modal } from 'antd';
import { Typography } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import ListForm from '../templates/listform';
import StaffTable from './table';
import api from '../../../api/apis'
import { useNavigate } from 'react-router-dom'
import paths from '../../../utils/paths'
import messages from '../../../utils/messages'

const StaffListForm = (props) => {
    const [data, setData] = useState([])
    const [filteredInfo, setFilteredInfo] = useState({})
    const [searchInfo, setSearchInfo] = useState([])
    const [sortedInfo, setSortedInfo] = useState({})
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const handleGetData = async () => {
        setLoading(true)
        try{
            const response = await api.price.list()
            const _data = response.data.data.results.map(elm => {
                elm.key = elm.id
    
                let date=elm.start_date.slice(0, 10);
                let time=elm.start_date.slice(12, 19);
                elm.start_date=date+" "+time;

                let date2=elm.end_date.slice(0, 10);
                let time2=elm.end_date.slice(12, 19);
                elm.end_date=date2+" "+time2;

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
            title="Bảng giá"
            actions={[
                <Button onClick={() => handleGetData()} icon={<ReloadOutlined />}>Làm mới</Button>,
                <Button onClick={() => navigate(paths.price.add)} type="primary" icon={<PlusOutlined />}>Thêm</Button>,
            ]}
            table={<StaffTable
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
                    placeholder="Tìm kiếm bảng giá"
                    allowClear value={searchInfo[0]}
                    prefix={<SearchOutlined />}
                    onChange={(e) => setSearchInfo([e.target.value])} />,
                <Button onClick={clearFiltersAndSort}>Xóa lọc</Button>
            ]}
        >

            </ListForm></>
    )
}

export default StaffListForm;