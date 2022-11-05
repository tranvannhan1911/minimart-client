import {
  DownloadOutlined
} from '@ant-design/icons';
import { Drawer, Row, Col, Divider, Table, Button, Typography, } from 'antd';
import React, { useState, useEffect } from 'react';
import ExcelJS from "exceljs";
import saveAs from "file-saver";


const PriceModal = (props) => {
  const [data, setData] = useState("");
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    if (props.data.pricedetails != null) {

      setDataSource(props.data.pricedetails)
    }
  });

  const showDrawer = () => {
    props.setOpen(true);
  };

  const onClose = () => {
    props.setOpen(false);
  };

  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'product',
      key: 'name',
    },
    {
      title: 'Đơn vị tính',
      dataIndex: 'unit_exchange',
      key: 'age',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'address',
      render: (price, record) => (
        <Typography>{price?.toLocaleString()}</Typography>
      ),
    },
  ];

  /////////////////

  // const exportExcel = () => {
  //   var ExcelJSWorkbook = new ExcelJS.Workbook();
  //   var worksheet = ExcelJSWorkbook.addWorksheet("BangGia");

  //   worksheet.mergeCells("A2:E2");

  //   const customCell = worksheet.getCell("A2");
  //   customCell.font = {
  //     name: "Times New Roman",
  //     family: 4,
  //     size: 20,
  //     underline: true,
  //     bold: true,
  //   };
  //   customCell.alignment = { vertical: 'middle', horizontal: 'center' };

  //   customCell.value = "Thông tin bảng giá";

  //   let header = ["Mã sản phẩm", "Sản phẩm", "Đơn vị tính", "Giá"];

  //   var headerRow = worksheet.addRow();
  //   var headerRow = worksheet.addRow();

  //   const customCellA5 = worksheet.getCell("A5");
  //   customCellA5.value = "Mã bảng giá:";
  //   const customCellB5 = worksheet.getCell("B5");
  //   customCellB5.value = props.data.price_list_id + "";

  //   const customCellC5 = worksheet.getCell("C5");
  //   customCellC5.value = "Tên bảng giá:";
  //   const customCellD5 = worksheet.getCell("D5");
  //   customCellD5.value = props.data.name;

  //   let tt = "";
  //   if (props.data.status == true) {
  //     tt = "Hoạt động";
  //   } else {
  //     tt = 'Ngưng hoạt động';
  //   }

  //   const customCellA6 = worksheet.getCell("A6");
  //   customCellA6.value = "Ngày bắt đầu:";
  //   const customCellB6 = worksheet.getCell("B6");
  //   customCellB6.value = props.data.start_date;

  //   const customCellC6 = worksheet.getCell("C6");
  //   customCellC6.value = "Ngày kết thúc:";
  //   const customCellD6 = worksheet.getCell("D6");
  //   customCellD6.value = props.data.end_date;

  //   const customCellA7 = worksheet.getCell("A7");
  //   customCellA7.value = "Trạng thái:";
  //   const customCellB7 = worksheet.getCell("B7");
  //   customCellB7.value = tt;

  //   const customCellC7 = worksheet.getCell("C7");
  //   customCellC7.value = "Ghi chú:";
  //   const customCellD7 = worksheet.getCell("D7");
  //   customCellD7.value = props.data.note == null ? "" : props.note;

  //   var headerRow = worksheet.addRow();
  //   var headerRow = worksheet.addRow();
  //   var headerRow = worksheet.addRow();

  //   worksheet.getRow(10).font = { bold: true };

  //   for (let i = 0; i < 4; i++) {
  //     let currentColumnWidth = "123";
  //     worksheet.getColumn(i + 1).width =
  //       currentColumnWidth !== undefined ? currentColumnWidth / 6 : 20;
  //     let cell = headerRow.getCell(i + 1);
  //     cell.value = header[i];
  //   }

  //   worksheet.autoFilter = {
  //     from: {
  //       row: 10,
  //       column: 1
  //     },
  //     to: {
  //       row: 10,
  //       column: 4
  //     }
  //   };

  //   dataSource.forEach(element => {
  //     worksheet.addRow([element.product_obj.product_code, element.product, element.unit_exchange, element.price.toLocaleString()]);
  //   });

  //   ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
  //     saveAs(
  //       new Blob([buffer], { type: "application/octet-stream" }),
  //       `BangGiaSo${props.data.price_list_id}.xlsx`
  //     );
  //   });
  // };

  const exportExcel = () => {
    var ExcelJSWorkbook = new ExcelJS.Workbook();
    var worksheet = ExcelJSWorkbook.addWorksheet("BangGia");

    worksheet.mergeCells("A1:E1");

    const customCell1 = worksheet.getCell("A1");
    customCell1.font = {
      name: "Times New Roman",
      family: 4,
      size: 8,
    };
    customCell1.value = "Tên cửa hàng: SIÊU THỊ MINI NT";

    worksheet.mergeCells("A2:E2");

    const customCell2 = worksheet.getCell("A2");
    customCell2.font = {
      name: "Times New Roman",
      family: 4,
      size: 8,
    };
    customCell2.value = "Địa chỉ: Gò Vấp - Tp.Hồ Chí Minh";

    worksheet.mergeCells("A3:E3");

    const customCell3 = worksheet.getCell("A3");
    customCell3.font = {
      name: "Times New Roman",
      family: 4,
      size: 8,
    };
    const day = new Date();
    customCell3.value = "Ngày in: " + day.getDate() + "/" + (day.getMonth() + 1) + "/" + day.getFullYear();

    worksheet.mergeCells("A4:E4");

    const customCell4 = worksheet.getCell("A4");
    customCell4.font = {
      name: "Times New Roman",
      family: 4,
      size: 8,
    };
    customCell4.value = "Người xuất báo cáo: " + sessionStorage.getItem("nameStaff") + ' - ' + sessionStorage.getItem("phoneStaff");

    worksheet.mergeCells("A5:E5");

    const customCell = worksheet.getCell("A5");
    customCell.font = {
      name: "Times New Roman",
      family: 4,
      size: 14,
      bold: true,
    };
    customCell.alignment = { vertical: 'middle', horizontal: 'center' };

    customCell.value = "Thông tin bảng giá";

    let headerColumn = ["A", "B", "C", "D", "E"];

    worksheet.getRow(9).font = { bold: true };

    let header = ["STT", "Mã sản phẩm", "Sản phẩm", "Đơn vị tính", "Giá"];

    worksheet.mergeCells("A6:E6");

    const customCell7 = worksheet.getCell("A6");
    customCell7.font = {
      name: "Times New Roman",
      family: 4,
      size: 8,
    };
    customCell7.alignment = { vertical: 'middle', horizontal: 'center' };
    customCell7.value = "Mã bảng giá: " + props.data.price_list_id + "       Tên bảng giá: " + props.data.name;

    worksheet.mergeCells("A7:E7");
    const customCell8 = worksheet.getCell("A7");
    customCell8.font = {
      name: "Times New Roman",
      family: 4,
      size: 8,
    };
    customCell8.alignment = { vertical: 'middle', horizontal: 'center' };
    customCell8.value = "Ngày bắt đầu: " + props.data.start_date + "       Ngày kết thúc: " + props.data.end_date;

    worksheet.mergeCells("A8:E8");

    const customCell5 = worksheet.getCell("A8");
    customCell5.font = {
      name: "Times New Roman",
      family: 4,
      size: 8,
    };
    customCell5.alignment = { vertical: 'middle', horizontal: 'center' };

    for (let i = 0; i < headerColumn.length; i++) {
      const columnn = worksheet.getCell(headerColumn[i] + 9);
      columnn.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      if (i == 0) {
        worksheet.getColumn(i + 1).width = "10";
      } else if (i == 2) {
        worksheet.getColumn(i + 1).width = "30";
      } else {
        worksheet.getColumn(i + 1).width = "20";
      }
      columnn.alignment = { vertical: 'middle', horizontal: 'center' };
      columnn.value = header[i];
    }

    worksheet.autoFilter = {
      from: {
        row: 9,
        column: 1
      },
      to: {
        row: 9,
        column: 5
      }
    };
    let i = 1;
    dataSource.forEach(element => {
      worksheet.addRow([i, element.product_obj.product_code, element.product, element.unit_exchange, element.price.toLocaleString()]);
      for (let j = 0; j < headerColumn.length; j++) {
        const columnn = worksheet.getCell(headerColumn[j] + (i + 9));
        columnn.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        if (j == 0) {
          columnn.alignment = { vertical: 'middle', horizontal: 'center' };
        }
        else if (j == 4) {
          columnn.alignment = { vertical: 'middle', horizontal: 'right' };
        }

      }

      i++;
    });

    ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
      saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        `BangGiaSo${props.data.price_list_id}.xlsx`
      );
    });
  };

  ////////////////

  return (
    <Drawer width={640} placement="right" closable={false} onClose={onClose} visible={props.open}>
      <p
        className="site-description-item-profile-p"
        style={{
          marginBottom: 24,
          fontSize: 25,
          fontWeight: 'bold'
        }}
      >
        Thông tin bảng giá
      </p>

      <p className="site-description-item-profile-p" style={{ fontSize: '20px', marginTop: '20px', fontWeight: 'bold' }}>Thông tin cơ bản
        <span style={{ float: 'right' }}>
          <Button onClick={() => exportExcel()}> <DownloadOutlined /> Xuất Excel</Button>
        </span>
      </p>
      <Row>
        <Col span={12}>
          <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}>Mã bảng giá: {props.data.price_list_id}</p>
          </div>
        </Col>
        <Col span={12}>
          <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}>Tên bảng giá: {props.data.name}</p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}>Ngày bắt đầu: {props.data.start_date}</p>
          </div>
        </Col>

        <Col span={12}>
          <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}>Ngày kết thúc: {props.data.end_date}</p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}>Trạng thái: {props.data.status ? "Hoạt động" : "Ngưng hoạt động"}</p>
          </div>
        </Col>
      </Row>
      <Divider />
      <p className="site-description-item-profile-p" style={{ fontSize: '20px', marginTop: '20px', fontWeight: 'bold' }}>Danh sách giá sản phẩm
      </p>
      <Table dataSource={dataSource} columns={columns} size='small' />

      <Divider />
      <p className="site-description-item-profile-p" style={{ fontSize: '20px', marginTop: '20px', fontWeight: 'bold' }}>Thông tin lịch sử</p>
      <Row>
        <Col span={12}>
          <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}>Ngày tạo: {props.data.date_created}</p>
          </div>
        </Col>
        <Col span={12}>
          <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}>Người tạo: {props.data.user_created?.fullname}</p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}>Ngày cập nhật: {props.data.date_updated}</p>
          </div>
        </Col>
        <Col span={12}>
          <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}>Người cập nhật: {props.data.user_updated?.fullname}</p>
          </div>
        </Col>
      </Row>
    </Drawer>
  );
};
export default PriceModal;