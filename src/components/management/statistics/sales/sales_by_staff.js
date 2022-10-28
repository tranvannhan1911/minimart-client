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
            setDate([dateStrings[0], dateStrings[1]])
        } else {
            console.log('Clear');
            setDate([]);
        }
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'NVBH',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Tên NVBH',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Ngày',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Chiết khấu',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Doanh số trước chiết khấu',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Doanh số sau chiết khấu',
            dataIndex: 'address',
            key: 'address',
        },

    ];

    const exportExcel = () => {
        // if (data.length == 0) {
        //     message.error("Vui lòng thống kê trước khi xuất báo cáo");
        //     return;
        // }
        var ExcelJSWorkbook = new ExcelJS.Workbook();
        var worksheet = ExcelJSWorkbook.addWorksheet("BAOCAO");

        worksheet.mergeCells("A1:G1");

        const customCell1 = worksheet.getCell("A1");
        customCell1.font = {
            name: "Times New Roman",
            family: 4,
            size: 8,
        };
        customCell1.value = "Tên cửa hàng";

        worksheet.mergeCells("A2:G2");

        const customCell2 = worksheet.getCell("A2");
        customCell2.font = {
            name: "Times New Roman",
            family: 4,
            size: 8,
        };
        customCell2.value = "Địa chỉ cửa hàng";

        worksheet.mergeCells("A3:G3");

        const customCell3 = worksheet.getCell("A3");
        customCell3.font = {
            name: "Times New Roman",
            family: 4,
            size: 8,
        };
        customCell3.value = "Ngày in:";

        worksheet.mergeCells("A4:G4");

        const customCell = worksheet.getCell("A4");
        customCell.font = {
            name: "Times New Roman",
            family: 4,
            size: 14,
            bold: true,
        };
        customCell.alignment = { vertical: 'middle', horizontal: 'center' };

        customCell.value = "DOANH SỐ BÁN HÀNG THEO NGÀY";

        worksheet.mergeCells("A5:G5");

        const customCell5 = worksheet.getCell("A5");
        customCell5.font = {
            name: "Times New Roman",
            family: 4,
            size: 8,
        };
        customCell5.alignment = { vertical: 'middle', horizontal: 'center' };

        customCell5.value = "Từ ngày: 01/08/2019      Đến ngày: 22/10/2019 ";

        let header = ["STT", "NVBH", "Tên NVBH", "Ngày", "Chiết khấu", "Doanh số trước chiết khấu", "Doanh số sau chiết khấu"];

        worksheet.mergeCells("A6:M6");
        var headerRow = worksheet.addRow();

        worksheet.getRow(7).font = { bold: true };

        for (let i = 0; i < 7; i++) {
            let currentColumnWidth = "125";
            worksheet.getColumn(i + 1).width =
                currentColumnWidth !== undefined ? currentColumnWidth / 6 : 20;
            let cell = headerRow.getCell(i + 1);
            cell.value = header[i];
        }

        worksheet.autoFilter = {
            from: {
                row: 7,
                column: 1
            },
            to: {
                row: 7,
                column: 7
            }
        };

        // data.forEach(element => {
        //     worksheet.addRow([element.product_obj.product_code, element.product, element.quantity_before, element.quantity_after, (element.quantity_after - element.quantity_before) + " " + element.product_obj.base_unit.name, element.note]);
        // });

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