import {
    PlusOutlined,
    ReloadOutlined,
    SearchOutlined, DownloadOutlined
} from '@ant-design/icons';
import { Button, Input, message} from 'antd';
import React, { useState, useEffect,  } from 'react';
import ListForm from '../templates/listform';
import StaffTable from './table';
import api from '../../../api/apis'
import { useNavigate } from 'react-router-dom'
import paths from '../../../utils/paths'
import messages from '../../../utils/messages'
import ExcelJS from "exceljs";
import saveAs from "file-saver";

const StaffListForm = (props) => {
    const [dataMain, setDataMain] = useState([])
    const [data, setData] = useState([])
    const [filteredInfo, setFilteredInfo] = useState({})
    const [searchInfo, setSearchInfo] = useState([])
    const [dataSearchCode, setDataSearchCode] = useState('')
    const [dataSearchName, setDataSearchName] = useState("")
    const [dataSearchPhone, setDataSearchPhone] = useState('')
    const [sortedInfo, setSortedInfo] = useState({})
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
      document.title = "Nhân viên - Quản lý siêu thị mini NT"
    }, [])

    
    const handleGetData = async () => {
        setLoading(true)
        try {
            const response = await api.staff.list()
            const _data = response.data.data.results.map(elm => {
                elm.key = elm.id
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
                if (elm.is_manager == true) {
                    elm.is_manager = "Quản lý";
                } else {
                    elm.is_manager = "Nhân viên";
                }
                if (elm.date_joined != null) {
                    let datej = elm.date_joined.slice(0, 10);
                    let timej = elm.date_joined.slice(11, 19);
                    elm.date_joined = datej + " " + timej;
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

    useEffect(() => {
        handleGetData()
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
        var worksheet = ExcelJSWorkbook.addWorksheet("DSNhanVien", {views: [{showGridLines: false}]});

        worksheet.mergeCells("A1:H1");

        const customCell1 = worksheet.getCell("A1");
        customCell1.font = {
            name: "Times New Roman",
            family: 4,
            size: 8,
        };
        customCell1.value = "Tên cửa hàng: SIÊU THỊ MINI NT";

        worksheet.mergeCells("A2:H2");

        const customCell2 = worksheet.getCell("A2");
        customCell2.font = {
            name: "Times New Roman",
            family: 4,
            size: 8,
        };
        customCell2.value = "Địa chỉ: Gò Vấp - Tp.Hồ Chí Minh";

        worksheet.mergeCells("A3:H3");

        const customCell3 = worksheet.getCell("A3");
        customCell3.font = {
            name: "Times New Roman",
            family: 4,
            size: 8,
        };
        const day = new Date();
        customCell3.value = "Ngày in: " + day.getDate() + "/" + (day.getMonth() + 1) + "/" + day.getFullYear();

        worksheet.mergeCells("A4:H4");

        const customCell4 = worksheet.getCell("A4");
        customCell4.font = {
            name: "Times New Roman",
            family: 4,
            size: 8,
        };
        customCell4.value = "Người xuất báo cáo: " + sessionStorage.getItem("nameStaff") + ' - ' + sessionStorage.getItem("phoneStaff");

        worksheet.mergeCells("A5:H5");

        const customCell = worksheet.getCell("A5");
        customCell.font = {
            name: "Times New Roman",
            family: 4,
            size: 14,
            bold: true,
        };
        customCell.alignment = { vertical: 'middle', horizontal: 'center' };

        worksheet.mergeCells("A6:H6");

        const customCell5 = worksheet.getCell("A6");
        customCell5.font = {
            name: "Times New Roman",
            family: 4,
            size: 8,
        };
        customCell5.alignment = { vertical: 'middle', horizontal: 'center' };

        let headerColumn = ["A", "B", "C", "D", "E", "F", "G", "H"];

        var headerRow = worksheet.addRow();

        worksheet.getRow(7).font = { bold: true };
        worksheet.getRow(7).height = "25";

        customCell.value = "Danh sách nhân viên";

        let header = ["STT","Mã nhân viên", "Tên nhân viên", "Số điện thoại", "Giới tính","Vị trí", "Trạng thái", "Ghi chú"];

        for (let i = 0; i < headerColumn.length; i++) {
            const columnn = worksheet.getCell(headerColumn[i] + 7);
            columnn.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            columnn.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'ffb0e2ff' },
                bgColor: { argb: 'ffb0e2ff' }
            };
            if (i == 0) {
                worksheet.getColumn(i + 1).width = "10";
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
                column: 8
            }
        };
        let i = 1;
        data.forEach(element => {
            let status ="";
            if(element.is_active == true){
                status ="Hoạt động";
            }else{
                status="Ngưng hoạt động";
            }
            worksheet.addRow([i,element.id, element.fullname, element.phone, element.gender, element.is_manager, status, element.note]);
            for (let j = 0; j < headerColumn.length; j++) {
                const columnn = worksheet.getCell(headerColumn[j] + (i + 7));
                columnn.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                if (j == 0) {
                    columnn.alignment = { vertical: 'middle', horizontal: 'center' };
                }else if(j ==1){
                    columnn.alignment = { vertical: 'middle', horizontal: 'left' };
                }
                
            }

            i++;
        });

        ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
            saveAs(
                new Blob([buffer], { type: "application/octet-stream" }),
                `DSNhanVien${day.getDate()}${day.getMonth()+1}${day.getFullYear()}${day.getHours()}${day.getMinutes()}${day.getSeconds()}.xlsx`
            );
        });
    };

    ////////////////

    return (
        <>
            {/* <ModalStaff >
        </ModalStaff> */}
            <ListForm
                title="Nhân viên"
                actions={[
                    <Button onClick={() => handleGetData()} icon={<ReloadOutlined />}>Làm mới</Button>,
                    <Button onClick={() => exportExcel()}> <DownloadOutlined /> Xuất Excel</Button>,
                    <Button onClick={() => navigate(paths.staff.add)} type="primary" icon={<PlusOutlined />}>Thêm</Button>,
                ]}
                table={<StaffTable
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
                    clearFiltersAndSort={clearFiltersAndSort}
                    />}
                extra_actions={[
                    <Input
                        placeholder="Tìm kiếm nhân viên"
                        allowClear value={searchInfo[0]}
                        prefix={<SearchOutlined />}
                        onChange={(e) => setSearchInfo([e.target.value])} />,
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

            </ListForm></>
    )
}

export default StaffListForm;