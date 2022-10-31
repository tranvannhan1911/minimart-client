import {
    PlusOutlined, ReloadOutlined,
    SearchOutlined, DownloadOutlined
} from '@ant-design/icons';
import { Button, Input, message, DatePicker } from 'antd';
import React, { useState, useEffect, } from 'react';
import ListForm from '../templates/listform';
import InventoryRecordTable from './table';
import api from '../../../api/apis'
import { useNavigate } from 'react-router-dom'
import paths from '../../../utils/paths'
import messages from '../../../utils/messages'
import { ExportReactCSV } from '../../../utils/exportExcel';
import ShowForPermission from '../../basic/permission';
import { ExportTemplateReactCSV } from '../../../utils/exportTemplate';
import ExcelJS from "exceljs";
import saveAs from "file-saver";

const { RangePicker } = DatePicker;

const InventoryRecordListForm = (props) => {
    const [dataMain, setDataMain] = useState([])
    const [data, setData] = useState([])
    const [filteredInfo, setFilteredInfo] = useState({})
    const [searchInfo, setSearchInfo] = useState([])
    const [dataSearchId, setDataSearchId] = useState("")
    const [dataSearchUserCreated, setDataSearchUserCreated] = useState("")
    const [searchDate, setSearchDate] = useState([])
    const [sortedInfo, setSortedInfo] = useState({})
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const handleGetData = async () => {
        setLoading(true)
        try {
            const response = await api.inventory_record.list()
            const _data = response.data.data.results.map(elm => {
                elm.key = elm.id

                elm.user_created = elm.user_created?.fullname;
                let date = elm.date_created.slice(0, 10);
                let time = elm.date_created.slice(11, 19);
                elm.date_created = date + " " + time;
                elm.date_updated = elm.date_updated
                    ? elm.date_updated.slice(0, 10) + " " + elm.date_updated.slice(11, 19)
                    : null;

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
        setDataSearchUserCreated("")
        setFilteredInfo({})
        setSortedInfo({})
        setSearchInfo([])
    };

    const onChange = (dates, dateStrings) => {
        if (dates) {
            setLoading(true);
            setSearchDate([dates[0], dates[1]])
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
            setDataSearchId("")
            setDataSearchUserCreated("")
            setData(dataMain)
        }
    };

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

    const searchUserCreated = (value) => {
        setDataSearchUserCreated(value);
        let data_ = [];
        dataMain.forEach(element => {
            if (element.user_created != null) {
                if (element.user_created.toLowerCase().includes(value.toLowerCase())) {
                    data_.push(element);
                }
            }
        });
        setData(data_);
    }

    /////////////////

    const exportExcel = () => {
        var ExcelJSWorkbook = new ExcelJS.Workbook();
        var worksheet = ExcelJSWorkbook.addWorksheet("DSPhieuKiemKe");

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

        customCell.value = "Danh sách phiếu kiểm kê";

        let header = ["Mã phiếu kiểm kê", "Người kiểm kê", "Ngày kiểm kê", "Trạng thái", "Ghi chú"];

        var headerRow = worksheet.addRow();
        var headerRow = worksheet.addRow();
        var headerRow = worksheet.addRow();

        worksheet.getRow(5).font = { bold: true };

        for (let i = 0; i < 6; i++) {
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
                column: 6
            }
        };

        data.forEach(element => {
            let status = "";
            if (element.status == "complete") {
                status = "Hoàn thành";
            } else if (element.status == "pending") {
                status = "Chờ xác nhận";
            } else {
                status = "Hủy";
            }
            worksheet.addRow([element.id, element.user_created, element.date_created, status, element.note]);
        });

        ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
            saveAs(
                new Blob([buffer], { type: "application/octet-stream" }),
                `DSPhieuKiemKe.xlsx`
            );
        });
    };

    ////////////////

    return (
        <>

            <ListForm
                title="Phiếu kiểm kê"
                actions={[
                    <Button onClick={() => handleGetData()} icon={<ReloadOutlined />}>Làm mới</Button>,

                    <ShowForPermission>
                        <Button onClick={() => exportExcel()}> <DownloadOutlined /> Xuất Excel</Button>
                    </ShowForPermission>,
                    <ShowForPermission>
                        <ExportTemplateReactCSV csvData={[]} fileName='template_kiem_ke.xlsx'
                            header={[
                                { label: 'maSP', key: 'maSP' },
                                { label: 'soluong', key: 'soluong' },
                                { label: 'ghichu', key: 'ghichu' },
                                { label: '(So luong theo don vi co ban)', key: 'note' },
                            ]}
                        />
                    </ShowForPermission>,
                    <ShowForPermission>
                        <Button onClick={() => navigate(paths.inventory_record.add)} type="primary" icon={<PlusOutlined />}>Kiểm kê</Button>
                    </ShowForPermission>,
                ]}
                table={<InventoryRecordTable
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
                    dataSearchUserCreated={searchUserCreated}
                    clearFiltersAndSort={clearFiltersAndSort}
                />}
                extra_actions={[
                    <Input
                        placeholder="Tìm kiếm phiếu kiểm kê"
                        allowClear value={searchInfo[0]}
                        prefix={<SearchOutlined />}
                        onChange={(e) => setSearchInfo([e.target.value])} />,
                    <RangePicker value={searchDate}
                        onChange={onChange}
                    />,
                    <Button onClick={clearFiltersAndSort}>Xóa lọc</Button>
                ]}
            >

            </ListForm></>
    )
}

export default InventoryRecordListForm;