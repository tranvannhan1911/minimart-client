import {
    ReloadOutlined,
    SearchOutlined, DownloadOutlined
} from '@ant-design/icons';
import { Button, Input, message, DatePicker } from 'antd';
import React, { useState, useEffect,  } from 'react';
import ListForm from '../templates/listform';
import OrderTable from './table';
import api from '../../../api/apis'
import moment from "moment";
import { useNavigate } from 'react-router-dom'
import messages from '../../../utils/messages'
import { ExportReactCSV } from '../../../utils/exportExcel';
import ShowForPermission from '../../basic/permission';
import ExcelJS from "exceljs";
import saveAs from "file-saver";

const { RangePicker } = DatePicker;

const OrderListForm = (props) => {
    const [dataMain, setDataMain] = useState([])
    const [data, setData] = useState([])
    const [dataProductGroups, setDataProductGroups] = useState([])
    const [filteredInfo, setFilteredInfo] = useState({})
    const [searchInfo, setSearchInfo] = useState([])
    const [searchDate, setSearchDate] = useState([])
    const [dataSearchId, setDataSearchId] = useState("")
    const [dataSearchCustomer, setDataSearchCustomer] = useState("")
    const [dataSearchStaff, setDataSearchStaff] = useState("")
    const [sortedInfo, setSortedInfo] = useState({})
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const handleGetData = async () => {
        setLoading(true)
        try {
            const response = await api.order.list()
            
            const _data = response.data.data.results.map(elm => {

                elm.details = elm.details.map(element => {
                    if (element.price == null) {
                        element.price = 0;
                    } else {
                        element.price = element.price.price
                    }
                    let index = {
                        "id": element.id,
                        "idProduct": element.product.id,
                        "idUnit": element.unit_exchange.id,
                        "product": element.product.name,
                        "unit_exchange": element.unit_exchange.unit_name,
                        "price": element.price,
                        "quantity": element.quantity,
                        "total": element.total,
                        "note": element.note,
                        "order": element.order,

                    }
                    return index;
                });

                let date = elm.date_created.slice(0, 10);
                let time = elm.date_created.slice(11, 19);
                elm.date_created = date + " " + time;
                // elm.date_created= moment(elm.date_created).format('DD-MM-YYYY h:mm:ss a')
                let index = {
                    "key": elm.id,
                    "details": elm.details,
                    "note": elm.note,
                    "total": elm.total,
                    "final_total": elm.final_total,
                    "status": elm.status,
                    "date_created": elm.date_created,
                    "date_updated": elm.date_updated,
                    "customer": elm.customer == null ? "Khách hàng lẻ" : elm.customer.fullname,
                    "user_created": elm.user_created == null ? "" : elm.user_created.fullname,
                    "user_updated": elm.user_updated,
                };
                return index;
            })
            // console.log(data)
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
        // handleGetDataProductGroups()
        props.setBreadcrumb(false)
    }, []);

    const clearFiltersAndSort = () => {
        setData(dataMain)
        setSearchDate([])
        setDataSearchCustomer("")
        setDataSearchStaff("")
        setDataSearchId("")
        setFilteredInfo({});
        setSortedInfo({});
        setSearchInfo([]);
    };

    const onChange = (dates, dateStrings) => {
        if (dates) {
            setSearchDate([dates[0], dates[1]])
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

    const searchId = (value) => {
        setDataSearchId(value);
        let data_ = [];
        dataMain.forEach(element => {
            if (element.key.toString().toLowerCase().includes(value.toLowerCase())) {
                data_.push(element);
            }
        });
        setData(data_);
    }

    const searchCustomer = (value) => {
        setDataSearchCustomer(value);
        let data_ = [];
        dataMain.forEach(element => {
            if (element.customer.toLowerCase().includes(value.toLowerCase())) {
                data_.push(element);
            }
        });
        setData(data_);
    }

    const searchStaff = (value) => {
        setDataSearchStaff(value);
        let data_ = [];
        dataMain.forEach(element => {
            if (element.user_created.toLowerCase().includes(value.toLowerCase())) {
                data_.push(element);
            }
        });
        setData(data_);
    }

    /////////////////

    const exportExcel = () => {
        var ExcelJSWorkbook = new ExcelJS.Workbook();
        var worksheet = ExcelJSWorkbook.addWorksheet("BanHang");

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

        customCell.value = "Danh sách hóa đơn bán hàng";

        let header = ["Mã hóa đơn", "Người bán", "Khách hàng", "Ngày bán", "Tổng tiền", "Khuyến mãi", "Thành tiền", "Trạng thái"];

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
            let status ="";
            if(element.status == "complete"){
                status ="Hoàn thành";
            }else{
                status="Đã hủy";
            }
            worksheet.addRow([element.key, element.user_created, element.customer, element.date_created, element.total, element.total-element.final_total,
            element.final_total, status]);
        });

        ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
            saveAs(
                new Blob([buffer], { type: "application/octet-stream" }),
                `BanHang.xlsx`
            );
        });
    };

    ////////////////

    return (
        <ListForm
            title="Hóa đơn bán hàng"
            actions={[

                <Button onClick={() => handleGetData()} icon={<ReloadOutlined />}>Làm mới</Button>,
                <ShowForPermission>
                    <Button onClick={() => exportExcel()}> <DownloadOutlined /> Xuất Excel</Button>
                </ShowForPermission>,
            ]}
            table={
                <OrderTable
                    data={data}
                    handleGetData={handleGetData}
                    dataProductGroups={dataProductGroups}
                    loading={loading}
                    setLoading={setLoading}
                    filteredInfo={filteredInfo}
                    setFilteredInfo={setFilteredInfo}
                    searchInfo={searchInfo}
                    setSearchInfo={setSearchInfo}
                    sortedInfo={sortedInfo}
                    setSortedInfo={setSortedInfo}
                    dataSearchId={searchId}
                    dataSearchStaff={searchStaff}
                    dataSearchCustomer={searchCustomer}
                    clearFiltersAndSort={clearFiltersAndSort}
                />
            }
            extra_actions={[
                <Input
                    placeholder="Tìm kiếm hóa đơn"
                    allowClear value={searchInfo[0]}
                    prefix={<SearchOutlined />}
                    onChange={(e) => setSearchInfo([e.target.value])}
                />,
                <RangePicker value={searchDate}
                    onChange={onChange}
                />,
                // <Input
                //     placeholder="Tìm kiếm theo nhân viên"
                //     allowClear value={dataSearchStaff}
                //     prefix={<SearchOutlined />}
                //     onChange={(e) => searchStaff(e.target.value)}
                // />,
                // <Input
                //     placeholder="Tìm kiếm theo khách hàng"
                //     allowClear value={dataSearchCustomer}
                //     prefix={<SearchOutlined />}
                //     onChange={(e) => searchCustomer(e.target.value)}
                // />,
                <Button onClick={clearFiltersAndSort}>Xóa lọc</Button>
            ]}
        >

        </ListForm>
    )
}

export default OrderListForm;