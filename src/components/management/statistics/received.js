import {
  PlusOutlined, EditOutlined, DeleteOutlined, HistoryOutlined, DownloadOutlined
} from '@ant-design/icons';
import { Button, Form, Input, Select, message, Space, Popconfirm, Switch, Row, Col, Table, DatePicker } from 'antd';
import { Typography } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import api from '../../../api/apis'
import moment from "moment";
import ChangeForm from '../templates/changeform';
import { useNavigate, useParams } from 'react-router-dom'
import Loading from '../../basic/loading';
import paths from '../../../utils/paths'
import messages from '../../../utils/messages'
import { validPhone, validName } from '../../../resources/regexp'
import ExcelJS from "exceljs";
import saveAs from "file-saver";

const { Option } = Select;
const { TextArea } = Input;
const idCity = 0;
const { RangePicker } = DatePicker;

const StatisticsReceived = () => {
  const [data, setData] = useState([]);
  const [type, setType] = useState("Order");
  const [date, setDate] = useState([]);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = "Thống kê nhập hàng - Quản lý siêu thị mini NT"
  }, [])

  useEffect(() => {
    onThongKeToDay()
  }, [])


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
    {
      title: 'Mã sản phẩm',
      dataIndex: 'codeProduct',
      key: 'name',

    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'nameProduct',
      key: 'address',

    },
    {
      title: 'ĐVT báo cáo',
      dataIndex: 'unit',
      key: 'address',

    },
    {
      title: 'Số lượng báo cáo',
      dataIndex: 'quantity',
      key: 'address',

    },
    {
      title: 'ĐVT lẻ',
      dataIndex: 'unit_base',
      key: 'address',

    },
    {
      title: 'Số lượng lẻ',
      dataIndex: 'quantity_base_unit',
      key: 'address',

    },
    {
      title: 'Tổng thành tiền',
      dataIndex: 'moneyTotal',
      key: 'address',
      render: (product, record) => (
        <Typography>{`${record.moneyTotal.toLocaleString()}`}</Typography>
      ),
    },

  ];

  const onThongKe = async () => {
    if (date.length == 0) {
      message.error("Vui lòng chọn ngày cần thống kê");
      return;
    }
    setLoading(true)
    const params = {
      params: {
        start_date: date[0],
        end_date: date[1],
      }
    }
    const response = await api.statistics_received.receiving(params);
    statisticData(response.data.data.results);
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
    const response = await api.statistics_received.receiving(params);
    statisticData(response.data.data.results);
  }


  const statisticData = (data) => {
    let dataMain = [];
    data.forEach(element => {
      let slcb = Number(element.quantity_base_unit) % Number(element.product.unit_exchange_report.value);
      let slbc = (Number(element.quantity_base_unit) - Number(slcb)) / Number(element.product.unit_exchange_report.value);
      // if (slbc == element.quantity_base_unit) {
      //   slcb = element.quantity_base_unit;
      // }
      let index = {
        codeProduct: element.product.product_code,
        nameProduct: element.product.name,
        quantity: slbc,
        quantity_base_unit: slcb,
        moneyTotal: element.total,
        unit: element.product.unit_exchange_report.unit_name,
        unit_base: element.product.base_unit.name
      }
      dataMain.push(index);
    });
    setData(dataMain);
    setLoading(false)
  }

  const exportExcel = () => {
    if (data.length == 0) {
      message.error("Vui lòng thống kê trước khi xuất báo cáo");
      return;
    }
    var ExcelJSWorkbook = new ExcelJS.Workbook();
    var worksheet = ExcelJSWorkbook.addWorksheet("BAOCAO", { views: [{ showGridLines: false }] });

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
    customCell3.value = "Ngày xuất báo cáo: " + day.getDate() + "/" + (day.getMonth() + 1) + "/" + day.getFullYear();

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

    customCell.value = "BẢNG KÊ HÀNG HÓA MUA VÀO ";

    worksheet.mergeCells("A6:H6");

    const customCell5 = worksheet.getCell("A6");
    customCell5.font = {
      name: "Times New Roman",
      family: 4,
      size: 8,
    };
    customCell5.alignment = { vertical: 'middle', horizontal: 'center' };

    customCell5.value = "Từ ngày: " + date[0].slice(0, 10) + "      Đến ngày: " + date[1].slice(0, 10) + " ";

    let header = ["STT", "Mã sản phẩm", "Tên sản phẩm", "ĐVT báo cáo", "Số lượng báo cáo", "ĐVT lẻ", "Số lượng lẻ", "Tổng thành tiền"];
    let headerColumn = ["A", "B", "C", "D", "E", "F", "G", "H"];

    worksheet.mergeCells("A7:H7");
    var headerRow = worksheet.addRow();

    worksheet.getRow(8).font = { bold: true };
    worksheet.getRow(8).height = "25";

    for (let i = 0; i < headerColumn.length; i++) {
      const columnn = worksheet.getCell(headerColumn[i] + 8);
      columnn.font = {
        name: "Times New Roman",
        family: 4,
        bold: true
      };
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
      } else if (i == 2) {
        worksheet.getColumn(i + 1).width = "35";
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
        column: 8
      }
    };
    let i = 1;
    let total = 0;
    data.forEach(element => {
      worksheet.addRow([i, element.codeProduct, element.nameProduct, element.unit, element.quantity, element.unit_base,
        element.quantity_base_unit, element.moneyTotal?.toLocaleString()]);
      for (let j = 0; j < headerColumn.length; j++) {
        const columnn = worksheet.getCell(headerColumn[j] + (i + 8));
        columnn.font = {
          name: "Times New Roman",
          family: 4,
        };
        columnn.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        if (j == 0 || j == 3 || j == 5) {
          columnn.alignment = { vertical: 'middle', horizontal: 'center' };
        } else if (j == 4 || j == 6 || j == 7) {
          columnn.alignment = { vertical: 'middle', horizontal: 'right' };
        } else {
          columnn.alignment = { vertical: 'middle', horizontal: 'left' };
        }

      }

      i++;
      total = total + element.moneyTotal;
    });
    worksheet.mergeCells("A" + (i + 8) + ":G" + (i + 8));
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

    const customCellTT2 = worksheet.getCell("H" + (i + 8));
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
    customCellTT2.value = total?.toLocaleString();

    ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
      saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        `BaoCaoNhapHang${day.getDate()}${day.getMonth() + 1}${day.getFullYear()}${day.getHours()}${day.getMinutes()}${day.getSeconds()}.xlsx`
      );
    });
  }

  return (
    <div><Row style={{ marginBottom: '0px' }}><Col span={24}><h1 style={{ textAlign: 'center', fontSize: '25px', margin: '0px' }}>Thống kê nhập hàng</h1></Col></Row>
      <Row style={{ marginTop: '5px' }}>
        <Col span={24}>
          <label style={{ paddingRight: '10px' }}>Ngày thống kê:</label>
          <RangePicker onChange={onChange} defaultValue={[moment(new Date()), moment(new Date())]} />

          <Button type="primary" style={{ marginLeft: '10px' }} onClick={() => onThongKe()}>Thống kê</Button>
          <Button style={{ marginLeft: '10px' }} onClick={() => exportExcel()}> <DownloadOutlined /> Xuất báo cáo</Button>

        </Col>
      </Row>
      {/* <Row style={{ marginTop: '10px', marginBottom: '10px' }}><Col span={24}><h2 style={{ textAlign: 'center' }}>Đồ thị</h2></Col></Row> */}
      <Row style={{ marginTop: '5px', marginBottom: '10px' }}>
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
    </div >

  )

}

export default StatisticsReceived;