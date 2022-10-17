import {
    PlusOutlined, UploadOutlined, ReloadOutlined,
    SearchOutlined
} from '@ant-design/icons';
import { Button, Input, message, Upload } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import ListForm from '../templates/listform';
import CustomerTable from './table';
import api from '../../../api/apis'
import { useNavigate } from 'react-router-dom'
import paths from '../../../utils/paths'
import messages from '../../../utils/messages'
import { ExportReactCSV } from '../../../utils/exportExcel';
import * as XLSX from 'xlsx';


const CustomerListForm = (props) => {
    const [dataMain, setDataMain] = useState([])
    const [data, setData] = useState([])
    const [dataCustomerGroup, setDataCustomerGroup] = useState([])
    const [filteredInfo, setFilteredInfo] = useState({})
    const [searchInfo, setSearchInfo] = useState([])
    const [dataSearchName, setDataSearchName] = useState("")
    const [dataSearchPhone, setDataSearchPhone] = useState('')
    const [sortedInfo, setSortedInfo] = useState({})
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const refSearch = useRef()

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
                    const response = await api.customer.add({
                        "phone": "0" + element.phone,
                        "fullname": element.fullname,
                        "gender": element.gender,
                        "address": element.address,
                        "note": element.note,
                        "is_active": element.is_active,
                        "customer_group": [

                        ]
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
            const response = await api.customer.list()
            const _data = response.data.data.results.map(elm => {
                elm.key = elm.id
                const _customer_groups = []
                elm.customer_group.forEach(gr => _customer_groups.push(gr.name))
                elm.customer_group = _customer_groups
                switch (elm.gender) {
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

    const handleGetDataCustomerGroup = async () => {
        try {
            const response = await api.customer_group.list()
            setDataCustomerGroup(response.data.data.results)
        } catch (error) {
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
        setData(dataMain)
        setDataSearchName("")
        setDataSearchPhone("")
        setFilteredInfo({})
        setSortedInfo({})
        setSearchInfo([])
    };

    const searchName = (value) => {
        setDataSearchName(value);
        let data_ = [];
        dataMain.forEach(element => {
            if (element.fullname.toLowerCase().includes(value.toLowerCase())) {
                data_.push(element);
            }
        });
        setData(data_);
    }

    const searchPhone = (value) => {
        setDataSearchPhone(value);
        let data_ = [];
        dataMain.forEach(element => {
            if (element.phone.toString().toLowerCase().includes(value.toString().toLowerCase())) {
                data_.push(element);
            }
        });
        setData(data_);
    }

    return (
        <ListForm
            title="Khách hàng"
            actions={[
                <Button onClick={() => handleGetData()} icon={<ReloadOutlined />}>Làm mới</Button>,
                <Upload showUploadList={false} {...uploadData}>
                    <Button icon={<UploadOutlined />}>Nhập Excel</Button>
                </Upload>,
                <ExportReactCSV csvData={data} fileName='customer' />,
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
                <Input
                    placeholder="Tìm kiếm theo tên"
                    allowClear value={dataSearchName}
                    prefix={<SearchOutlined />}
                    onChange={(e) => searchName(e.target.value)}
                />,
                <Input
                    placeholder="Tìm kiếm số điện thoại"
                    allowClear value={dataSearchPhone}
                    prefix={<SearchOutlined />}
                    onChange={(e) => searchPhone(e.target.value)}
                />,
                <Button onClick={clearFiltersAndSort}>Xóa lọc</Button>
            ]}
        >

        </ListForm>
    )
}

export default CustomerListForm;