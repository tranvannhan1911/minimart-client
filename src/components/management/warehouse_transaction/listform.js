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

    useEffect(() => {
      document.title = "Biến động kho - Quản lý siêu thị mini NT"
    }, [])

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
                // if (elm.reference) {
                //     let reference = '';
                //     let link = "";
                //     if (elm.type.type == "order" || elm.type.type == "order_cancel" || elm.type.type == "promotion") {
                //         if (elm.reference == null) {
                //             reference = "";
                //         } else {
                //             reference = elm.reference.order;
                //         }
                //     } else if (elm.type.type == "inventory_receiving" || elm.type.type == "inventory_receiving_cancel") {
                //         reference = elm.reference.receiving_voucher
                //     } else if (elm.type.type == "refund") {
                //         reference = elm.reference.order_refund
                //     } else if (elm.type.type == "inventory" || elm.type.type == "inventory_cancel") {
                //         reference = elm.reference.receiving_voucher
                //     }

                //     let elmm = {
                //         key: elm.id,
                //         id: elm.id,
                //         unit: elm.product.base_unit.name,
                //         product: elm.product.name,
                //         change: elm.change > 0 ? `+${elm.change}` : elm.change,
                //         date_created: date + " " + time,
                //         reference: reference,
                //         type: elm.type.type_name,
                //         note: elm.note,
                //         link: link
                //     }
                //     return elmm;
                // }
                elm.unit = elm.product.base_unit.name
                elm.product_obj = elm.product;
                elm.product = elm.product.name;
                elm.type = elm.type.type_name;
                elm.change = elm.change > 0 ? `+${elm.change}` : elm.change;
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

        worksheet.mergeCells("A1:I1");

        const customCell1 = worksheet.getCell("A1");
        customCell1.font = {
            name: "Times New Roman",
            family: 4,
            size: 8,
        };
        customCell1.value = "Tên cửa hàng: SIÊU THỊ MINI";

        worksheet.mergeCells("A2:I2");

        const customCell2 = worksheet.getCell("A2");
        customCell2.font = {
            name: "Times New Roman",
            family: 4,
            size: 8,
        };
        customCell2.value = "Địa chỉ: Gò Vấp - Tp.Hồ Chí Minh";

        worksheet.mergeCells("A3:I3");

        const customCell3 = worksheet.getCell("A3");
        customCell3.font = {
            name: "Times New Roman",
            family: 4,
            size: 8,
        };
        const day = new Date();
        customCell3.value = "Ngày in: " + day.getDate() + "/" + (day.getMonth() + 1) + "/" + day.getFullYear();

        worksheet.mergeCells("A4:I4");

        const customCell4 = worksheet.getCell("A4");
        customCell4.font = {
            name: "Times New Roman",
            family: 4,
            size: 8,
        };
        customCell4.value = "Người xuất báo cáo: " + sessionStorage.getItem("nameStaff") + ' - ' + sessionStorage.getItem("phoneStaff");

        worksheet.mergeCells("A5:I5");

        const customCell = worksheet.getCell("A5");
        customCell.font = {
            name: "Times New Roman",
            family: 4,
            size: 14,
            bold: true,
        };
        customCell.alignment = { vertical: 'middle', horizontal: 'center' };

        worksheet.mergeCells("A6:I6");

        const customCell5 = worksheet.getCell("A6");
        customCell5.font = {
            name: "Times New Roman",
            family: 4,
            size: 8,
        };
        customCell5.alignment = { vertical: 'middle', horizontal: 'center' };

        let headerColumn = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

        var headerRow = worksheet.addRow();

        worksheet.getRow(7).font = { bold: true };

        customCell.value = "Danh sách biến động kho";

        let header = ["STT", "Mã biến động kho", "Sản phẩm", "Số lượng thay đổi", "Đơn vị tính", "Loại thay đổi", "Mã đối tượng thay đổi", "Ngày thay đổi", "Ghi chú"];

        for (let i = 0; i < headerColumn.length; i++) {
            const columnn = worksheet.getCell(headerColumn[i] + 7);
            columnn.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            if (i == 0) {
                worksheet.getColumn(i + 1).width = "10";
            } else if (i == 2) {
                worksheet.getColumn(i + 1).width = "30";
            } else {
                worksheet.getColumn(i + 1).width = "20";
            }
            columnn.alignment = { vertical: 'middle', horizontal: 'center' };
            columnn.value = header[i];
        }

        worksheet.autoFilter = {
            from: {
                row: 7,
                column: 1
            },
            to: {
                row: 7,
                column: 9
            }
        };
        let i = 1;
        data.forEach(element => {
            worksheet.addRow([i, element.id, element.product, element.change, element.unit, element.type, element.reference, element.date_created.slice(0, 10), element.note]);
            for (let j = 0; j < headerColumn.length; j++) {
                const columnn = worksheet.getCell(headerColumn[j] + (i + 7));
                columnn.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                if (j == 0 || j == 7 || j == 4) {
                    columnn.alignment = { vertical: 'middle', horizontal: 'center' };
                }
                else if (j == 1 || j == 2 || j == 5 || j == 6) {
                    columnn.alignment = { vertical: 'middle', horizontal: 'left' };
                } else {
                    columnn.alignment = { vertical: 'middle', horizontal: 'right' };
                }

            }

            i++;
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