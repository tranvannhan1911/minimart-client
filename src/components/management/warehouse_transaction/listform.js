import {
    PlusOutlined, ImportOutlined,
    ExportOutlined, ReloadOutlined,
    SearchOutlined, DownloadOutlined
} from '@ant-design/icons';
import { Button, Col, Row, Space, Input, message, Modal, DatePicker } from 'antd';
import { Typography } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import ListForm from '../templates/listform';
import WarehouseTransactionTable from './table';
import api from '../../../api/apis'
import { useNavigate } from 'react-router-dom'
import paths from '../../../utils/paths'
import messages from '../../../utils/messages'
import axios from 'axios';
import { ExportReactCSV } from '../../../utils/exportExcel';
import ShowForPermission from '../../basic/permission';
import ExcelJS from "exceljs";
import saveAs from "file-saver";
const { RangePicker } = DatePicker;

const WarehouseTransactionListForm = (props) => {
    const [dataMain, setDataMain] = useState([])
    const [data, setData] = useState([])
    const [filteredInfo, setFilteredInfo] = useState({})
    const [searchInfo, setSearchInfo] = useState([])
    const [searchDate, setSearchDate] = useState([])
    const [dataSearchId, setDataSearchId] = useState("")
    const [dataSearchProduct, setDataSearchProduct] = useState("")
    const [sortedInfo, setSortedInfo] = useState({})
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const handleGetData = async () => {
        setLoading(true)
        try {
            
            const response = await api.warehouse_transaction.list()
            console.log(response.data.data)
            const _data = response.data.data.results.map(elm => {
                elm.key = elm.id;
                let date = elm.date_created.slice(0, 10);
                let time = elm.date_created.slice(11, 19);
                elm.date_created = date + " " + time;                
                // elm.change = elm.change > 0 ? `+${elm.change}` : elm.change;
                // elm.unit_exchange = elm.reference?.unit_exchange?.unit_name;
                // elm.unit_exchange = elm.product.base_unit.name;
                // if(elm.reference && elm.reference.unit_exchange)
                //     elm.quantity_base_unit = elm.reference.quantity * elm.reference.unit_exchange.value + " " + elm.reference?.unit_exchange.unit_name
                // else
                //     elm.quantity_base_unit = elm.reference.quantity
                
                
                console.log("elm", elm)
                if(elm.reference){
                    let reference='';
                    let link="";
                    if(elm.type.type == "promotion"){
                        reference="";
                    }else if(elm.type.type == "order" || elm.type.type == "order_cancel"){
                        reference=elm.reference.order;
                    }else if(elm.type.type == "inventory_receiving" || elm.type.type == "inventory_receiving_cancel"){
                        reference=elm.reference.receiving_voucher
                    }else if(elm.type.type == "refund"){
                        reference=elm.reference.receiving_voucher
                    }else if(elm.type.type == "inventory" || elm.type.type == "inventory_cancel"){
                        reference=elm.reference.receiving_voucher
                    }

                    let elmm={
                        key: elm.id,
                        id: elm.id,
                        unit: elm.product.base_unit.name,
                        product: elm.product.name,
                        change: elm.change > 0 ? `+${elm.change}` : elm.change,
                        date_created: date + " " + time,
                        reference: reference,
                        type: elm.type.type_name,
                        note: elm.note,
                        link: link
                    }
                    return elmm;
                }
                elm.product_obj = elm.product;
                elm.product = elm.product.name;
                elm.type = elm.type.type_name;
                elm.change = elm.change > 0 ? `+${elm.change}` : elm.change;
                // elm.reference = elm.product.base_unit.name;
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
        setSearchDate([])
        setDataSearchId("")
        setDataSearchProduct("")
        setFilteredInfo({})
        setSortedInfo({})
        setSearchInfo([])
    };

    const onChange = (dates, dateStrings) => {
        if (dates) {
            setSearchDate([dates[0],dates[1]])
            setLoading(true);
            console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
            const datest = new Date(dateStrings[0].slice(0, 10));
            const dateen = new Date(dateStrings[1].slice(0, 10));
            let data_ = [];
            dataMain.forEach(elm => {
                const datecr = new Date(elm.date_created.slice(0, 10));
                if (datest <= datecr && datecr <= dateen) {
                    data_.push(elm);
                }
            });
            // console.log(data_)
            console.log(data_);
            setData(data_);
            setLoading(false);
        } else {
            console.log('Clear');
            setSearchDate([])
            setData(dataMain)
        }
    };

    const searchProduct = (value) => {
        setDataSearchProduct(value);
        let data_ = [];
        dataMain.forEach(element => {
            if (element.product.toLowerCase().includes(value.toLowerCase())) {
                data_.push(element);
            }
        });
        setData(data_);
    }

    const searchId = (value) => {
        setDataSearchId(value);
        let data_ = [];
        dataMain.forEach(element => {
            if (element.id.toString().toLowerCase().includes(value.toLowerCase())) {
                data_.push(element);
            }
        });
        setData(data_);
    }

    /////////////////

    const exportExcel = () => {
        var ExcelJSWorkbook = new ExcelJS.Workbook();
        var worksheet = ExcelJSWorkbook.addWorksheet("BienDongKho");

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

        customCell.value = "Danh sách biến động kho";

        let header = ["Mã biến động kho", "Sản phẩm", "Số lượng thay đổi", "Đơn vị tính", "Loại thay đổi","Mã đối tượng thay đổi","Ngày thay đổi", "Ghi chú"];

        var headerRow = worksheet.addRow();
        var headerRow = worksheet.addRow();
        var headerRow = worksheet.addRow();

        worksheet.getRow(5).font = { bold: true };

        for (let i = 0; i < 8; i++) {
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
                column: 8
            }
        };

        data.forEach(element => {
            
            worksheet.addRow([element.id, element.product, element.change, element.unit, element.type, element.reference, element.date_created, element.note]);
        });

        ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
            saveAs(
                new Blob([buffer], { type: "application/octet-stream" }),
                `DSBienDongKho.xlsx`
            );
        });
    };

    ////////////////

    return (
        <>
            {/* <ModalStaff >

        </ModalStaff> */}
            <ListForm
                title="Lịch sử biến động kho"
                actions={[
                    <Button onClick={() => handleGetData()} icon={<ReloadOutlined />}>Làm mới</Button>,
                    
                    <ShowForPermission >
                        <Button onClick={() => exportExcel()}> <DownloadOutlined /> Xuất Excel</Button>
                    </ShowForPermission>,
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
                    setSortedInfo={setSortedInfo} 
                    dataSearchId={searchId} 
                    dataSearchProduct={searchProduct}
                    clearFiltersAndSort={clearFiltersAndSort}
                    />}
                extra_actions={[
                    <Input
                        placeholder="Tìm kiếm biến động kho"
                        allowClear value={searchInfo[0]}
                        prefix={<SearchOutlined />}
                        onChange={(e) => setSearchInfo([e.target.value])} />,
                    <RangePicker value={searchDate}
                        onChange={onChange}
                    />,
                    // <Input
                    //     placeholder="Tìm kiếm theo sản phẩm"
                    //     allowClear value={dataSearchProduct}
                    //     prefix={<SearchOutlined />}
                    //     onChange={(e) => searchProduct(e.target.value)}
                    // />,
                    <Button onClick={clearFiltersAndSort}>Xóa lọc</Button>
                ]}
            >

            </ListForm></>
    )
}

export default WarehouseTransactionListForm;