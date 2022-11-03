import {
    PlusOutlined, ReloadOutlined,
    SearchOutlined, DownloadOutlined
} from '@ant-design/icons';
import { Button, Input, message, DatePicker } from 'antd';
import React, { useState, useEffect,  } from 'react';
import ListForm from '../templates/listform';
import PriceTable from './table';
import api from '../../../api/apis'
import { useNavigate } from 'react-router-dom'
import paths from '../../../utils/paths'
import messages from '../../../utils/messages'
import { ExportReactCSV } from '../../../utils/exportExcel';
import ShowForPermission from '../../basic/permission';
import { ExportTemplateReactCSV } from '../../../utils/exportTemplate';
import ExcelJS from "exceljs";
import saveAs from "file-saver";


const PriceListForm = (props) => {
    const [dataMain, setDataMain] = useState([])
    const [data, setData] = useState([])
    const [filteredInfo, setFilteredInfo] = useState({})
    const [searchInfo, setSearchInfo] = useState([])
    const [dataSearchTitle, setDataSearchTitle] = useState("")
    const [dataSearchId, setDataSearchId] = useState("")
    const [dataSearchDate, setDataSearchDate] = useState("")
    const [sortedInfo, setSortedInfo] = useState({})
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
      document.title = "Bảng giá - Quản lý siêu thị mini NT"
    }, [])

    const handleGetData = async () => {
        setLoading(true)
        try {
            const response = await api.price.list()
            const _data = response.data.data.results.map(elm => {
                elm.key = elm.id

                let datest = elm.start_date.slice(0, 10);
                elm.start_date = datest;

                let dateen = elm.end_date.slice(0, 10);
                elm.end_date = dateen;

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
        setDataSearchDate("")
        setDataSearchTitle("")
        setDataSearchId("")
        setFilteredInfo({})
        setSortedInfo({})
        setSearchInfo([])
    };

    const onChange = (dates, dateStrings) => {
        if (dates) {
            setDataSearchDate(dates)
            setLoading(true);
            const datecr = new Date(dateStrings.slice(0, 10));
            let data_ = [];
            dataMain.forEach(elm => {
                const datest = new Date(elm.start_date.slice(0, 10));
                const dateen = new Date(elm.end_date.slice(0, 10));
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
            setDataSearchDate("")
            setData(dataMain)
        }
    };

    const searchTitle = (value) => {
        setDataSearchTitle(value);
        let data_ = [];
        dataMain.forEach(element => {
            if (element.name.toLowerCase().includes(value.toLowerCase())) {
                data_.push(element);
            }
        });
        setData(data_);
    }

    const searchId = (value) => {
        setDataSearchId(value);
        let data_ = [];
        dataMain.forEach(element => {
            if (element.price_list_id.toString().toLowerCase().includes(value.toLowerCase())) {
                data_.push(element);
            }
        });
        setData(data_);
    }

    /////////////////

    const exportExcel = () => {
        var ExcelJSWorkbook = new ExcelJS.Workbook();
        var worksheet = ExcelJSWorkbook.addWorksheet("DSBangGia");

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

        customCell.value = "Danh sách bảng giá";

        let header = ["Mã bảng giá", "Tiêu đề", "Ngày bắt đầu", "Ngày kết thúc", "Trạng thái", "Ghi chú"];

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
            if(element.status == true){
                status="Hoạt động";
            }else{
                status="Ngưng hoạt động";
            }
            worksheet.addRow([element.price_list_id, element.name, element.start_date, element.end_date, status,element.note]);
        });

        ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
            saveAs(
                new Blob([buffer], { type: "application/octet-stream" }),
                `DSBangGia.xlsx`
            );
        });
    };

    ////////////////

    return (
        <>

            <ListForm
                title="Bảng giá"
                actions={[
                    <Button onClick={() => handleGetData()} icon={<ReloadOutlined />}>Làm mới</Button>,
                    // <ShowForPermission>
                    //     <Button onClick={() => exportExcel()}> <DownloadOutlined /> Xuất Excel</Button>
                    // </ShowForPermission>,
                //     <ShowForPermission>
                //     <ExportTemplateReactCSV csvData={[]} fileName='template_bang_gia.xlsx'
                //         header={[
                //             { label: 'maSP', key: 'maSP' },
                //             { label: 'maDonVi', key: 'maDonVi' },
                //             { label: 'gia', key: 'gia' },
                //         ]}
                //     />
                // </ShowForPermission>,
                    <ShowForPermission>
                        <Button onClick={() => navigate(paths.price.add)} type="primary" icon={<PlusOutlined />}>Thêm</Button>
                    </ShowForPermission>,
                ]}
                table={<PriceTable
                    data={data}
                    loading={loading}
                    setLoading={setLoading}
                    filteredInfo={filteredInfo}
                    setFilteredInfo={setFilteredInfo}
                    searchInfo={searchInfo}
                    setSearchInfo={setSearchInfo}
                    sortedInfo={sortedInfo}
                    setSortedInfo={setSortedInfo} 
                    dataSearchName={searchTitle}
                    dataSearchId={searchId}
                    clearFiltersAndSort={clearFiltersAndSort}
                    />}
                extra_actions={[
                    // <Input
                    //     placeholder="Tìm kiếm bảng giá"
                    //     allowClear value={searchInfo[0]}
                    //     prefix={<SearchOutlined />}
                    //     onChange={(e) => setSearchInfo([e.target.value])} />,
                    // <Input
                    //     placeholder="Tìm kiếm theo tiêu đề"
                    //     allowClear value={dataSearchTitle}
                    //     prefix={<SearchOutlined />}
                    //     onChange={(e) => searchTitle(e.target.value)}
                    // />,
                    <DatePicker onChange={onChange} value={dataSearchDate} />,
                    <Button onClick={clearFiltersAndSort}>Xóa lọc</Button>
                ]}
            >

            </ListForm></>
    )
}

export default PriceListForm;