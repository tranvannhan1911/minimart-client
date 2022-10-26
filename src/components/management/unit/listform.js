import {
    PlusOutlined, UploadOutlined,
    ExportOutlined, ReloadOutlined,
    SearchOutlined, DownloadOutlined
} from '@ant-design/icons';
import { Button, Col, Row, Space, Input, message, Upload, Modal } from 'antd';
import { Typography } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import ListForm from '../templates/listform';
import UnitTable from './table';
import api from '../../../api/apis'
import { useNavigate } from 'react-router-dom'
import paths from '../../../utils/paths'
import messages from '../../../utils/messages'
import { ExportReactCSV } from '../../../utils/exportExcel';
import * as XLSX from 'xlsx';
import ShowForPermission from '../../basic/permission';
import ExcelJS from "exceljs";
import saveAs from "file-saver";


const UnitListForm = (props) => {
    const [dataMain, setDataMain] = useState([])
    const [data, setData] = useState([])
    const [filteredInfo, setFilteredInfo] = useState({})
    const [searchInfo, setSearchInfo] = useState([])
    const [dataSearchName, setDataSearchName] = useState("")
    const [dataSearchId, setDataSearchId] = useState("")
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
                    const response = await api.unit.add({ "name": element.name, "note": element.note });
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
            const response = await api.unit.list()
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
        setDataSearchName("")
        setDataSearchId("")
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

    const searchId = (value) =>{
        setDataSearchId(value);
        let data_ = [];
        dataMain.forEach(element => {
            if(element.code.toString().toLowerCase().includes(value.toLowerCase())){
                data_.push(element);
            }
        });
        setData(data_);
    }

    /////////////////

    const exportExcel = () => {
        var ExcelJSWorkbook = new ExcelJS.Workbook();
        var worksheet = ExcelJSWorkbook.addWorksheet("DonViTinh");

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

        customCell.value = "Danh sách đơn vị tính";

        let header = ["Mã đơn vị tính", "Tên đơn vị tính", "Ghi chú"];

        var headerRow = worksheet.addRow();
        var headerRow = worksheet.addRow();
        var headerRow = worksheet.addRow();

        worksheet.getRow(5).font = { bold: true };

        for (let i = 0; i < 3; i++) {
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
                column: 3
            }
        };

        data.forEach(element => {
            
            worksheet.addRow([element.code, element.name, element.note]);
        });

        ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
            saveAs(
                new Blob([buffer], { type: "application/octet-stream" }),
                `DSDonViTinh.xlsx`
            );
        });
    };

    ////////////////

    return (
        <ListForm
            title="Đơn vị tính"
            actions={[
                <Button onClick={() => handleGetData()} icon={<ReloadOutlined />}>Làm mới</Button>,
                
                <ShowForPermission>
                    <Upload showUploadList={false} {...uploadData}>
                        <Button icon={<UploadOutlined />}>Nhập Excel</Button>
                    </Upload>
                </ShowForPermission>,
                <ShowForPermission>
                    <Button onClick={() => exportExcel()}> <DownloadOutlined /> Xuất Excel</Button>
                </ShowForPermission>,
                <ShowForPermission>
                    <Button onClick={() => navigate(paths.unit.add)} type="primary" icon={<PlusOutlined />}>Thêm</Button>
                </ShowForPermission>,
            ]}
            table={
                <UnitTable
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
                    dataSearchId={searchId}
                    clearFiltersAndSort={clearFiltersAndSort}
                />
            }
            extra_actions={[
                <Input
                    placeholder="Tìm kiếm đơn vị tính"
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

export default UnitListForm;