import {
    PlusOutlined, ImportOutlined,
    ExportOutlined, ReloadOutlined,
    SearchOutlined
  } from '@ant-design/icons';
import { Button, Col, Row, Space, Input, message, Modal } from 'antd';
import { Typography } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import ListForm from '../templates/listform';
import WarehouseTransactionTable from './table';
import api from '../../../api/apis'
import { useNavigate } from 'react-router-dom'
import paths from '../../../utils/paths'
import messages from '../../../utils/messages'

const WarehouseTransactionListForm = (props) => {
    const [data, setData] = useState([])
    const [filteredInfo, setFilteredInfo] = useState({})
    const [searchInfo, setSearchInfo] = useState([])
    const [sortedInfo, setSortedInfo] = useState({})
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const handleGetData = async () => {
        setLoading(true)
        try{
            const response = await api.warehouse_transaction.list()
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
                let date=elm.date_created.slice(0, 10);
                let time=elm.date_created.slice(12, 19);
                elm.date_created=date+" "+time;
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
        {/* <ModalStaff >

        </ModalStaff> */}
        <ListForm
            title="Lịch sử biến động kho"
            actions={[
                <Button onClick={() => handleGetData()} icon={<ReloadOutlined />}>Làm mới</Button>,
                // <Button onClick={() => navigate(paths.staff.add)} type="primary" icon={<PlusOutlined />}>Thêm</Button>,
            ]}
            table={<WarehouseTransactionTable
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
                    placeholder="Tìm kiếm biến động kho"
                    allowClear value={searchInfo[0]}
                    prefix={<SearchOutlined />}
                    onChange={(e) => setSearchInfo([e.target.value])} />,
                <Button onClick={clearFiltersAndSort}>Xóa lọc</Button>
            ]}
        >

            </ListForm></>
    )
}

export default WarehouseTransactionListForm;