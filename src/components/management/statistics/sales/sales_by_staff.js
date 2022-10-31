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
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import ExcelJS from "exceljs";
import saveAs from "file-saver";


const { Option } = Select;
const { TextArea } = Input;
const idCity = 0;
const { RangePicker } = DatePicker;


const StatisticsSalesByStaff = () => {

    const [loadings, setLoadings] = useState([]);
    const [data, setData] = useState([]);
    const [staffOptions, setStaffOptions] = useState([]);
    const [staff, setStaff] = useState("");
    const [date, setDate] = useState([]);

    useEffect(() => {
        handleDataStaff()
    }, [])

    // const enterLoading = (index) => {
    //   setLoadings((prevLoadings) => {
    //     const newLoadings = [...prevLoadings];
    //     newLoadings[index] = true;
    //     return newLoadings;
    //   });
    // };

    // const stopLoading = (index) => {
    //   setLoadings((prevLoadings) => {
    //     const newLoadings = [...prevLoadings];
    //     newLoadings[index] = false;
    //     return newLoadings;
    //   });
    // }

    const onThongKe = async () => {
        if (date.length == 0) {
            message.error("Vui lòng chọn ngày cần thống kê");
            return;
        }
        if (staff == "") {
            message.error("Vui lòng chọn nhân viên cần thống kê");
            return;
        }
        console.log(date, staff)
        const params = {
            params: {
                start_date: date[0],
                end_date: date[1],
                staff_id: staff
            }
        }
        const response = await api.statistics_sales.by_staff(params);
        setData(response.data.data.results);
        console.log(data)
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
                <Typography>{`${record.user_created.code}`}</Typography>
            ),
        },
        {
            title: 'Tên NVBH',
            dataIndex: 'age',
            key: 'age',
            render: (product, record) => (
                <Typography>{`${record.user_created.fullname}`}</Typography>
            ),
        },
        {
            title: 'Ngày',
            dataIndex: 'date_created',
            key: 'address',
            render: (product, record) => (
                <Typography>{`${record.date_created.slice(0, 10)}`}</Typography>
            ),
        },
        {
            title: 'Chiết khấu',
            dataIndex: 'address',
            key: 'address',
            render: (product, record) => (
                <Typography>0</Typography>
            ),
        },
        {
            title: 'Khuyến mãi',
            dataIndex: 'discount',
            key: 'address',
            render: (product, record) => (
                <Typography>{`${record.discount.toLocaleString()}`}</Typography>
            ),
        },
        {
            title: 'Doanh số trước chiết khấu',
            dataIndex: 'final_total',
            key: 'address',
            render: (product, record) => (
                <Typography>{`${record.final_total.toLocaleString()}`}</Typography>
            ),
        },
        {
            title: 'Doanh số sau chiết khấu',
            dataIndex: 'final_total',
            key: 'address',
            render: (product, record) => (
                <Typography>{`${record.final_total.toLocaleString()}`}</Typography>
            ),
        },

    ];

    const exportExcel = () => {
        if (data.length == 0) {
            message.error("Vui lòng thống kê trước khi xuất báo cáo");
            return;
        }
        var ExcelJSWorkbook = new ExcelJS.Workbook();
        var worksheet = ExcelJSWorkbook.addWorksheet("BAOCAO");

        worksheet.mergeCells("A1:G1");

        const customCell1 = worksheet.getCell("A1");
        customCell1.font = {
            name: "Times New Roman",
            family: 4,
            size: 8,
        };
        customCell1.value = "Tên cửa hàng: SIÊU THỊ MINI";

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
        const day= new Date();
        customCell3.value = "Ngày in: "+ day.getDate()+"/"+(day.getMonth()+1)+"/"+day.getFullYear() ;

        worksheet.mergeCells("A4:G4");

        const customCell4 = worksheet.getCell("A4");
        customCell4.font = {
            name: "Times New Roman",
            family: 4,
            size: 8,
        };
        customCell4.value = "Người xuất báo cáo: "+sessionStorage.getItem("nameStaff") + ' - ' + sessionStorage.getItem("phoneStaff") ;

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

        for (let i = 0; i < headerColumn.length; i++) {
            const columnn = worksheet.getCell(headerColumn[i] + 8);
            columnn.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
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
        let i = 1;
        let total = 0;
        data.forEach(element => {
            worksheet.addRow([i, element.user_created.code, element.user_created.fullname, element.date_created.slice(0, 10),
                "0", element.final_total.toLocaleString(), element.final_total.toLocaleString()]);
            for (let j = 0; j < headerColumn.length; j++) {
                const columnn = worksheet.getCell(headerColumn[j] + (i + 8));
                columnn.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
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
            total = total + element.final_total;
        });
        worksheet.mergeCells("A" + (i + 9) + ":D" + (i + 9));
        const customCellTT = worksheet.getCell("A" + (i + 9));
        customCellTT.font = {
            name: "Times New Roman",
            family: 4,
            size: 11,
            bold: true,
        };

        customCellTT.value = "Tổng cộng: ";

        const customCellTT1 = worksheet.getCell("E" + (i + 9));
        customCellTT1.font = {
            name: "Times New Roman",
            family: 4,
            size: 11,
            bold: true,
        };

        customCellTT1.value = 0;

        const customCellTT2 = worksheet.getCell("F" + (i + 9));
        customCellTT2.font = {
            name: "Times New Roman",
            family: 4,
            size: 11,
            bold: true,
        };
        customCellTT2.alignment = { vertical: 'middle', horizontal: 'right' };
        customCellTT2.value = total.toLocaleString();

        const customCellTT3 = worksheet.getCell("G" + (i + 9));
        customCellTT3.font = {
            name: "Times New Roman",
            family: 4,
            size: 11,
            bold: true,
        };
        customCellTT3.alignment = { vertical: 'middle', horizontal: 'right' };
        customCellTT3.value = total.toLocaleString();
        ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
            saveAs(
                new Blob([buffer], { type: "application/octet-stream" }),
                `BaoCaoDoanhSoTheoNgay.xlsx`
            );
        });
    }

    return (
        <div>
            <Row style={{ marginTop: '10px' }}>
                <Col span={24}>
                    <label style={{ paddingRight: '10px' }}>Ngày thống kê:</label>
                    <RangePicker onChange={onChange} />

                    <label style={{ paddingLeft: '10px', paddingRight: '10px' }}>Nhân viên:</label>
                    <Select
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