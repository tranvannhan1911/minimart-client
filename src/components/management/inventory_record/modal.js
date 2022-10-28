import {
  DownloadOutlined
} from '@ant-design/icons';
import { Drawer, Row, Col, Divider, Table, Typography, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import ExcelJS from "exceljs";
import saveAs from "file-saver";

const InventoryRecordModal = (props) => {
  const [data, setData] = useState("");
  const [dataSource, setDataSource] = useState([]);


  useEffect(() => {
    if (props.data.details != null) {

      setDataSource(props.data.details)
      console.log("dataSource", dataSource)
      setData(props.data)
      console.log(props.data)
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
      title: 'Số lượng trước',
      dataIndex: 'quantity_before',
      key: 'age',
      render: (quantity_before, record) => (
        <Typography>{`${quantity_before} ${record.product_obj.base_unit.name}`}</Typography>
      ),
    },
    {
      title: 'Số lượng sau',
      dataIndex: 'quantity_after',
      key: 'age',
      render: (quantity_after, record) => (
        <Typography>{`${quantity_after} ${record.product_obj.base_unit.name}`}</Typography>
      ),
    },
    {
      title: 'Chênh lệch',
      dataIndex: 'diff',
      key: 'age',
      render: (diff, record) => (
        <Typography>{`${record.quantity_after - record.quantity_before} ${record.product_obj.base_unit.name}`}</Typography>
      ),
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'age',
    },
  ];

  /////////////////

  const exportExcel = () => {
    var ExcelJSWorkbook = new ExcelJS.Workbook();
    var worksheet = ExcelJSWorkbook.addWorksheet("KiemKe");

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

    customCell.value = "Thông tin phiếu kiểm kê";

    let header = ["Mã sản phẩm", "Sản phẩm", "Số lượng trước (DVT cơ bản)", "Số lượng sau (DVT cơ bản)", "Chênh lệch", "Ghi chú"];

    var headerRow = worksheet.addRow();
    var headerRow = worksheet.addRow();

    const customCellA5 = worksheet.getCell("A5");
    customCellA5.value = "Mã phiếu kiểm kê:";
    const customCellB5 = worksheet.getCell("B5");
    customCellB5.value = props.data.id + "";

    const customCellC5 = worksheet.getCell("C5");
    customCellC5.value = "Ngày kiểm kê:";
    const customCellD5 = worksheet.getCell("D5");
    customCellD5.value = props.data.date_created;

    let tt = "";
    if (props.data.status == 'pending') {
      tt = "Chờ xác nhận";
    } else {
      tt = 'Hoàn thành';
    }

    const customCellA6 = worksheet.getCell("A6");
    customCellA6.value = "Trạng thái:";
    const customCellB6 = worksheet.getCell("B6");
    customCellB6.value = tt;

    const customCellC6 = worksheet.getCell("C6");
    customCellC6.value = "Ghi chú:";
    const customCellD6 = worksheet.getCell("D6");
    customCellD6.value = props.data.note == null ? "" : props.note;

    var headerRow = worksheet.addRow();
    var headerRow = worksheet.addRow();
    var headerRow = worksheet.addRow();

    worksheet.getRow(9).font = { bold: true };

    for (let i = 0; i < 6; i++) {
      let currentColumnWidth = "123";
      worksheet.getColumn(i + 1).width =
        currentColumnWidth !== undefined ? currentColumnWidth / 6 : 20;
      let cell = headerRow.getCell(i + 1);
      cell.value = header[i];
    }

    worksheet.autoFilter = {
      from: {
        row: 9,
        column: 1
      },
      to: {
        row: 9,
        column: 6
      }
    };

    dataSource.forEach(element => {
      worksheet.addRow([element.product_obj.product_code, element.product, element.quantity_before, element.quantity_after, (element.quantity_after - element.quantity_before) + " " + element.product_obj.base_unit.name, element.note]);
    });

    ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
      saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        `PhieuKiemKeSo${props.data.id}.xlsx`
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
        Thông tin phiếu kiểm kê
      </p>
      <Divider />
      <p className="site-description-item-profile-p" style={{ fontSize: '20px', marginTop: '20px', fontWeight: 'bold' }}>Thông tin cơ bản
        <span style={{ float: 'right' }}>
          <Button onClick={() => exportExcel()}> <DownloadOutlined /> Xuất Excel</Button>
        </span>
      </p>
      <Row>
        <Col span={24}>
          <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}>Mã phiếu kiểm kê: {props.data.id}</p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}>Ngày kiểm kê: {props.data.date_created}</p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}>Trạng thái: {props.data.status == 'pending' ? 'Chờ xác nhận' : ''}{props.data.status == 'complete' ? 'Hoàn thành' : ''}{props.data.status == 'cancel' ? 'Hủy' : ''}</p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}>Ghi chú: {props.data.note}</p>
          </div>
        </Col>
      </Row>
      <Divider />
      <p className="site-description-item-profile-p" style={{ fontSize: '20px', marginTop: '20px' }}>Danh sách sản phẩm
      </p>
      <Table dataSource={dataSource} columns={columns} size='small'/>

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
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}>Người tạo: {props.data.user_created}</p>
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
export default InventoryRecordModal;