import {
    PlusOutlined, EditOutlined, DeleteOutlined, HistoryOutlined, DownloadOutlined
} from '@ant-design/icons';
import { Button, Form, Input, Select, message, Space, Popconfirm, Switch, Row, Col, DatePicker, Table } from 'antd';
import { Typography } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import api from '../../../../api/apis'
import ChangeForm from '../../templates/changeform';
import { useNavigate, useParams } from 'react-router-dom'
import Loading from '../../../basic/loading';
import paths from '../../../../utils/paths'
import messages from '../../../../utils/messages'
import { validPhone, validName } from '../../../../resources/regexp'
import moment from "moment";
import { Bar } from 'react-chartjs-2';
import Chart, { _adapters } from 'chart.js/auto';
import ExcelJS from "exceljs";
import saveAs from "file-saver";


const { Option } = Select;
const { TextArea } = Input;
const idCity = 0;
const { RangePicker } = DatePicker;


const StatisticsSalesByStaff = () => {

    const [data, setData] = useState([]);
    const [dataTable, setDataTable] = useState([]);
    const [staffOptions, setStaffOptions] = useState([]);
    const [staff, setStaff] = useState("");
    const [date, setDate] = useState([]);
    const [loading, setLoading] = useState(true)
    const [manyStaff, setManyStaff] = useState(true)


    useEffect(() => {
        document.title = "Thống kê bán hàng theo nhân viên - Quản lý siêu thị mini NT"
    }, [])

    useEffect(() => {
        handleDataStaff()

        handleDataStaff();
        onThongKeToDay();
    }, [])

    const onThongKe = async () => {
        if (date.length == 0) {
            message.error("Vui lòng chọn ngày cần thống kê");
            return;
        }
        setManyStaff(false)
        setLoading(true)
        const params = {
            params: {
                start_date: date[0],
                end_date: date[1],
                staff_id: staff
            }
        }
        const response = await api.statistics_sales.by_staff(params);
        formatData(response.data.data.results);
    }

    const onThongKeToDay = async () => {
        let day = new Date();
        let ng = day.getDate();
        if (ng < 10) {
            ng = "0" + ng;
        }
        let th = day.getMonth() + 1;
        if (th < 10) {
            th = "0" + th;
        }
        let da = day.getFullYear() + "-" + th + "-" + ng + "T05:10:10.357Z";
        setDate([da, da])
        const params = {
            params: {
                start_date: da,
                end_date: da,
            }
        }
        const response = await api.statistics_sales.by_staff(params);
        formatData(response.data.data.results);

    }

    const formatData = (dataa) => {
        let many = null;
        let da = [];
        da = dataa.map(elm => {
            if (elm.user_created?.id != many && many != null) {
                setManyStaff(true);
            }
            many = elm.user_created?.id;
            if (elm.user_created != null) {
                return elm;
            }
        });
        setData(da.sort(function (a, b) { return a.user_created?.id - b.user_created?.id }))
        // let datahien=[];
        // let kh=0;
        let tong=0;
        let ck=0;
        let tongcong=0;
        // let tong1=0;
        // let ck1=0;
        // let tongcong1=0;
        data.forEach(element => {
            // if(element.user_created?.id != kh && kh !=0 ){
            //     datahien.push({
            //         user_created:{
            //             id: "Tổng cộng"
            //         },
            //         discount: ck1,
            //         total: tong1,
            //         final_total: tongcong1
            //     })
            //     tong1=0;
            //     ck1=0;
            //     tongcong1=0;
            // }
            // datahien.push(element);
            tong = tong +element.total;
            ck=ck+element.discount;
            tongcong= tongcong+element.final_total;
            // tong1 = tong1 +element.total;
            // ck1=ck1+element.discount;
            // tongcong1= tongcong1+element.final_total;
            // kh= element.user_created?.id;
        });
        // if(manyStaff == true){
        //     datahien.push({
        //         user_created:{
        //             id: "Tổng cộng"
        //         },
        //         discount: ck1,
        //         total: tong1,
        //         final_total: tongcong1
        //     })
        // }
        // datahien.push({
        //     user_created:{
        //         id: "Tổng cộng"
        //     },
        //     discount: ck,
        //     total: tong,
        //     final_total: tongcong
        // })
        // setDataTable(datahien);
        setLoading(false)
    }

    const handleDataStaff = async () => {
        try {
            const response = await api.staff.list()
            const options = response.data.data.results.map(elm => {
                let label = elm.fullname + " - " + elm.phone;
                return (
                    <Option key={elm.id} value={elm.id}>{label}</Option>
                )
            })
            setStaffOptions(options);
        } catch (error) {
            message.error(messages.ERROR)
        }
    }

    const onChange = (dates, dateStrings) => {
        if (dates) {
            console.log('From: ', dates[0], ', to: ', dates[1]);
            console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
            if (new Date(dateStrings[0]) - new Date(dateStrings[1]) < -31536000000) {
                message.error("Khoảng thời gian thống kê không quá 1 năm");
                return;
            }
            setDate([dateStrings[0] + "T05:10:10.357Z", dateStrings[1] + "T23:10:10.357Z"])
        } else {
            console.log('Clear');
            setDate([]);
        }
    };

    const columns = [
        // {
        //     title: 'STT',
        //     dataIndex: 'name',
        //     key: 'name',
        // },
        {
            title: 'NVBH',
            dataIndex: 'name',
            key: 'name',
            render: (product, record) => (
                <Typography>{`${record?.user_created?.id}`}</Typography>
            ),
        },
        {
            title: 'Tên NVBH',
            dataIndex: 'age',
            key: 'age',
            render: (product, record) => (
                <Typography>{`${record?.user_created?.fullname}`}</Typography>
            ),
        },
        {
            title: 'Ngày',
            dataIndex: 'date_created',
            key: 'address',
            render: (product, record) => (
                <Typography>{`${record?.date_created?.slice(0, 10)}`}</Typography>
            ),
        },
        {
            title: 'Chiết khấu',
            dataIndex: 'address',
            key: 'address',
            render: (product, record) => (
                <Typography>{`${record?.discount?.toLocaleString()}`}</Typography>
            ),
        },
        // {
        //     title: 'Khuyến mãi',
        //     dataIndex: 'discount',
        //     key: 'address',
        //     render: (product, record) => (
        //         <Typography>{`${record.discount.toLocaleString()}`}</Typography>
        //     ),
        // },
        {
            title: 'Doanh số trước chiết khấu',
            dataIndex: 'final_total',
            key: 'address',
            render: (product, record) => (
                <Typography>{`${record?.total?.toLocaleString()}`}</Typography>
            ),
        },
        {
            title: 'Doanh số sau chiết khấu',
            dataIndex: 'final_total',
            key: 'address',
            render: (product, record) => (
                <Typography>{`${record?.final_total?.toLocaleString()}`}</Typography>
            ),
        },

    ];

    const exportExcel = () => {
        if (data.length == 0) {
            message.error("Vui lòng thống kê trước khi xuất báo cáo");
            return;
        }
        var ExcelJSWorkbook = new ExcelJS.Workbook();
        var worksheet = ExcelJSWorkbook.addWorksheet("BAOCAO", { views: [{ showGridLines: false }] });

        worksheet.mergeCells("A1:G1");

        const customCell1 = worksheet.getCell("A1");
        customCell1.font = {
            name: "Times New Roman",
            family: 4,
            size: 8,
        };
        customCell1.value = "Tên cửa hàng: SIÊU THỊ MINI NT";

        worksheet.mergeCells("A2:G2");

        const customCell2 = worksheet.getCell("A2");
        customCell2.font = {
            name: "Times New Roman",
            family: 4,
            size: 8,
        };
        customCell2.value = "Địa chỉ: Gò Vấp - Tp.Hồ Chí Minh";

        worksheet.mergeCells("A3:G3");

        const customCell3 = worksheet.getCell("A3");
        customCell3.font = {
            name: "Times New Roman",
            family: 4,
            size: 8,
        };
        const day = new Date();
        customCell3.value = "Ngày xuất báo cáo: " + day.getDate() + "/" + (day.getMonth() + 1) + "/" + day.getFullYear();

        worksheet.mergeCells("A4:G4");

        const customCell4 = worksheet.getCell("A4");
        customCell4.font = {
            name: "Times New Roman",
            family: 4,
            size: 8,
        };
        customCell4.value = "Người xuất báo cáo: " + sessionStorage.getItem("nameStaff") + ' - ' + sessionStorage.getItem("phoneStaff");

        worksheet.mergeCells("A5:G5");

        const customCell = worksheet.getCell("A5");
        customCell.font = {
            name: "Times New Roman",
            family: 4,
            size: 14,
            bold: true,
        };
        customCell.alignment = { vertical: 'middle', horizontal: 'center' };

        customCell.value = "DOANH SỐ BÁN HÀNG THEO NGÀY";

        worksheet.mergeCells("A6:G6");

        const customCell5 = worksheet.getCell("A6");
        customCell5.font = {
            name: "Times New Roman",
            family: 4,
            size: 8,
        };
        customCell5.alignment = { vertical: 'middle', horizontal: 'center' };

        customCell5.value = "Từ ngày: " + date[0].slice(0, 10) + "      Đến ngày: " + date[1].slice(0, 10) + " ";

        let header = ["STT", "NVBH", "Tên NVBH", "Ngày", "Chiết khấu", "Doanh số trước CK", "Doanh số sau CK"];
        let headerColumn = ["A", "B", "C", "D", "E", "F", "G"];

        worksheet.mergeCells("A7:G7");
        var headerRow = worksheet.addRow();

        worksheet.getRow(8).font = { bold: true };
        worksheet.getRow(8).height = "25";

        for (let i = 0; i < headerColumn.length; i++) {
            const columnn = worksheet.getCell(headerColumn[i] + 8);
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
                row: 8,
                column: 1
            },
            to: {
                row: 8,
                column: 7
            }
        };
        let donggop = 9;
        let sl = 1;
        let i = 1;
        let total = 0;
        let total_ck = 0;
        let total_final = 0;
        let totalnv = 0;
        let total_cknv = 0;
        let total_finalnv = 0;
        let nv = 0;
        data.forEach(element => {
            if (element?.user_created.id != nv && nv != 0) {
                worksheet.mergeCells("B" + (i + 8) + ":D" + (i + 8));
                const customCellTT = worksheet.getCell("B" + (i + 8));
                customCellTT.font = {
                    name: "Times New Roman",
                    family: 4,
                    size: 11,
                    bold: true,
                };
                customCellTT.border = {
                    top: { style: 'dotted' },
                    bottom: { style: 'thin' },
                };
                customCellTT.alignment = { vertical: 'middle', horizontal: 'right' };
                customCellTT.value = "Tổng cộng: ";

                const customCellTT1 = worksheet.getCell("E" + (i + 8));
                customCellTT1.font = {
                    name: "Times New Roman",
                    family: 4,
                    size: 11,
                    bold: true,
                };
                customCellTT1.border = {
                    top: { style: 'dotted' },
                    bottom: { style: 'thin' },
                };
                customCellTT1.alignment = { vertical: 'middle', horizontal: 'right' };
                customCellTT1.value = total_cknv?.toLocaleString();

                const customCellTT2 = worksheet.getCell("F" + (i + 8));
                customCellTT2.font = {
                    name: "Times New Roman",
                    family: 4,
                    size: 11,
                    bold: true,
                };
                customCellTT2.border = {
                    top: { style: 'dotted' },
                    bottom: { style: 'thin' },
                };
                customCellTT2.alignment = { vertical: 'middle', horizontal: 'right' };
                customCellTT2.value = totalnv?.toLocaleString();

                const customCellTT3 = worksheet.getCell("G" + (i + 8));
                customCellTT3.font = {
                    name: "Times New Roman",
                    family: 4,
                    size: 11,
                    bold: true,
                };
                customCellTT3.border = {
                    top: { style: 'dotted' },
                    bottom: { style: 'thin' },
                };
                customCellTT3.alignment = { vertical: 'middle', horizontal: 'right' };
                customCellTT3.value = total_finalnv?.toLocaleString();

                worksheet.mergeCells("A" + donggop + ":A" + (i + 8));
                worksheet.getCell("A" + donggop).border = {
                    bottom: { style: 'thin' },
                };
                i++;
                totalnv = 0;
                total_cknv = 0;
                total_finalnv = 0;
                sl++;
                donggop = i + 8;
            }
            if (manyStaff == true) {
                worksheet.addRow([sl, element?.user_created?.id, element?.user_created?.fullname, element?.date_created?.slice(0, 10),
                    element?.discount?.toLocaleString(), element?.total?.toLocaleString(), element?.final_total?.toLocaleString()]);
            } else {
                worksheet.addRow([i, element?.user_created?.id, element?.user_created?.fullname, element?.date_created?.slice(0, 10),
                    element?.discount?.toLocaleString(), element?.total?.toLocaleString(), element?.final_total?.toLocaleString()]);
            }
            for (let j = 0; j < headerColumn.length; j++) {
                const columnn = worksheet.getCell(headerColumn[j] + (i + 8));
                columnn.border = {
                    top: { style: 'dotted' },
                    bottom: { style: 'dotted' },
                };
                if (j == 0 || j == 3) {
                    columnn.alignment = { vertical: 'middle', horizontal: 'center' };
                } else if (j == 1 || j == 2) {
                    columnn.alignment = { vertical: 'middle', horizontal: 'left' };
                } else {
                    columnn.alignment = { vertical: 'middle', horizontal: 'right' };
                }

            }

            i++;
            if (element != null) {
                total_final = total_final + element?.total;
                total = total + element?.final_total;
                total_ck = total_ck + element?.discount;
                total_finalnv = total_finalnv + element?.total;
                totalnv = totalnv + element?.final_total;
                total_cknv = total_cknv + element?.discount;
                nv = element?.user_created.id;
            }

        });
        if (manyStaff == true) {
            worksheet.mergeCells("B" + (i + 8) + ":D" + (i + 8));
            const customCellTT = worksheet.getCell("B" + (i + 8));
            customCellTT.font = {
                name: "Times New Roman",
                family: 4,
                size: 11,
                bold: true,
            };
            customCellTT.border = {
                top: { style: 'dotted' },
                bottom: { style: 'thin' },
            };
            customCellTT.alignment = { vertical: 'middle', horizontal: 'right' };
            customCellTT.value = "Tổng cộng: ";

            const customCellTT1 = worksheet.getCell("E" + (i + 8));
            customCellTT1.font = {
                name: "Times New Roman",
                family: 4,
                size: 11,
                bold: true,
            };
            customCellTT1.border = {
                top: { style: 'dotted' },
                bottom: { style: 'thin' },
            };
            customCellTT1.alignment = { vertical: 'middle', horizontal: 'right' };
            customCellTT1.value = total_cknv?.toLocaleString();

            const customCellTT2 = worksheet.getCell("F" + (i + 8));
            customCellTT2.font = {
                name: "Times New Roman",
                family: 4,
                size: 11,
                bold: true,
            };
            customCellTT2.border = {
                top: { style: 'dotted' },
                bottom: { style: 'thin' },
            };
            customCellTT2.alignment = { vertical: 'middle', horizontal: 'right' };
            customCellTT2.value = totalnv?.toLocaleString();

            const customCellTT3 = worksheet.getCell("G" + (i + 8));
            customCellTT3.font = {
                name: "Times New Roman",
                family: 4,
                size: 11,
                bold: true,
            };
            customCellTT3.border = {
                top: { style: 'dotted' },
                bottom: { style: 'thin' },
            };
            customCellTT3.alignment = { vertical: 'middle', horizontal: 'right' };
            customCellTT3.value = total_finalnv?.toLocaleString();

            worksheet.mergeCells("A" + donggop + ":A" + (i + 8));
            worksheet.getCell("A" + donggop).border = {
                bottom: { style: 'thin' },
            };
            i++;
        }
        worksheet.mergeCells("A" + (i + 8) + ":D" + (i + 8));
        const customCellTT = worksheet.getCell("A" + (i + 8));
        customCellTT.font = {
            name: "Times New Roman",
            family: 4,
            size: 11,
            bold: true,
        };
        customCellTT.border = {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
        };
        customCellTT.alignment = { vertical: 'middle', horizontal: 'left' };
        customCellTT.value = "Tổng cộng: ";

        const customCellTT1 = worksheet.getCell("E" + (i + 8));
        customCellTT1.font = {
            name: "Times New Roman",
            family: 4,
            size: 11,
            bold: true,
        };
        customCellTT1.border = {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
        };
        customCellTT1.alignment = { vertical: 'middle', horizontal: 'right' };
        customCellTT1.value = total_ck.toLocaleString();

        const customCellTT2 = worksheet.getCell("F" + (i + 8));
        customCellTT2.font = {
            name: "Times New Roman",
            family: 4,
            size: 11,
            bold: true,
        };
        customCellTT2.border = {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
        };
        customCellTT2.alignment = { vertical: 'middle', horizontal: 'right' };
        customCellTT2.value = total.toLocaleString();

        const customCellTT3 = worksheet.getCell("G" + (i + 8));
        customCellTT3.font = {
            name: "Times New Roman",
            family: 4,
            size: 11,
            bold: true,
        };
        customCellTT3.border = {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
        };
        customCellTT3.alignment = { vertical: 'middle', horizontal: 'right' };
        customCellTT3.value = total_final.toLocaleString();
        ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
            saveAs(
                new Blob([buffer], { type: "application/octet-stream" }),
                `BaoCaoDoanhSoTheoNgay${day.getDate()}${day.getMonth() + 1}${day.getFullYear()}${day.getHours()}${day.getMinutes()}${day.getSeconds()}.xlsx`
            );
        });
    }

    return (
        <div>
            <Row style={{ marginTop: '10px' }}>
                <Col span={24}>
                    <label style={{ paddingRight: '10px' }}>Ngày thống kê:</label>
                    <RangePicker onChange={onChange} defaultValue={[moment(new Date()), moment(new Date())]} />

                    <label style={{ paddingLeft: '10px', paddingRight: '10px' }}>Nhân viên:</label>
                    <Select
                        allowClear
                        showSearch
                        style={{
                            width: '200px',
                            textAlign: 'left'
                        }}
                        optionFilterProp="children"
                        onChange={(option) => { setStaff(option); console.log(option) }}
                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                        key={staffOptions}
                    >
                        {staffOptions}
                    </Select>

                    <Button type="primary" style={{ marginLeft: '10px' }} onClick={() => onThongKe()}>Thống kê</Button>
                    <Button style={{ marginLeft: '10px' }} onClick={() => exportExcel()}> <DownloadOutlined /> Xuất báo cáo</Button>
                </Col>
            </Row>


            {/* <Row style={{ marginTop: '10px', marginBottom: '10px' }}><Col span={24}><h2 style={{ textAlign: 'center' }}>Đồ thị</h2></Col></Row> */}
            <Row style={{ marginTop: '20px', marginBottom: '10px' }}>
                <Col span={24}>
                    <Table dataSource={data}
                        columns={columns}
                        size="small"
                        loading={loading}
                    >
                    </Table>
                </Col>
                {/* <Col span={12}>
                    <Bar
                        height={100}
                        width={200}
                        data={{
                            labels: [
                                "Africa",
                                "Asia",
                                "Europe",
                                "Latin America",
                                "North America"
                            ],
                            datasets: [
                                {
                                    label: "Population (millions)",
                                    backgroundColor: [
                                        "#3e95cd",
                                        "#8e5ea2",
                                        "#3cba9f",
                                        "#e8c3b9",
                                        "#c45850"
                                    ],
                                    data: [2478, 5267, 734, 784, 433]
                                }
                            ]
                        }}
                        options={{
                            legend: { display: false },
                            title: {
                                display: true,
                                text: "Predicted world population (millions) in 2050"
                            }
                        }}
                    />
                </Col> */}
            </Row>
        </div>

    )

}

export default StatisticsSalesByStaff;