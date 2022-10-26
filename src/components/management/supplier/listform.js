import {
    PlusOutlined, UploadOutlined,
    ExportOutlined, ReloadOutlined,
    SearchOutlined, DownloadOutlined
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
import ShowForPermission from '../../basic/permission';
import ExcelJS from "exceljs";
import saveAs from "file-saver";


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

    /////////////////

    const exportExcel = () => {
        var ExcelJSWorkbook = new ExcelJS.Workbook();
        var worksheet = ExcelJSWorkbook.addWorksheet("NhaCungCap");

        worksheet.mergeCells("A2:E2");

        const customCell = worksheet.getCell("A2");
        customCell.font = {
            name: "Times New Roman",
            family: 4,
            size: 20,
            underline: true,
            bold: true,
        };
        customCell.alignment = { vertical: 'middle', horizontal: 'center' };

        customCell.value = "Danh sách nhà cung cấp";

        let header = ["Mã nhà cung cấp", "Tên nhà cung cấp", "Số điện thoại", "Email", "Ghi chú"];

        var headerRow = worksheet.addRow();
        var headerRow = worksheet.addRow();
        var headerRow = worksheet.addRow();

        worksheet.getRow(5).font = { bold: true };

        for (let i = 0; i < 5; i++) {
            let currentColumnWidth = "123";
            worksheet.getColumn(i + 1).width =
                currentColumnWidth !== undefined ? currentColumnWidth / 6 : 20;
            let cell = headerRow.getCell(i + 1);
            cell.value = header[i];
        }

        worksheet.autoFilter = {
            from: {
                row: 5,
                column: 1
            },
            to: {
                row: 5,
                column: 5
            }
        };

        data.forEach(element => {
            let status ="";
            if(element.is_active == true){
                status ="Hoạt động";
            }else{
                status="Khóa";
            }
            worksheet.addRow([element.code, element.name, element.phone, element.email, element.note]);
        });

        ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
            saveAs(
                new Blob([buffer], { type: "application/octet-stream" }),
                `DSNhaCungCap.xlsx`
            );
        });
    };

    ////////////////

    return (
        <ListForm
            title="Nhà cung cấp"
            actions={[
                <Button onClick={() => handleGetData()} icon={<ReloadOutlined />}>Làm mới</Button>,
                
                <ShowForPermission >
                    <Upload showUploadList={false} {...uploadData}>
                        <Button icon={<UploadOutlined />}>Nhập Excel</Button>
                    </Upload>
                </ShowForPermission>,
                
                <ShowForPermission >
                    <Button onClick={() => exportExcel()}> <DownloadOutlined /> Xuất Excel</Button>
                </ShowForPermission>,
                <ShowForPermission >
                    <Button onClick={() => navigate(paths.supplier.add)} type="primary" icon={<PlusOutlined />}>Thêm</Button>
                </ShowForPermission>,
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