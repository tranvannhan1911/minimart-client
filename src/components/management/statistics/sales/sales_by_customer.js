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
import moment from "moment";
import Chart from 'chart.js/auto';
import ExcelJS from "exceljs";
import saveAs from "file-saver";


const { Option } = Select;
const { TextArea } = Input;
const idCity = 0;
const { RangePicker } = DatePicker;


const StatisticsSalesByCustomer = () => {

    const [loadings, setLoadings] = useState([]);
    const [data, setData] = useState([]);
    const [customerOptions, setCustomerOptions] = useState([]);
    const [customer, setCustomer] = useState("");
    const [date, setDate] = useState([]);

    useEffect(() => {
      document.title = "Thống kê bán hàng theo khách hàng - Quản lý siêu thị mini NT"
    }, [])

    useEffect(() => {
        handleDataCustomer()
        onThongKeToDay()
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

        console.log(date, customer)
        const params = {
            params: {
                start_date: date[0],
                end_date: date[1],
                customer_id: customer
            }
        }
        const response = await api.statistics_sales.by_customer(params);
        getData(response.data.data.results);
        console.log(data)

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
        const response = await api.statistics_sales.by_customer(params);
        getData(response.data.data.results);
    }

    const getData = (dataa) => {
        let dataMain = [];
        dataa.forEach(element => {
            let cus_gr = "";
            element.customer?.customer_group.forEach(elm => {
                cus_gr += elm.name;
            });
            let index = {
                id: element.customer == null ? "-" : element.customer?.id,
                name: element.customer == null ? "Khách hàng lẻ" : element.customer?.fullname,
                address: element.customer == null ? "-" : element.customer?.address,
                ward: element.customer == null ? "-" : element.customer?.ward?.ward.name,
                district: element.customer == null ? "-" : element.customer?.ward?.district.name,
                city: element.customer == null ? "-" : element.customer?.ward?.city.name,
                customer_group: element.customer == null ? "-" : cus_gr,
                product_group: element.product_groups?.name,
                product_category: element.product_category?.name,
                moneyBefore: element.final_total,
                moneyCK: 0,
                moneyAfter: element.final_total
            }
            dataMain.push(index);

        });
        setData(dataMain);
    }

    const handleDataCustomer = async () => {
        try {
            const response = await api.customer.list()
            const options = response.data.data.results.map(elm => {
                let label = elm.fullname + " - " + elm.phone;
                return (
                    <Option key={elm.id} value={elm.id}>{label}</Option>
                )
            })
            setCustomerOptions(options);
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
            title: 'Mã KH',
            dataIndex: 'id',
            key: 'name',

        },
        {
            title: 'Tên KH',
            dataIndex: 'name',
            key: 'age',

        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',

        },
        {
            title: 'Phường/Xã',
            dataIndex: 'ward',
            key: 'address',

        },
        {
            title: 'Quận/Huyện',
            dataIndex: 'district',
            key: 'address',

        },
        {
            title: 'Tỉnh/Thành phố',
            dataIndex: 'city',
            key: 'address',

        },
        {
            title: 'Nhóm Khách Hàng',
            dataIndex: 'customer_group',
            key: 'address',
        },
        {
            title: 'Nhóm Sản Phẩm',
            dataIndex: 'product_group',
            key: 'address',
        },
        {
            title: 'Ngành Hàng',
            dataIndex: 'product_category',
            key: 'address',
        },
        {
            title: 'Doanh số trước CK',
            dataIndex: 'moneyBefore',
            key: 'address',
            render: (product, record) => (
                <Typography>{`${record.moneyBefore.toLocaleString()}`}</Typography>
            ),
        },
        {
            title: 'Chiết khấu',
            dataIndex: 'moneyCK',
            key: 'address',
        },
        {
            title: 'Doanh số sau CK',
            dataIndex: 'moneyAfter',
            key: 'address',
            render: (product, record) => (
                <Typography>{`${record.moneyAfter.toLocaleString()}`}</Typography>
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

        worksheet.mergeCells("A1:M1");

        const customCell1 = worksheet.getCell("A1");
        customCell1.font = {
            name: "Times New Roman",
            family: 4,
            size: 8,
        };
        customCell1.value = "Tên cửa hàng: SIÊU THỊ MINI";

        worksheet.mergeCells("A2:M2");

        const customCell2 = worksheet.getCell("A2");
        customCell2.font = {
            name: "Times New Roman",
            family: 4,
            size: 8,
        };
        customCell2.value = "Địa chỉ: Gò Vấp - Tp.Hồ Chí Minh";

        worksheet.mergeCells("A3:M3");

        const customCell3 = worksheet.getCell("A3");
        customCell3.font = {
            name: "Times New Roman",
            family: 4,
            size: 8,
        };
        const day = new Date();
        customCell3.value = "Ngày xuất báo cáo: " + day.getDate() + "/" + (day.getMonth() + 1) + "/" + day.getFullYear();

        worksheet.mergeCells("A4:M4");

        const customCell4 = worksheet.getCell("A4");
        customCell4.font = {
            name: "Times New Roman",
            family: 4,
            size: 8,
        };
        customCell4.value = "Người xuất báo cáo: " + sessionStorage.getItem("nameStaff") + ' - ' + sessionStorage.getItem("phoneStaff");

        worksheet.mergeCells("A5:M5");

        const customCell = worksheet.getCell("A5");
        customCell.font = {
            name: "Times New Roman",
            family: 4,
            size: 14,
            bold: true,
        };
        customCell.alignment = { vertical: 'middle', horizontal: 'center' };

        customCell.value = "DOANH SỐ THEO KHÁCH HÀNG";

        worksheet.mergeCells("A6:M6");

        const customCell5 = worksheet.getCell("A6");
        customCell5.font = {
            name: "Times New Roman",
            family: 4,
            size: 8,
        };
        customCell5.alignment = { vertical: 'middle', horizontal: 'center' };

        customCell5.value = "Từ ngày: " + date[0].slice(0, 10) + "      Đến ngày: " + date[1].slice(0, 10) + " ";

        let header = ["STT", "Mã KH", "Tên KH", "Địa chỉ", "Phường/Xã", "Quận/Huyện", "Tỉnh/Thành phố", "Nhóm Khách Hàng", "Nhóm Sản Phẩm",
            "Ngành Hàng", "Doanh số trước CK", "Chiết khấu", "Doanh số sau CK"];
        let headerColumn = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];

        worksheet.mergeCells("A7:M7");
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
                worksheet.getColumn(i + 1).width = "15";
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
                column: 13
            }
        };
        let i = 1;
        let total = 0;
        data.forEach(element => {
            worksheet.addRow([i, element.id, element.name, element.address, element.ward, element.district, element.city,
                element.customer_group, element.product_group, element.product_category, element.moneyBefore.toLocaleString(),
                element.moneyCK, element.moneyAfter.toLocaleString()]);
            for (let j = 0; j < headerColumn.length; j++) {
                const columnn = worksheet.getCell(headerColumn[j] + (i + 8));
                columnn.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                if (j == 0) {
                    columnn.alignment = { vertical: 'middle', horizontal: 'center' };
                } else if (j == 10 || j == 11 || j == 12) {
                    columnn.alignment = { vertical: 'middle', horizontal: 'right' };
                } else {
                    columnn.alignment = { vertical: 'middle', horizontal: 'left' };
                }

            }

            i++;
            total = total + element.moneyAfter;
        });
        worksheet.mergeCells("A" + (i + 8) + ":J" + (i + 8));
        const customCellTT = worksheet.getCell("A" + (i + 8));
        customCellTT.font = {
            name: "Times New Roman",
            family: 4,
            size: 11,
            bold: true,
        };
        customCellTT.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
        customCellTT.alignment = { vertical: 'middle', horizontal: 'right' };
        customCellTT.value = "Tổng cộng: ";

        const customCellTT1 = worksheet.getCell("L" + (i + 8));
        customCellTT1.font = {
            name: "Times New Roman",
            family: 4,
            size: 11,
            bold: true,
        };
        customCellTT1.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
        customCellTT1.value = 0;

        const customCellTT2 = worksheet.getCell("M" + (i + 8));
        customCellTT2.font = {
            name: "Times New Roman",
            family: 4,
            size: 11,
            bold: true,
        };
        customCellTT2.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
        customCellTT2.alignment = { vertical: 'middle', horizontal: 'right' };
        customCellTT2.value = total.toLocaleString();

        const customCellTT3 = worksheet.getCell("K" + (i + 8));
        customCellTT3.font = {
            name: "Times New Roman",
            family: 4,
            size: 11,
            bold: true,
        };
        customCellTT3.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
        customCellTT3.alignment = { vertical: 'middle', horizontal: 'right' };
        customCellTT3.value = total.toLocaleString();
        ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
            saveAs(
                new Blob([buffer], { type: "application/octet-stream" }),
                `BaoCaoDoanhSoTheoKhachHang.xlsx`
            );
        });
    }

    return (
        <div>
            <Row style={{ marginTop: '10px' }}>
                <Col span={24}>
                    <label style={{ paddingRight: '10px' }}>Ngày thống kê:</label>
                    <RangePicker onChange={onChange} defaultValue={[moment(new Date()), moment(new Date())]} />

                    <label style={{ paddingLeft: '10px', paddingRight: '10px' }}>Khách hàng:</label>
                    <Select
                        showSearch
                        allowClear
                        style={{
                            width: '200px',
                            textAlign: 'left'
                        }}
                        optionFilterProp="children"
                        onChange={(option) => { setCustomer(option); console.log(option) }}
                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                        key={customerOptions}
                    >
                        {customerOptions}
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

export default StatisticsSalesByCustomer;