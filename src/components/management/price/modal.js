import {
  DownloadOutlined
} from '@ant-design/icons';
import { Drawer, Row, Col, Divider, Table, Button } from 'antd';
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
    },
  ];

  /////////////////

  const exportExcel = () => {
    var ExcelJSWorkbook = new ExcelJS.Workbook();
    var worksheet = ExcelJSWorkbook.addWorksheet("BangGia");

    worksheet.mergeCells("A2:E2");

    const customCell = worksheet.getCell("A2");
    customCell.font = {
      name: "Times New Roman",
      family: 4,
      size: 20,
      underline: true,
      bold: true,
    };
    customCell.alignment = { vertical: 'middle', horizontal: 'center' };

    customCell.value = "Thông tin bảng giá";

    let header = ["Mã sản phẩm", "Sản phẩm", "Đơn vị tính", "Giá"];

    var headerRow = worksheet.addRow();
    var headerRow = worksheet.addRow();

    const customCellA5 = worksheet.getCell("A5");
    customCellA5.value = "Mã bảng giá:";
    const customCellB5 = worksheet.getCell("B5");
    customCellB5.value = props.data.price_list_id + "";

    const customCellC5 = worksheet.getCell("C5");
    customCellC5.value = "Tên bảng giá:";
    const customCellD5 = worksheet.getCell("D5");
    customCellD5.value = props.data.name;

    let tt = "";
    if (props.data.status == true) {
      tt = "Hoạt động";
    } else {
      tt = 'Khóa';
    }

    const customCellA6 = worksheet.getCell("A6");
    customCellA6.value = "Ngày bắt đầu:";
    const customCellB6 = worksheet.getCell("B6");
    customCellB6.value = props.data.start_date;

    const customCellC6 = worksheet.getCell("C6");
    customCellC6.value = "Ngày kết thúc:";
    const customCellD6 = worksheet.getCell("D6");
    customCellD6.value = props.data.end_date;

    const customCellA7 = worksheet.getCell("A7");
    customCellA7.value = "Trạng thái:";
    const customCellB7 = worksheet.getCell("B7");
    customCellB7.value = tt;

    const customCellC7 = worksheet.getCell("C7");
    customCellC7.value = "Ghi chú:";
    const customCellD7 = worksheet.getCell("D7");
    customCellD7.value = props.data.note == null ? "" : props.note;

    var headerRow = worksheet.addRow();
    var headerRow = worksheet.addRow();
    var headerRow = worksheet.addRow();

    worksheet.getRow(10).font = { bold: true };

    for (let i = 0; i < 4; i++) {
      let currentColumnWidth = "123";
      worksheet.getColumn(i + 1).width =
        currentColumnWidth !== undefined ? currentColumnWidth / 6 : 20;
      let cell = headerRow.getCell(i + 1);
      cell.value = header[i];
    }

    worksheet.autoFilter = {
      from: {
        row: 10,
        column: 1
      },
      to: {
        row: 10,
        column: 4
      }
    };

    dataSource.forEach(element => {
      worksheet.addRow([element.product_obj.product_code, element.product, element.unit_exchange, element.price]);
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
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}>Trạng thái: {props.data.status ? "Hoạt động" : "Khóa"}</p>
          </div>
        </Col>
      </Row>
      <Divider />
      <p className="site-description-item-profile-p" style={{ fontSize: '20px', marginTop: '20px', fontWeight: 'bold' }}>Danh sách giá sản phẩm
      </p>
      <Table dataSource={dataSource} columns={columns} />

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