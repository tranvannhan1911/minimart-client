import {
    PlusOutlined, ImportOutlined,
    ExportOutlined, ReloadOutlined
  } from '@ant-design/icons';
import { Button, Col, Row, Space } from 'antd';
import { Typography } from 'antd';
import React, { useState, useEffect } from 'react';
import ListForm from '../templates/listform';
import StaffTable from './table';
import { CustomerApi } from '../../../api/apis'
const { Title } = Typography;

// const data = [];

// for (let i = 0; i < 46; i++) {
//   data.push({
//     key: i,
//     name: `Edward King ${i+100}`,
//     age: 32+i,
//     address: `London, Park Lane no. ${i}`,
//   });
// }

const StaffListForm = () => {
    const customerApi = new CustomerApi()
    // data = await customerApi.list()
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleGetData = async () => {
        setLoading(true)
        const response = await customerApi.list()
        console.log(response)
        const _data = response.data.data.results.map(elm => {
            elm.key = elm.customer_id
            return elm
        })

        setData(_data)
        setLoading(false)
    }

    useEffect(() => {
        handleGetData();
    }, []);

    return (
        <ListForm 
            title="Khách hàng" 
            actions={[
                <Button icon={<ReloadOutlined />}>Làm mới</Button>,
                <Button icon={<ImportOutlined />}>Nhập excel</Button>,
                <Button icon={<ExportOutlined />}>Xuất excel</Button>,
                <Button type="primary" icon={<PlusOutlined />}>Thêm</Button>,
            ]}
            table={
                <StaffTable 
                    data={data} 
                    loading={loading} 
                    setLoading={setLoading}
                />
            }
        >

        </ListForm>
    )
}

export default StaffListForm;