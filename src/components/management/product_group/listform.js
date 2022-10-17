import {
    PlusOutlined, UploadOutlined,
    ReloadOutlined, SearchOutlined
  } from '@ant-design/icons';
import { Button, Input, message, Upload } from 'antd';
import React, { useState, useEffect,  } from 'react';
import ListForm from '../templates/listform';
import ProductGroupTable from './table';
import api from '../../../api/apis'
import { useNavigate } from 'react-router-dom'
import paths from '../../../utils/paths'
import messages from '../../../utils/messages'
import { ExportReactCSV } from '../../../utils/exportExcel';
import * as XLSX from 'xlsx';

const ProductGroupListForm = (props) => {
    const [dataMain, setDataMain] = useState([])
    const [data, setData] = useState([])
    const [filteredInfo, setFilteredInfo] = useState({})
    const [searchInfo, setSearchInfo] = useState([])
    const [dataSearchName, setDataSearchName] = useState("")
    const [dataSearchCode, setDataSearchCode] = useState('')
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
                    const response = await api.product_group.add({ 'product_group_code':element.product_group_code,"name": element.name, 'description':element.description,"note": element.note });
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
        try{
            const response = await api.product_group.list()
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
        setData(dataMain)
        setDataSearchName("")
        setDataSearchCode("")
        setFilteredInfo({})
        setSortedInfo({})
        setSearchInfo([])
    };

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

    const searchCode = (value) =>{
        setDataSearchCode(value);
        let data_ = [];
        dataMain.forEach(element => {
            if(element.product_group_code.toLowerCase().includes(value.toLowerCase())){
                data_.push(element);
            }
        });
        setData(data_);
    }

    return (
        <ListForm 
            title="Nhóm sản phẩm" 
            actions={[
                <Button onClick={() => handleGetData()} icon={<ReloadOutlined/>}>Làm mới</Button>,
                <Upload showUploadList={false} {...uploadData}>
                    <Button icon={<UploadOutlined />}>Nhập Excel</Button>
                </Upload>,
                <ExportReactCSV csvData={data} fileName='productgroup' />,
                <Button onClick={() => navigate(paths.product_group.add)} type="primary" icon={<PlusOutlined />}>Thêm</Button>,
            ]}
            table={
                <ProductGroupTable 
                    data={data} 
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
                    placeholder="Tìm kiếm nhóm sản phẩm" 
                    allowClear value={searchInfo[0]} 
                    prefix={<SearchOutlined />}
                    onChange={(e) => setSearchInfo([e.target.value])}
                />,
                <Input 
                    placeholder="Tìm kiếm theo tên" 
                    allowClear value={dataSearchName} 
                    prefix={<SearchOutlined />}
                    onChange={(e) => searchName(e.target.value)}
                />,
                <Input 
                    placeholder="Tìm kiếm code nhóm sản phẩm" 
                    allowClear value={dataSearchCode} 
                    prefix={<SearchOutlined />}
                    onChange={(e) => searchCode(e.target.value)}
                />,
                <Button onClick={clearFiltersAndSort}>Xóa lọc</Button>
            ]}
        >

        </ListForm>
    )
}

export default ProductGroupListForm;