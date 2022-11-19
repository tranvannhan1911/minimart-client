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
  const [category, setCategory] = useState("")
  const [productGroup, setProductGroup] = useState("")
  const [product, setProduct] = useState("")
  const [categoryOptions, setCategoryOptions] = useState([])
  const [productGroupOptions, setProductGroupOptions] = useState([])
  const [productOptions, setProductOptions] = useState([])

  useEffect(() => {
    document.title = "Thống kê trả hàng - Quản lý siêu thị mini NT"
    onThongKeToDay()
    handleDataCategory()
    handleDataProductGroup()
    handleDataProduct()
  }, [])

  const handleDataCategory = async () => {
    try {
      const response = await api.category.to_select()
      const options = response.data.data.results.map(elm => {
        return (
          <Option key={elm.id} value={elm.id}>{elm.name}</Option>
        )
      })
      setCategoryOptions(options);
    } catch (error) {
      message.error(messages.ERROR)
    }
  }

  const handleDataProduct = async () => {
    try {
      const response = await api.product.list()
      const options = response.data.data.results.map(elm => {
        return (
          <Option key={elm.id} value={elm.id}>{elm.name}</Option>
        )
      })
      setProductOptions(options);
    } catch (error) {
      message.error(messages.ERROR)
    }
  }

  const handleDataProductGroup = async () => {
    try {
      const response = await api.product_group.list()
      const options = response.data.data.results.map(elm => {
        return (
          <Option key={elm.id} value={elm.id}>{elm.name}</Option>
        )
      })
      setProductGroupOptions(options);
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
    {
      title: 'DVT',
      dataIndex: 'unit',
      key: 'address',
    },
    {
      title: 'Số lượng trả',
      dataIndex: 'quantity',
      key: 'address',
    },
    {
      title: 'Số lượng theo DVT lẻ',
      dataIndex: 'quantity_unit',
      key: 'address',
    },

    {
      title: 'Tổng tiền',
      dataIndex: 'money',
      key: 'address',
      render: (product, record) => (
        <Typography>{`${record.money?.toLocaleString()}`}</Typography>
      ),
    },
  ];

  const resetFilter = () => {
    setCategory("")
    setProduct("")
    setProductGroup("")
  }

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
        product_category_id: category,
        product_group_id: productGroup,
        product_id: product
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
      element.product.product_groups?.forEach(elm => {
        pr_gr += elm.name;
      });
      let index = {
        id_order: element.order.id,
        date_order: element.order.date_created.slice(0, 10),
        id_refund: element.order_refund.id,
        date_refund: element.order_refund.date_created.slice(0, 10),
        product_group: pr_gr,
        product_category: element.product.product_category?.name,
        codeProduct: element.product.product_code,
        nameProduct: element.product.name,
        quantity: element.quantity,
        quantity_unit: element.quantity_base_unit,
        quantity_total: element.quantity,
        money: element.order_refund.total,
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
    var worksheet = ExcelJSWorkbook.addWorksheet("BAOCAO", { views: [{ showGridLines: false }] });

    worksheet.mergeCells("A1:M1");

    const customCell1 = worksheet.getCell("A1");
    customCell1.font = {
      name: "Times New Roman",
      family: 4,
      size: 8,
    };
    customCell1.value = "Tên cửa hàng: SIÊU THỊ MINI NT";

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

    customCell.value = "BẢNG KÊ CHI TIẾT HÀNG HÓA ĐƠN TRẢ HÀNG";

    worksheet.mergeCells("A6:M6");

    const customCell5 = worksheet.getCell("A6");
    customCell5.font = {
      name: "Times New Roman",
      family: 4,
      size: 8,
    };
    customCell5.alignment = { vertical: 'middle', horizontal: 'center' };

    customCell5.value = "Từ ngày: " + date[0].slice(0, 10) + "      Đến ngày: " + date[1].slice(0, 10) + " ";

    let header = ["STT", "Hóa đơn mua", "Ngày đơn hàng mua", "Hóa đơn trả", "Ngày đơn hàng trả", "Nhóm sản phẩm", "Ngành hàng",
      "Mã sản phẩm", "Tên sản phẩm", "DVT", "Số lượng trả", "Số lượng theo DVT lẻ", "Tổng tiền"];
    let headerColumn = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];

    worksheet.mergeCells("A7:M7");
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
        column: 14
      }
    };
    let i = 1;
    let total = 0;
    let total_quantity = 0
    data.forEach(element => {
      worksheet.addRow([i, element.id_order, element.date_order, element.id_refund, element.date_refund, element.product_group,
        element.product_category, element.codeProduct, element.nameProduct, element.unit, element.quantity,
        element.quantity_unit?.toLocaleString(), element.money?.toLocaleString()]);
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
        if (j == 0 || j == 1 || j == 2 || j == 3 || j == 4 || j == 9) {
          columnn.alignment = { vertical: 'middle', horizontal: 'center' };
        } else if (j == 9 || j == 10 || j == 11 || j == 12) {
          columnn.alignment = { vertical: 'middle', horizontal: 'right' };
        } else {
          columnn.alignment = { vertical: 'middle', horizontal: 'left' };
        }

      }

      i++;
      total = total + element.money;
      total_quantity = total_quantity + element.quantity_total;
    });
    worksheet.mergeCells("A" + (i + 8) + ":I" + (i + 8));
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

    const customCellTTT = worksheet.getCell("J" + (i + 8));
    customCellTTT.font = {
      name: "Times New Roman",
      family: 4,
      size: 11,
      bold: true,
    };
    customCellTTT.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    customCellTTT.alignment = { vertical: 'middle', horizontal: 'right' };
    customCellTTT.value = "";

    const customCellTTR = worksheet.getCell("K" + (i + 8));
    customCellTTR.font = {
      name: "Times New Roman",
      family: 4,
      size: 11,
      bold: true,
    };
    customCellTTR.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    customCellTTR.alignment = { vertical: 'middle', horizontal: 'right' };
    customCellTTR.value = "";

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
    customCellTT1.value = total_quantity?.toLocaleString();

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
    customCellTT2.value = total?.toLocaleString();

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

          <label style={{ paddingLeft: '10px', paddingRight: '10px' }}>Ngành hàng:</label>
          <Select
            allowClear
            showSearch
            value={category}
            style={{
              width: '10%',
              textAlign: 'left'
            }}
            optionFilterProp="children"
            onChange={(option) => { setCategory(option); console.log(option) }}
            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
            key={categoryOptions}
          >
            {categoryOptions}
          </Select>

          <label style={{ paddingLeft: '10px', paddingRight: '10px' }}>Nhóm sản phẩm:</label>
          <Select
            allowClear
            showSearch
            value={productGroup}
            style={{
              width: '10%',
              textAlign: 'left'
            }}
            optionFilterProp="children"
            onChange={(option) => { setProductGroup(option); console.log(option) }}
            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
          // key={productGroupOptions}
          >
            {productGroupOptions}
          </Select>

          <label style={{ paddingLeft: '10px', paddingRight: '10px' }}>Sản phẩm:</label>
          <Select
            allowClear
            showSearch
            value={product}
            style={{
              width: '15%',
              textAlign: 'left'
            }}
            optionFilterProp="children"
            onChange={(option) => { setProduct(option); console.log(option) }}
            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
          // key={productOptions}
          >
            {productOptions}
          </Select>

        </Col>
      </Row>
      <Row style={{ marginTop: '5px' }}>
        <Col span={24}>
          <Button type="primary" style={{ marginLeft: '10px' }} onClick={() => onThongKe()}>Thống kê</Button>
          <Button style={{ marginLeft: '10px' }} onClick={() => exportExcel()}> <DownloadOutlined /> Xuất báo cáo</Button>
          <Button style={{ marginLeft: '10px' }} onClick={() => resetFilter()}> Xóa lọc</Button>
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