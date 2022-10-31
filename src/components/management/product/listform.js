import {
    PlusOutlined, ReloadOutlined,
    SearchOutlined, DownloadOutlined
} from '@ant-design/icons';
import { Button, Input, message } from 'antd';
import React, { useState, useEffect, } from 'react';
import ListForm from '../templates/listform';
import PriceTable from './table';
import api from '../../../api/apis'
import { useNavigate } from 'react-router-dom'
import paths from '../../../utils/paths'
import messages from '../../../utils/messages'
import { ExportReactCSV } from '../../../utils/exportExcel';
import ShowForPermission from '../../basic/permission';
import ExcelJS from "exceljs";
import saveAs from "file-saver";

const PriceListForm = (props) => {
    const [dataMain, setDataMain] = useState([])
    const [data, setData] = useState([])
    const [dataProductGroups, setDataProductGroups] = useState([])
    const [dataCategory, setDataCategory] = useState([])
    const [filteredInfo, setFilteredInfo] = useState({})
    const [searchInfo, setSearchInfo] = useState([])
    const [sortedInfo, setSortedInfo] = useState({})
    const [loading, setLoading] = useState(true)
    const [dataSearchName, setDataSearchName] = useState("")
    const [dataSearchCode, setDataSearchCode] = useState('')
    const [dataSearchBarcode, setDataSearchBarcode] = useState("")
    const navigate = useNavigate()

    const handleGetData = async () => {
        setLoading(true)
        try {
            const response = await api.product.list()
            console.log("handleGetData", response)
            const _data = response.data.data.results.map(elm => {
                const _product_groups = []
                elm.product_groups.forEach(gr => _product_groups.push(gr.name));
                elm.product_groups = _product_groups;
                // elm.base_unit= elm.base_unit.name;
                elm.stock = elm.stock + "";
                elm.product_category = elm.product_category ? elm.product_category.name : "";

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

    const handleGetDataProductGroups = async () => {
        setLoading(true)
        try {
            const response = await api.product_group.list()
            setDataProductGroups(response.data.data.results)
        } catch (error) {
            console.log('Failed:', error)
            message.error(messages.ERROR_REFRESH)
        }
        setLoading(false)
    }

    const handleGetDataCategory = async () => {
        setLoading(true)
        try {
            const response = await api.category.list()
            setDataCategory(response.data.data.results)
        } catch (error) {
            console.log('Failed:', error)
            message.error(messages.ERROR_REFRESH)
        }
        setLoading(false)
    }

    useEffect(() => {
        handleGetData()
        handleGetDataProductGroups()
        handleGetDataCategory()
        props.setBreadcrumb(false)
    }, []);

    const clearFiltersAndSort = () => {
        setData(dataMain)
        setDataSearchName("")
        setDataSearchCode("")
        setDataSearchBarcode("")
        setFilteredInfo({})
        setSortedInfo({})
        setSearchInfo([])
    };

    const searchName = (value) => {
        setDataSearchName(value);
        let data_ = [];
        dataMain.forEach(element => {
            if (element.name.toLowerCase().includes(value.toLowerCase())) {
                data_.push(element);
            }
        });
        setData(data_);
    }

    const searchCode = (value) => {
        setDataSearchCode(value);
        let data_ = [];
        dataMain.forEach(element => {
            if (element.product_code.toLowerCase().includes(value.toLowerCase())) {
                data_.push(element);
            }
        });
        setData(data_);
    }

    const searchBarcode = (value) => {
        setDataSearchBarcode(value);
        let data_ = [];
        dataMain.forEach(element => {
            if (element.barcode.toString().toLowerCase().includes(value.toString().toLowerCase())) {
                data_.push(element);
            }
        });
        setData(data_);
    }

    /////////////////

    const exportExcel = () => {
        var ExcelJSWorkbook = new ExcelJS.Workbook();
        var worksheet = ExcelJSWorkbook.addWorksheet("SanPham");

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

        customCell.value = "Danh sách sản phẩm";

        worksheet.mergeCells("A6:I6");

        const customCell5 = worksheet.getCell("A6");
        customCell5.font = {
            name: "Times New Roman",
            family: 4,
            size: 8,
        };
        customCell5.alignment = { vertical: 'middle', horizontal: 'center' };

        // customCell5.value = "Từ ngày: " + date[0].slice(0, 10) + "      Đến ngày: " + date[1].slice(0, 10) + " ";


        let header = ["STT", "Mã sản phẩm", "Tên sản phẩm", "Mã vạch", "Đơn vị tính", "Số lượng tồn", "Nhóm sản phẩm", "Ngành hàng", "Mô tả"];

        let headerColumn = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

        // worksheet.mergeCells("A7:I7");
        var headerRow = worksheet.addRow();

        worksheet.getRow(7).font = { bold: true };

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
            } else if (i == 8) {
                worksheet.getColumn(i + 1).width = "80";
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
            let nhomsp = "";
            element.product_groups.forEach(elm => {
                nhomsp += elm + ", ";
            })
            worksheet.addRow([i, element.product_code, element.name, element.barcode, element.base_unit.name, element.stock, nhomsp,
                element.product_category, element.description]);
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
                }else if(j == 5){
                    columnn.alignment = { vertical: 'middle', horizontal: 'right' };
                }

            }

            i++;

        });

        ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
            saveAs(
                new Blob([buffer], { type: "application/octet-stream" }),
                `DSSanPham.xlsx`
            );
        });
    };

    ////////////////

    return (
        <ListForm
            title="Sản phẩm"
            actions={[

                <Button onClick={() => handleGetData()} icon={<ReloadOutlined />}>Làm mới</Button>,

                <ShowForPermission>
                    <Button onClick={() => exportExcel()}> <DownloadOutlined /> Xuất Excel</Button>
                </ShowForPermission>,
                <ShowForPermission>
                    <Button onClick={() => navigate(paths.product.add)} type="primary" icon={<PlusOutlined />}>Thêm</Button>
                </ShowForPermission>,
            ]}
            table={
                <PriceTable
                    data={data}
                    dataProductGroups={dataProductGroups}
                    dataCategory={dataCategory}
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
                    dataSearchBarCode={searchBarcode}
                    clearFiltersAndSort={clearFiltersAndSort}
                />
            }
            extra_actions={[
                <Input
                    placeholder="Tìm kiếm sản phẩm"
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
                //     placeholder="Tìm kiếm code sản phẩm" 
                //     allowClear value={dataSearchCode} 
                //     prefix={<SearchOutlined />}
                //     onChange={(e) => searchCode(e.target.value)}
                // />,
                // <Input 
                //     placeholder="Tìm kiếm theo mã vạch" 
                //     allowClear value={dataSearchBarcode} 
                //     prefix={<SearchOutlined />}
                //     onChange={(e) => searchBarcode(e.target.value)}
                // />,
                <Button onClick={clearFiltersAndSort}>Xóa lọc</Button>
            ]}
        >

        </ListForm>
    )
}

export default PriceListForm;