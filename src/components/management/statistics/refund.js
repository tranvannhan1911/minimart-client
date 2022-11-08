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

const StatisticsRefund = () => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([]);
  const [date, setDate] = useState([]);

  useEffect(() => {
    document.title = "Thống kê trả hàng - Quản lý siêu thị mini NT"
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
      title: 'Hóa Đơn Mua',
      dataIndex: 'id_order',
      key: 'address',
    },
    {
      title: 'Ngày đơn hàng mua',
      dataIndex: 'date_order',
      key: 'address',
    },
    {
      title: 'Hóa Đơn Trả',
      dataIndex: 'id_refund',
      key: 'address',
    },

    {
      title: 'Ngày đơn hàng trả',
      dataIndex: 'date_refund',
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
      title: 'Mã sản phẩm',
      dataIndex: 'codeProduct',
      key: 'address',
    },
    {
      title: 'Tên Sản Phẩm',
      dataIndex: 'nameProduct',
      key: 'address',
    },
    // {
    //   title: 'Số lượng thùng',
    //   dataIndex: 'quantity',
    //   key: 'address',
    // },
    {
      title: 'Số lượng',
      dataIndex: 'quantity_unit',
      key: 'address',
    },
    {
      title: 'Đơn vị tính',
      dataIndex: 'unit',
      key: 'address',
    },
    // {
    //   title: 'Doanh Thu',
    //   dataIndex: 'money',
    //   key: 'address',
    // },
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
    const response = await api.statistics_refund.refund(params);
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
    const response = await api.statistics_refund.refund(params);
    statisticData(response.data.data.results);
  }

  const statisticData = (data) => {
    let dataMain = [];
    data.forEach(element => {
      let pr_gr = "";
      element.product.product_groups.forEach(elm => {
        pr_gr += elm.name;
      });
      let index = {
        id_order: element.order.id,
        date_order: element.order.date_created.slice(0, 10),
        id_refund: element.order_refund.id,
        date_refund: element.order_refund.date_created.slice(0, 10),
        product_group: pr_gr,
        product_category: element.product.product_category.name,
        codeProduct: element.product.product_code,
        nameProduct: element.product.name,
        quantity: 0,
        quantity_unit: element.quantity,
        quantity_total: element.quantity,
        money: element.order.final_total,
        unit: element.product.base_unit.name
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
    var worksheet = ExcelJSWorkbook.addWorksheet("BAOCAO", {views: [{showGridLines: false}]});

    worksheet.mergeCells("A1:L1");

    const customCell1 = worksheet.getCell("A1");
    customCell1.font = {
      name: "Times New Roman",
      family: 4,
      size: 8,
    };
    customCell1.value = "Tên cửa hàng: SIÊU THỊ MINI NT";

    worksheet.mergeCells("A2:L2");

    const customCell2 = worksheet.getCell("A2");
    customCell2.font = {
      name: "Times New Roman",
      family: 4,
      size: 8,
    };
    customCell2.value = "Địa chỉ: Gò Vấp - Tp.Hồ Chí Minh";

    worksheet.mergeCells("A3:L3");

    const customCell3 = worksheet.getCell("A3");
    customCell3.font = {
      name: "Times New Roman",
      family: 4,
      size: 8,
    };
    const day = new Date();
    customCell3.value = "Ngày xuất báo cáo: " + day.getDate() + "/" + (day.getMonth() + 1) + "/" + day.getFullYear();

    worksheet.mergeCells("A4:L4");

    const customCell4 = worksheet.getCell("A4");
    customCell4.font = {
      name: "Times New Roman",
      family: 4,
      size: 8,
    };
    customCell4.value = "Người xuất báo cáo: " + sessionStorage.getItem("nameStaff") + ' - ' + sessionStorage.getItem("phoneStaff");

    worksheet.mergeCells("A5:L5");

    const customCell = worksheet.getCell("A5");
    customCell.font = {
      name: "Times New Roman",
      family: 4,
      size: 14,
      bold: true,
    };
    customCell.alignment = { vertical: 'middle', horizontal: 'center' };

    customCell.value = "BẢNG KÊ CHI TIẾT HÀNG HÓA ĐƠN TRẢ HÀNG";

    worksheet.mergeCells("A6:L6");

    const customCell5 = worksheet.getCell("A6");
    customCell5.font = {
      name: "Times New Roman",
      family: 4,
      size: 8,
    };
    customCell5.alignment = { vertical: 'middle', horizontal: 'center' };

    customCell5.value = "Từ ngày: " + date[0].slice(0, 10) + "      Đến ngày: " + date[1].slice(0, 10) + " ";

    let header = ["STT", "Hóa đơn mua", "Ngày đơn hàng mua", "Hóa đơn trả", "Ngày đơn hàng trả", "Nhóm sản phẩm", "Ngành hàng",
      "Mã sản phẩm", "Tên sản phẩm", "Số lượng thùng", "Số lượng lẻ", "Tổng số lượng"];
    let headerColumn = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

    worksheet.mergeCells("A7:L7");
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
      } else if (i == 8) {
        worksheet.getColumn(i + 1).width = "30";
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
    let total_quantity = 0
    data.forEach(element => {
      worksheet.addRow([i, element.id_order, element.date_order, element.id_refund, element.date_refund, element.product_group,
        element.product_category, element.codeProduct, element.nameProduct, element.quantity, element.quantity_unit,
        element.quantity_total]);
      for (let j = 0; j < headerColumn.length; j++) {
        const columnn = worksheet.getCell(headerColumn[j] + (i + 8));
        columnn.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        if (j == 0 || j == 1 || j == 2 || j == 3 || j == 4) {
          columnn.alignment = { vertical: 'middle', horizontal: 'center' };
        } else if (j == 9 || j == 10 || j == 11 || j == 12) {
          columnn.alignment = { vertical: 'middle', horizontal: 'right' };
        } else {
          columnn.alignment = { vertical: 'middle', horizontal: 'left' };
        }

      }

      i++;
      // total = total + element.money;
      total_quantity = total_quantity + element.quantity_total;
    });
    worksheet.mergeCells("A" + (i + 8) + ":K" + (i + 8));
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
    customCellTT.value = "Tổng giá trị: ";

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
    customCellTT1.alignment = { vertical: 'middle', horizontal: 'right' };
    customCellTT1.value = total_quantity.toLocaleString();

    // const customCellTT2 = worksheet.getCell("M" + (i + 8));
    // customCellTT2.font = {
    //   name: "Times New Roman",
    //   family: 4,
    //   size: 11,
    //   bold: true,
    // };
    // customCellTT2.border = {
    //   top: { style: 'thin' },
    //   left: { style: 'thin' },
    //   bottom: { style: 'thin' },
    //   right: { style: 'thin' }
    // };
    // customCellTT2.alignment = { vertical: 'middle', horizontal: 'right' };
    // customCellTT2.value = total.toLocaleString();


    ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
      saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        `BaoCaoTraHang${day.getDate()}${day.getMonth() + 1}${day.getFullYear()}${day.getHours()}${day.getMinutes()}${day.getSeconds()}.xlsx`
      );
    });
  }

  return (
    <div>
      <Row style={{ marginBottom: '0px' }}><Col span={24}><h1 style={{ textAlign: 'center', fontSize: '25px', margin: '0px' }}>Thống kê trả hàng</h1></Col></Row>
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
    </div>

  )

}

export default StatisticsRefund;