import {
  DownloadOutlined
} from '@ant-design/icons';
import { Button, Typography, message, Row, Col, Table, DatePicker } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import api from '../../../api/apis'
import moment from "moment";
import ExcelJS from "exceljs";
import saveAs from "file-saver";

const { RangePicker } = DatePicker;

const StatisticsInventory = () => {

  const [data, setData] = useState([]);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    document.title = "Thống kê tồn kho - Quản lý siêu thị mini NT"
  }, [])

  useEffect(() => {
    onThongKeToDay();
  }, [])

  const onChange = (dates, dateStrings) => {
    if (dates) {
      setDate(dateStrings + "T05:10:10.357Z")
    } else {
      console.log('Clear');
      setDate('');
    }
  };

  const columns = [
    {
      title: 'Nhóm sản phẩm',
      dataIndex: 'product_group',
      key: 'name',

    },
    {
      title: 'Ngành hàng',
      dataIndex: 'product_category',
      key: 'address',

    },
    {
      title: 'Mã sản phẩm',
      dataIndex: 'code',
      key: 'address',

    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'address',

    },

    {
      title: 'ĐVT báo cáo',
      dataIndex: 'unit',
      key: 'address',

    },
    {
      title: 'ĐVT cơ bản',
      dataIndex: 'base_unit',
      key: 'address',
    },

    {
      title: 'Giá ĐVT cơ bản',
      dataIndex: 'price',
      key: 'address',
      render: (product, record) => (
        <Typography>{`${record.price == null ? "" : record.price?.toLocaleString()}`}</Typography>
      ),
    },

    {
      title: 'Số lượng ĐVT báo cáo',
      dataIndex: 'quantity',
      key: 'address',


    },

    {
      title: 'Số lượng ĐVT cơ bản',
      dataIndex: 'quantity_base_unit',
      key: 'address',

    },
    {
      title: 'Doanh thu',
      dataIndex: 'money',
      key: 'address',
      render: (product, record) => (
        <Typography>{`${record.money?.toLocaleString()}`}</Typography>
      ),
    },
  ];

  const onThongKe = async () => {
    if (date == null) {
      message.error("Vui lòng chọn ngày cần thống kê");
      return;
    }
    setLoading(true)
    const params = {
      params: {
        date: date,
      }
    }
    const response = await api.statistics_inventory.inventory(params);
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
    setDate(da)
    const params = {
      params: {
        date: da,
      }
    }
    const response = await api.statistics_inventory.inventory(params);
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
        product_group: pr_gr,
        product_category: element.product.product_category.name,
        code: element.product.product_code,
        name: element.product.name,
        base_unit: element.product.base_unit.name,
        quantity_base_unit: element.stock_base_unit,
        quantity: "",
        unit: element.product.unit_exchange_report.unit_name,
        price: element.product.price_detail?.price,
        money: element.product.price_detail == null ? "" : element.product.price_detail?.price * element.stock_base_unit

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

    worksheet.mergeCells("A1:K1");

    const customCell1 = worksheet.getCell("A1");
    customCell1.font = {
      name: "Times New Roman",
      family: 4,
      size: 8,
    };
    customCell1.value = "Tên cửa hàng: SIÊU THỊ MINI NT";

    worksheet.mergeCells("A2:K2");

    const customCell2 = worksheet.getCell("A2");
    customCell2.font = {
      name: "Times New Roman",
      family: 4,
      size: 8,
    };
    customCell2.value = "Địa chỉ: Gò Vấp - Tp.Hồ Chí Minh";

    worksheet.mergeCells("A3:K3");

    const customCell3 = worksheet.getCell("A3");
    customCell3.font = {
      name: "Times New Roman",
      family: 4,
      size: 8,
    };
    const day = new Date();
    customCell3.value = "Ngày xuất báo cáo: " + day.getDate() + "/" + (day.getMonth() + 1) + "/" + day.getFullYear();

    worksheet.mergeCells("A4:K4");

    const customCell4 = worksheet.getCell("A4");
    customCell4.font = {
      name: "Times New Roman",
      family: 4,
      size: 8,
    };
    customCell4.value = "Người xuất báo cáo: " + sessionStorage.getItem("nameStaff") + ' - ' + sessionStorage.getItem("phoneStaff");

    worksheet.mergeCells("A5:K5");

    const customCell = worksheet.getCell("A5");
    customCell.font = {
      name: "Times New Roman",
      family: 4,
      size: 14,
      bold: true,
    };
    customCell.alignment = { vertical: 'middle', horizontal: 'center' };

    customCell.value = "BÁO CÁO TỒN KHO ";

    worksheet.mergeCells("A6:K6");

    const customCell5 = worksheet.getCell("A6");
    customCell5.font = {
      name: "Times New Roman",
      family: 4,
      size: 8,
    };
    customCell5.alignment = { vertical: 'middle', horizontal: 'center' };

    customCell5.value = "Ngày: " + date.slice(0, 10);

    let header = ["STT", "Nhóm sản phẩm", "Ngành hàng", "Mã sản phẩm", "Tên sản phẩm", "ĐVT báo cáo",
      "ĐVT cơ bản", "Giá ĐVT cơ bản", "Số lượng ĐVT báo cáo", "Số lượng ĐVT cơ bản", "Doanh thu"];
    let headerColumn = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];

    worksheet.mergeCells("A7:H7");
    worksheet.mergeCells("I7:K7");
    const columnnx = worksheet.getCell("I7");
    columnnx.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    columnnx.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'ffb0e2ff' },
      bgColor: { argb: 'ffb0e2ff' }
    };
    columnnx.alignment = { vertical: 'middle', horizontal: 'center' };
    columnnx.value = "Tồn kho trên báo cáo";
    worksheet.getRow(7).font = { bold: true };
    worksheet.getRow(7).height = "20";
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
      } else if (i == 4) {
        worksheet.getColumn(i + 1).width = "35";
      } else if (i == 1 || i == 2 || i == 3) {
        worksheet.getColumn(i + 1).width = "18";
      } else {
        worksheet.getColumn(i + 1).width = "17";
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
        column: 11
      }
    };
    let i = 1;
    let total_quantity = 0;
    let total_quantity_base_unit = 0;
    let total_money = 0;
    data.forEach(element => {
      worksheet.addRow([i, element.product_group, element.product_category, element.code, element.name, element.unit,
        element.base_unit, element.price?.toLocaleString(), element.quantity?.toLocaleString(), element.quantity_base_unit?.toLocaleString(), element.money?.toLocaleString()]);
      for (let j = 0; j < headerColumn.length; j++) {
        const columnn = worksheet.getCell(headerColumn[j] + (i + 8));
        columnn.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        if (j == 0 || j == 1 || j == 2 || j == 3 || j == 5 || j == 6) {
          columnn.alignment = { vertical: 'middle', horizontal: 'center' };
        } else if (j == 7 || j == 8 || j == 9 || j == 10) {
          columnn.alignment = { vertical: 'middle', horizontal: 'right' };
        } else {
          columnn.alignment = { vertical: 'middle', horizontal: 'left' };
        }

      }
      total_quantity = total_quantity + element.quantity;
      total_quantity_base_unit = total_quantity_base_unit + element.quantity_base_unit;
      total_money = element.money == "" ? total_money : total_money + element.money;
      i++;
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

    const customCellTT1 = worksheet.getCell("H" + (i + 8));
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
    customCellTT1.value = "";

    const customCellTT2 = worksheet.getCell("I" + (i + 8));
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
    customCellTT2.value = total_quantity?.toLocaleString();

    const customCellTT3 = worksheet.getCell("J" + (i + 8));
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
    customCellTT3.value = total_quantity_base_unit?.toLocaleString();

    const customCellTT4 = worksheet.getCell("K" + (i + 8));
    customCellTT4.font = {
      name: "Times New Roman",
      family: 4,
      size: 11,
      bold: true,
    };
    customCellTT4.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    customCellTT4.alignment = { vertical: 'middle', horizontal: 'right' };
    customCellTT4.value = total_money?.toLocaleString();

    ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
      saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        `BaoCaoTonKho${day.getDate()}${day.getMonth() + 1}${day.getFullYear()}${day.getHours()}${day.getMinutes()}${day.getSeconds()}.xlsx`
      );
    });
  }

  return (
    <div><Row style={{ marginBottom: '0px' }}><Col span={24}><h1 style={{ textAlign: 'center', fontSize: '25px', margin: '0px' }}>Thống kê tồn kho</h1></Col></Row>
      <Row style={{ marginTop: '0px' }}>
        <Col span={24}>
          <label style={{ paddingRight: '10px' }}>Ngày thống kê:</label>
          <DatePicker onChange={onChange} defaultValue={moment(new Date())} />

          <Button type="primary" style={{ marginLeft: '10px' }} onClick={() => onThongKe()}>Thống kê</Button>
          <Button style={{ marginLeft: '10px' }} onClick={() => exportExcel()}> <DownloadOutlined /> Xuất báo cáo</Button>

        </Col>
      </Row>
      {/* <Row style={{ marginTop: '10px', marginBottom: '10px' }}><Col span={24}><h2 style={{ textAlign: 'center' }}>Đồ thị</h2></Col></Row> */}
      <Row style={{ marginTop: '35px', marginBottom: '10px' }}>
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


export default StatisticsInventory;