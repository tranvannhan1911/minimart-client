import {
    PlusOutlined, ReloadOutlined,
    SearchOutlined, DownloadOutlined
} from '@ant-design/icons';
import { Button, Input, message, Upload } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import ListForm from '../templates/listform';
import CustomerTable from './table';
import api from '../../../api/apis'
import { useNavigate } from 'react-router-dom'
import paths from '../../../utils/paths'
import messages from '../../../utils/messages'
import ShowForPermission from '../../basic/permission';
import ExcelJS from "exceljs";
import saveAs from "file-saver";


const CustomerListForm = (props) => {
    const [dataMain, setDataMain] = useState([])
    const [data, setData] = useState([])
    const [dataCustomerGroup, setDataCustomerGroup] = useState([])
    const [filteredInfo, setFilteredInfo] = useState({})
    const [searchInfo, setSearchInfo] = useState([])
    const [dataSearchCode, setDataSearchCode] = useState('')
    const [dataSearchName, setDataSearchName] = useState("")
    const [dataSearchPhone, setDataSearchPhone] = useState('')
    const [sortedInfo, setSortedInfo] = useState({})
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const refSearch = useRef()

    
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
        setDataSearchCode("")
        setDataSearchName("")
        setDataSearchPhone("")
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

    /////////////////

    const exportExcel = () => {
        var ExcelJSWorkbook = new ExcelJS.Workbook();
        var worksheet = ExcelJSWorkbook.addWorksheet("KhachHang");

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

        customCell.value = "Danh sách khách hàng";

        let header = ["Mã khách hàng", "Tên khách hàng", "Số điện thoại", "Giới tính","Nhóm khách hàng", "Trạng thái", "Ghi chú"];

        var headerRow = worksheet.addRow();
        var headerRow = worksheet.addRow();
        var headerRow = worksheet.addRow();

        worksheet.getRow(5).font = { bold: true };

        for (let i = 0; i < 7; i++) {
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
                column: 7
            }
        };

        data.forEach(element => {
            let status ="";
            if(element.is_active == true){
                status ="Hoạt động";
            }else{
                status="Khóa";
            }
            let nhomkh="";
            element.customer_group.forEach(elm => {
                nhomkh += elm;
            })
            worksheet.addRow([element.id, element.fullname, element.phone, element.gender, nhomkh, status, element.note]);
        });

        ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
            saveAs(
                new Blob([buffer], { type: "application/octet-stream" }),
                `DSKhachHang.xlsx`
            );
        });
    };

    ////////////////

    return (
        <ListForm
            title="Khách hàng"
            actions={[
                <Button onClick={() => handleGetData()} icon={<ReloadOutlined />}>Làm mới</Button>,
                <ShowForPermission>
                    <Button onClick={() => exportExcel()}> <DownloadOutlined /> Xuất Excel</Button>
                </ShowForPermission>,
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
                    dataSearchName={searchName}
                    dataSearchId={searchCode}
                    dataSearchPhone={searchPhone}
                    clearFiltersAndSort={clearFiltersAndSort}
                />
            }
            extra_actions={[
                <Input
                    placeholder="Tìm kiếm khách hàng"
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
                <Button onClick={clearFiltersAndSort}>Xóa lọc</Button>
            ]}
        >

        </ListForm>
    )
}

export default CustomerListForm;