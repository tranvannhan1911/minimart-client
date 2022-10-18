import {
    PlusOutlined, UploadOutlined,
    ExportOutlined, ReloadOutlined,
    SearchOutlined
} from '@ant-design/icons';
import { Button, Col, Row, Space, Input, message, Upload } from 'antd';
import { Typography } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import ListForm from '../templates/listform';
import SupplierTable from './table';
import api from '../../../api/apis'
import { useNavigate } from 'react-router-dom'
import paths from '../../../utils/paths'
import messages from '../../../utils/messages'
import { ExportReactCSV } from '../../../utils/exportExcel';
import * as XLSX from 'xlsx';


const SupplierListForm = (props) => {
    const [dataMain, setDataMain] = useState([])
    const [data, setData] = useState([])
    const [filteredInfo, setFilteredInfo] = useState({})
    const [searchInfo, setSearchInfo] = useState([])
    const [dataSearchCode, setDataSearchCode] = useState('')
    const [dataSearchName, setDataSearchName] = useState("")
    const [dataSearchPhone, setDataSearchPhone] = useState('')
    const [dataSearchEmail, setDataSearchEmail] = useState("")
    const [dataSearchAddress, setDataSearchAddress] = useState("")
    const [sortedInfo, setSortedInfo] = useState({})
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const uploadData = {
        async beforeUpload(file) {
            // console.log(file.name)
            var typeFile = file.name.split('.').pop().toLowerCase();
            if (typeFile == "xlsx" || typeFile == "csv") {
                setLoading(true);
                const data = await file.arrayBuffer();
                const workbook = XLSX.read(data);

                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                for (let index = 0; index < jsonData.length; index++) {
                    const element = jsonData[index];
                    const response = await api.supplier.add({
                        "name": element.name,
                        "phone": '0' + element.phone,
                        "email": element.email,
                        "address": element.address,
                        "note": element.note
                    });
                    if (index == jsonData.length - 1) {
                        console.log(index)
                        message.success("Xong quá trình thêm dữ liệu");
                        setLoading(false);
                        handleGetData();
                    }
                }
            } else {
                message.error("Chỉ nhập dữ liệu bằng file .csv, .xlsx");
                return;
            }

        }
    };

    const handleGetData = async () => {
        setLoading(true)
        try {
            const response = await api.supplier.list()
            const _data = response.data.data.results.map(elm => {

                let date = elm.date_created.slice(0, 10);
                let time = elm.date_created.slice(11, 19);
                elm.date_created = date + " " + time;

                if (elm.date_updated != null) {
                    let date2 = elm.date_updated.slice(0, 10);
                    let time2 = elm.date_updated.slice(11, 19);
                    elm.date_updated = date2 + " " + time2;
                }

                return elm
            })
            setData(_data)
            setDataMain(_data)
        } catch (error) {
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
        setData(dataMain)
        setDataSearchCode("")
        setDataSearchName("")
        setDataSearchPhone("")
        setDataSearchEmail("")
        setDataSearchAddress("")
        setFilteredInfo({})
        setSortedInfo({})
        setSearchInfo([])
    };

    const searchCode = (value) =>{
        setDataSearchCode(value);
        let data_ = [];
        dataMain.forEach(element => {
            if(element.code.toLowerCase().includes(value.toLowerCase())){
                data_.push(element);
            }
        });
        setData(data_);
    }

    const searchName = (value) =>{
        setDataSearchName(value);
        let data_ = [];
        dataMain.forEach(element => {
            if(element.name.toLowerCase().includes(value.toLowerCase())){
                data_.push(element);
            }
        });
        setData(data_);
    }

    const searchPhone = (value) =>{
        setDataSearchPhone(value);
        let data_ = [];
        dataMain.forEach(element => {
            if(element.phone.toString().toLowerCase().includes(value.toString().toLowerCase())){
                data_.push(element);
            }
        });
        setData(data_);
    }

    const searchEmail = (value) =>{
        setDataSearchEmail(value);
        let data_ = [];
        dataMain.forEach(element => {
            if(element.email.toLowerCase().includes(value.toLowerCase())){
                data_.push(element);
            }
        });
        setData(data_);
    }

    // const searchAddress = (value) =>{
    //     setDataSearchAddress(value);
    //     let data_ = [];
    //     dataMain.forEach(element => {
    //         if(element.address.toLowerCase().includes(value.toLowerCase())){
    //             data_.push(element);
    //         }
    //     });
    //     setData(data_);
    // }

    return (
        <ListForm
            title="Nhà cung cấp"
            actions={[
                <Button onClick={() => handleGetData()} icon={<ReloadOutlined />}>Làm mới</Button>,
                <Upload showUploadList={false} {...uploadData}>
                    <Button icon={<UploadOutlined />}>Nhập Excel</Button>
                </Upload>,
                <ExportReactCSV csvData={data} fileName='supplier.xlsx' 
                // header={[
                //     { label: 'Mã', key: 'id' },
                //     { label: 'Tên', key: 'name' },
                //     { label: 'Số điện thoại', key: 'phone' },
                //     { label: 'Email', key: 'email' },
                //     { label: 'Địa chỉ', key: 'address' },
                //     { label: 'Ghi chú', key: 'note' },
                //     { label: 'Ngày tạo', key: 'date_created' },
                //     { label: 'Ngày sửa', key: 'date_updated' },
                //     { label: 'Mã người tạo', key: 'user_created' },
                //     { label: 'Mã người sửa', key: 'user_updated' },
                // ]} 
                />,
                <Button onClick={() => navigate(paths.supplier.add)} type="primary" icon={<PlusOutlined />}>Thêm</Button>,
            ]}
            table={
                <SupplierTable
                    data={data}
                    loading={loading}
                    setLoading={setLoading}
                    filteredInfo={filteredInfo}
                    setFilteredInfo={setFilteredInfo}
                    searchInfo={searchInfo}
                    setSearchInfo={setSearchInfo}
                    sortedInfo={sortedInfo}
                    setSortedInfo={setSortedInfo}
                    dataSearchName={searchName}
                    dataSearchId={searchCode}
                    dataSearchPhone={searchPhone}
                    dataSearchEmail={searchEmail}
                    // dataSearchAddress={searchAddress}
                    clearFiltersAndSort={clearFiltersAndSort}
                />
            }
            extra_actions={[
                <Input
                    placeholder="Tìm kiếm nhà cung cấp"
                    allowClear value={searchInfo[0]}
                    prefix={<SearchOutlined />}
                    onChange={(e) => setSearchInfo([e.target.value])}
                />,
                // <Input 
                //     placeholder="Tìm kiếm theo tên" 
                //     allowClear value={dataSearchName} 
                //     prefix={<SearchOutlined />}
                //     onChange={(e) => searchName(e.target.value)}
                // />,
                // <Input 
                //     placeholder="Tìm kiếm số điện thoại" 
                //     allowClear value={dataSearchPhone} 
                //     prefix={<SearchOutlined />}
                //     onChange={(e) => searchPhone(e.target.value)}
                // />,
                // <Input 
                //     placeholder="Tìm kiếm theo email" 
                //     allowClear value={dataSearchEmail} 
                //     prefix={<SearchOutlined />}
                //     onChange={(e) => searchEmail(e.target.value)}
                // />,
                // <Input 
                //     placeholder="Tìm kiếm theo địa chỉ" 
                //     allowClear value={dataSearchAddress} 
                //     prefix={<SearchOutlined />}
                //     onChange={(e) => searchAddress(e.target.value)}
                // />,
                <Button onClick={clearFiltersAndSort}>Xóa lọc</Button>
            ]}
        >

        </ListForm>
    )
}

export default SupplierListForm;