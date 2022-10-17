import {
    PlusOutlined, ReloadOutlined,
    SearchOutlined
  } from '@ant-design/icons';
import { Button, Input, message } from 'antd';
import React, { useState, useEffect,  } from 'react';
import ListForm from '../templates/listform';
import PriceTable from './table';
import api from '../../../api/apis'
import { useNavigate } from 'react-router-dom'
import paths from '../../../utils/paths'
import messages from '../../../utils/messages'
import { ExportReactCSV } from '../../../utils/exportExcel';

const PriceListForm = (props) => {
    const [dataMain, setDataMain] = useState([])
    const [data, setData] = useState([])
    const [dataProductGroups, setDataProductGroups] = useState([])
    const [filteredInfo, setFilteredInfo] = useState({})
    const [searchInfo, setSearchInfo] = useState([])
    const [sortedInfo, setSortedInfo] = useState({})
    const [loading, setLoading] = useState(true)
    const [dataSearchName, setDataSearchName] = useState("")
    const [dataSearchCode, setDataSearchCode] = useState('')
    const [dataSearchBarcode, setDataSearchBarcode] = useState("")
    const navigate = useNavigate()

    const handleGetData = async () => {
        setLoading(true)
        try{
            const response = await api.product.list()
            console.log("handleGetData", response)
            const _data = response.data.data.results.map(elm => {
                const _product_groups = []
                elm.product_groups.forEach(gr => _product_groups.push(gr.name));
                elm.product_groups = _product_groups;

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
        setData(dataMain)
        setDataSearchName("")
        setDataSearchCode("")
        setDataSearchBarcode("")
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
            if(element.product_code.toLowerCase().includes(value.toLowerCase())){
                data_.push(element);
            }
        });
        setData(data_);
    }

    const searchBarcode = (value) =>{
        setDataSearchBarcode(value);
        let data_ = [];
        dataMain.forEach(element => {
            if(element.barcode.toString().toLowerCase().includes(value.toString().toLowerCase())){
                data_.push(element);
            }
        });
        setData(data_);
    }

    return (
        <ListForm 
            title="Sản phẩm" 
            actions={[
                
                <Button onClick={() => handleGetData()} icon={<ReloadOutlined/>}>Làm mới</Button>,
                <ExportReactCSV csvData={data} fileName='product' />,
                <Button onClick={() => navigate(paths.product.add)} type="primary" icon={<PlusOutlined />}>Thêm</Button>,
            ]}
            table={
                <PriceTable 
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
                <Input 
                    placeholder="Tìm kiếm theo tên" 
                    allowClear value={dataSearchName} 
                    prefix={<SearchOutlined />}
                    onChange={(e) => searchName(e.target.value)}
                />,
                <Input 
                    placeholder="Tìm kiếm code sản phẩm" 
                    allowClear value={dataSearchCode} 
                    prefix={<SearchOutlined />}
                    onChange={(e) => searchCode(e.target.value)}
                />,
                <Input 
                    placeholder="Tìm kiếm theo mã vạch" 
                    allowClear value={dataSearchBarcode} 
                    prefix={<SearchOutlined />}
                    onChange={(e) => searchBarcode(e.target.value)}
                />,
                <Button onClick={clearFiltersAndSort}>Xóa lọc</Button>
            ]}
        >

        </ListForm>
    )
}

export default PriceListForm;