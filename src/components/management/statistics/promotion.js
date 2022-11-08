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

const StatisticsPromotion = () => {

  const [data, setData] = useState([]);
  const [type, setType] = useState("");
  const [date, setDate] = useState([]);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = "Thống kê chương trình khuyến mãi - Quản lý siêu thị mini NT"
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
      title: 'Mã CTKM',
      dataIndex: 'id',
      key: 'name',

    },
    {
      title: 'Tên CTKM',
      dataIndex: 'name',
      key: 'address',

    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'end_date',
      key: 'address',

    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'start_date',
      key: 'address',

    },

    // {
    //   title: 'Mã SP tặng',
    //   dataIndex: 'idProduct',
    //   key: 'address',
    // },
    // {
    //   title: 'Tên SP tặng',
    //   dataIndex: 'nameProduct',
    //   key: 'address',
    // },
    // {
    //   title: 'SL tặng',
    //   dataIndex: 'quantity',
    //   key: 'address',
    // },
    // {
    //   title: 'Đơn vị tính',
    //   dataIndex: 'unit',
    //   key: 'address',
    // },
    {
      title: 'Số tiền chiết khấu',
      dataIndex: 'money',
      key: 'address',
      render: (product, record) => (
        <Typography>{`${record.money.toLocaleString()}`}</Typography>
      ),
    },
    {
      title: 'Ngân sách tổng',
      dataIndex: 'moneyTotal',
      key: 'address',
      render: (product, record) => (
        <Typography>{`${record.moneyTotal.toLocaleString()}`}</Typography>
      ),
    },
    {
      title: 'Ngân sách đã sử dụng',
      dataIndex: 'moneyUsed',
      key: 'address',
      render: (product, record) => (
        <Typography>{`${record.moneyUsed.toLocaleString()}`}</Typography>
      ),
    },
    {
      title: 'Ngân sách còn lại',
      dataIndex: 'moneyRecord',
      key: 'address',
      render: (product, record) => (
        <Typography>{`${record.moneyRecord.toLocaleString()}`}</Typography>
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
        type: type
      }
    }
    const response = await api.statistics_promotion.promotion(params);
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
    const response = await api.statistics_promotion.promotion(params);
    statisticData(response.data.data.results);
  }

  const statisticData = (data) => {
    let dataMain = [];
    data.forEach(element => {
      if (type == "Product") {
        let index = {
          id: element.promotion_line.promotion_code,
          name: element.promotion_line.title,
          start_date: element.promotion_line.start_date.slice(0, 10),
          end_date: element.promotion_line.end_date.slice(0, 10),
          idProduct: element.promotion_line.detail.product_received,
          nameProduct: element.promotion_line.detail.product_received,
          quantity: element.promotion_line.detail.quantity_received,
          unit: element.promotion_line.detail.product_received,
          money: 0,
          moneyTotal: element.promotion_line.max_quantity,
          moneyUsed: element.quantity,
          moneyRecord: element.promotion_line.max_quantity == null ? "" : element.promotion_line.max_quantity - element.amount
        }
        dataMain.push(index);
      } else {
        let index = {
          id: element.promotion_line.promotion_code,
          name: element.promotion_line.title,
          start_date: element.promotion_line.start_date.slice(0, 10),
          end_date: element.promotion_line.end_date.slice(0, 10),
          idProduct: "",
          nameProduct: "",
          quantity: "",
          unit: "",
          money: 0,
          moneyTotal: element.promotion_line.max_quantity == null ? "" : element.promotion_line.max_quantity * element.promotion_line.detail.reduction_amount,
          moneyUsed: element.amount,
          moneyRecord: element.promotion_line.max_quantity == null ? "" : (element.promotion_line.max_quantity * element.promotion_line.detail.reduction_amount) - element.amount
        }
        dataMain.push(index);
      }
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

    worksheet.mergeCells("A1:I1");

    const customCell1 = worksheet.getCell("A1");
    customCell1.font = {
      name: "Times New Roman",
      family: 4,
      size: 8,
    };
    customCell1.value = "Tên cửa hàng: SIÊU THỊ MINI NT";

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
    customCell3.value = "Ngày xuất báo cáo: " + day.getDate() + "/" + (day.getMonth() + 1) + "/" + day.getFullYear();

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

    customCell.value = "BÁO CÁO TỔNG KẾT CTKM ";

    worksheet.mergeCells("A6:I6");

    const customCell5 = worksheet.getCell("A6");
    customCell5.font = {
      name: "Times New Roman",
      family: 4,
      size: 8,
    };
    customCell5.alignment = { vertical: 'middle', horizontal: 'center' };

    customCell5.value = "Từ ngày: " + date[0].slice(0, 10) + "      Đến ngày: " + date[1].slice(0, 10) + " ";

    // let header = ["STT", "Mã CTKM", "Tên CTKM", "Ngày bắt đầu", "Ngày kết thúc", "Mã SP tặng", "Tên SP tặng",
    //   "SL tặng", "Đơn vị tính", "Số tiền chiết khấu", "Ngân sách tổng", "Ngân sách đã sử dụng", "Ngân sách còn lại"];
    // let headerColumn = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];

    let header = ["STT", "Mã CTKM", "Tên CTKM", "Ngày bắt đầu", "Ngày kết thúc"
      , "Số tiền chiết khấu", "Ngân sách tổng", "Ngân sách đã sử dụng", "Ngân sách còn lại"];
    let headerColumn = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

    worksheet.mergeCells("A7:I7");
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
        column: 9
      }
    };
    let i = 1;
    let total = 0;
    data.forEach(element => {
      worksheet.addRow([i, element.id, element.name, element.start_date, element.end_date,
        element.money?.toLocaleString(), element.moneyTotal?.toLocaleString(),
        element.moneyUsed?.toLocaleString(), element.moneyRecord?.toLocaleString()]);
      for (let j = 0; j < headerColumn.length; j++) {
        const columnn = worksheet.getCell(headerColumn[j] + (i + 8));
        columnn.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        if (j == 0 || j == 3 || j == 4) {
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
    // worksheet.mergeCells("A" + (i + 9) + ":D" + (i + 9));
    // const customCellTT = worksheet.getCell("A" + (i + 9));
    // customCellTT.font = {
    //     name: "Times New Roman",
    //     family: 4,
    //     size: 11,
    //     bold: true,
    // };

    // customCellTT.value = "Tổng cộng: ";

    // const customCellTT1 = worksheet.getCell("E" + (i + 9));
    // customCellTT1.font = {
    //     name: "Times New Roman",
    //     family: 4,
    //     size: 11,
    //     bold: true,
    // };

    // customCellTT1.value = 0;

    // const customCellTT2 = worksheet.getCell("F" + (i + 9));
    // customCellTT2.font = {
    //     name: "Times New Roman",
    //     family: 4,
    //     size: 11,
    //     bold: true,
    // };
    // customCellTT2.alignment = { vertical: 'middle', horizontal: 'right' };
    // customCellTT2.value = total.toLocaleString();

    // const customCellTT3 = worksheet.getCell("G" + (i + 9));
    // customCellTT3.font = {
    //     name: "Times New Roman",
    //     family: 4,
    //     size: 11,
    //     bold: true,
    // };
    // customCellTT3.alignment = { vertical: 'middle', horizontal: 'right' };
    // customCellTT3.value = total.toLocaleString();
    ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
      saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        `BaoCaoTongKetKhuyenMai${day.getDate()}${day.getMonth() + 1}${day.getFullYear()}${day.getHours()}${day.getMinutes()}${day.getSeconds()}.xlsx`
      );
    });
  }

  return (
    <div><Row style={{ marginBottom: '0px' }}><Col span={24}><h1 style={{ textAlign: 'center', fontSize: '25px', margin: '0px' }}>Thống kê tổng kết khuyến mãi</h1></Col></Row>
      <Row style={{ marginTop: '5px' }}>
        <Col span={24}>
          <label style={{ paddingRight: '10px' }}>Ngày thống kê:</label>
          <RangePicker onChange={onChange} defaultValue={[moment(new Date()), moment(new Date())]} />
          <label style={{ paddingLeft: '10px', paddingRight: '10px' }}>Loại khuyến mãi:</label>
          <Select
            allowClear
            showSearch
            style={{
              width: '200px',
              textAlign: 'left'
            }}
            // defaultValue={type}
            optionFilterProp="children"
            onChange={(option) => { setType(option); console.log(option) }}
            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
          >
            <Option value="Order">Chiết khấu và giảm tiền</Option>
            <Option value="Product">Tặng sản phẩm</Option>
          </Select>
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

export default StatisticsPromotion;