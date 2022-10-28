import {
    PlusOutlined,
    ReloadOutlined,
    SearchOutlined, DownloadOutlined
  } from '@ant-design/icons';
import { Button, Input, message,Upload } from 'antd';
import React, { useState, useEffect } from 'react';
import ListForm from '../templates/listform';
import CustomerGroupTable from './table';
import api from '../../../api/apis'
import { useNavigate } from 'react-router-dom'
import paths from '../../../utils/paths'
import messages from '../../../utils/messages'
import ShowForPermission from '../../basic/permission';
import ExcelJS from "exceljs";
import saveAs from "file-saver";

const CustomerGroupListForm = (props) => {
    const [dataMain, setDataMain] = useState([])
    const [data, setData] = useState([])
    const [filteredInfo, setFilteredInfo] = useState({})
    const [searchInfo, setSearchInfo] = useState([])
    const [dataSearchCode, setDataSearchCode] = useState('')
    const [dataSearchName, setDataSearchName] = useState("")
    const [sortedInfo, setSortedInfo] = useState({})
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    
    const handleGetData = async () => {
        setLoading(true)
        try{
            const response = await api.customer_group.list()
            const _data = response.data.data.results.map(elm => {
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
        setDataSearchCode('')
        setFilteredInfo({})
        setSortedInfo({})
        setSearchInfo([])
    };

    const searchCode = (value) =>{
        setDataSearchCode(value);
        let data_ = [];
        dataMain.forEach(element => {
            if(element.id.toString().toLowerCase().includes(value.toLowerCase())){
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

    /////////////////

    const exportExcel = () => {
        var ExcelJSWorkbook = new ExcelJS.Workbook();
        var worksheet = ExcelJSWorkbook.addWorksheet("NhomKhachHang");

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

        customCell.value = "Danh sách nhóm khách hàng";

        let header = ["Mã nhóm khách hàng", "Tên nhóm khách hàng", "Mô tả", "Ghi chú"];

        var headerRow = worksheet.addRow();
        var headerRow = worksheet.addRow();
        var headerRow = worksheet.addRow();

        worksheet.getRow(5).font = { bold: true };

        for (let i = 0; i < 4; i++) {
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
                column: 4
            }
        };

        data.forEach(element => {
            
            worksheet.addRow([element.id, element.name, element.description, element.note]);
        });

        ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
            saveAs(
                new Blob([buffer], { type: "application/octet-stream" }),
                `DSNhomKhachHang.xlsx`
            );
        });
    };

    ////////////////

    return (
        <ListForm 
            title="Nhóm khách hàng" 
            actions={[
                <Button onClick={() => handleGetData()} icon={<ReloadOutlined/>}>Làm mới</Button>,
                <ShowForPermission>
                    <Button onClick={() => exportExcel()}> <DownloadOutlined /> Xuất Excel</Button>
                </ShowForPermission>,
                <Button onClick={() => navigate(paths.customer_group.add)} type="primary" icon={<PlusOutlined />}>Thêm</Button>,
            ]}
            table={
                <CustomerGroupTable 
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
                    clearFiltersAndSort={clearFiltersAndSort}
                />
            }
            extra_actions={[
                <Input 
                    placeholder="Tìm kiếm nhóm khách hàng" 
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
                <Button onClick={clearFiltersAndSort}>Xóa lọc</Button>
            ]}
        >

        </ListForm>
    )
}

export default CustomerGroupListForm;