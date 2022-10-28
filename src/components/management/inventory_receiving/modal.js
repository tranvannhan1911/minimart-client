import {
  DownloadOutlined
} from '@ant-design/icons';
import { Drawer, Row, Col, Divider, Table, Typography, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import ExcelJS from "exceljs";
import saveAs from "file-saver";

const InventoryReceivingModal = (props) => {
  const [dataSource, setDataSource] = useState([]);

  const showDrawer = () => {
    props.setOpen(true);
  };

  const onClose = () => {
    props.setOpen(false);
  };

  useEffect(() => {
    // detail = props.data.details;
    if (props.data.details != null) {
      //   detail.map(element => {
      //     element.product = element.product.name;
      //     return element;
      //   });
      setDataSource(props.data.details)
      console.log(props.data.details)
    }
    // console.log(props.data.details, 1111);

  });

  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'product',
      key: 'product',
      render: (product, record) => (
        <Typography>{`${product.name}`}</Typography>
      ),
    },
    // {
    //   title: 'Đơn vị tính',
    //   dataIndex: 'unit_exchange',
    //   key: 'age',
    // },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'address',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity, record) => (
        <Typography>{`${quantity} ${record.unit_exchange.unit_name}`}</Typography>
      ),
    },
    {
      title: 'Số lượng trên đơn vị cơ bản',
      dataIndex: 'quantity_base_unit',
      key: 'quantity_base_unit',
      render: (quantity_base_unit, record) => (
        <Typography>{`${quantity_base_unit} ${record.product.base_unit?.name}`}</Typography>
      ),
    },
    {
      title: 'Thành tiền',
      dataIndex: 'quantity_base_unit',
      key: 'quantity_base_unit',
      render: (quantity_base_unit, record) => (
        <Typography>{Number(quantity_base_unit)*Number(record.price)}</Typography>
      ),
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'address',
    },
  ];

  /////////////////

  const exportExcel = () => {
    var ExcelJSWorkbook = new ExcelJS.Workbook();
    var worksheet = ExcelJSWorkbook.addWorksheet("NhapHang");

    worksheet.mergeCells("A2:F2");

    const customCell = worksheet.getCell("A2");
    customCell.font = {
      name: "Times New Roman",
      family: 4,
      size: 20,
      underline: true,
      bold: true,
    };
    customCell.alignment = { vertical: 'middle', horizontal: 'center' };

    customCell.value = "Thông tin phiếu nhập hàng";

    let header = ["Mã sản phẩm", "Sản phẩm", "Giá", "Số lượng (DVT cơ bản)", "Thành tiền", "Ghi chú"];

    var headerRow = worksheet.addRow();
    var headerRow = worksheet.addRow();

    const customCellA5 = worksheet.getCell("A5");
    customCellA5.value = "Mã phiếu nhập hàng:";
    const customCellB5 = worksheet.getCell("B5");
    customCellB5.value = props.data.id + "";

    const customCellC5 = worksheet.getCell("C5");
    customCellC5.value = "Ngày nhập hàng:";
    const customCellD5 = worksheet.getCell("D5");
    customCellD5.value = props.data.date_created;

    let tt = "";
    if (props.data.status == 'pending') {
      tt = "Chờ xác nhận";
    } else if (props.data.status == 'complete') {
      tt = 'Hoàn thành';
    } else {
      tt = "Hủy";
    }

    const customCellA6 = worksheet.getCell("A6");
    customCellA6.value = "Nhà cung cấp:";
    const customCellB6 = worksheet.getCell("B6");
    customCellB6.value = props.data.supplier;

    const customCellC6 = worksheet.getCell("C6");
    customCellC6.value = "Trạng thái:";
    const customCellD6 = worksheet.getCell("D6");
    customCellD6.value = tt;

    const customCellA7 = worksheet.getCell("A7");
    customCellA7.value = "Ghi chú:";
    const customCellB7 = worksheet.getCell("B7");
    customCellB7.value = props.data.note == null ? "" : props.note;

    var headerRow = worksheet.addRow();
    var headerRow = worksheet.addRow();
    var headerRow = worksheet.addRow();

    worksheet.getRow(10).font = { bold: true };

    for (let i = 0; i < 6; i++) {
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
        column: 6
      }
    };

    dataSource.forEach(element => {
      worksheet.addRow([element.product.product_code, element.product.name, element.price, element.quantity_base_unit, (element.quantity_base_unit * element.price), element.note]);
    });

    const customCellTotal = worksheet.getCell("D" + (12 + dataSource.length));
    customCellTotal.font = {
      size: 13,
      underline: true,
      bold: true,

    };
    customCellTotal.value = "Tổng tiền:";
    const customCellTotal1 = worksheet.getCell("E" + (12 + dataSource.length));
    customCellTotal1.font = {
      size: 13,
      underline: true,
      bold: true,
      color: { argb: 'ffff0000' }
    };
    customCellTotal1.value = props.data.total;

    ExcelJSWorkbook.xlsx.writeBuffer().then(function (buffer) {
      saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        `PhieuNhapHangSo${props.data.id}.xlsx`
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
        Thông tin phiếu nhập hàng
      </p>

      <p className="site-description-item-profile-p" style={{ fontSize: '20px', marginTop: '20px', fontWeight: 'bold' }}>Thông tin cơ bản
        <span style={{ float: 'right' }}>
          <Button onClick={() => exportExcel()}> <DownloadOutlined /> Xuất Excel</Button>
        </span>
      </p>
      <Row>
        <Col span={12}>
          <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}>Mã phiếu nhập hàng: {props.data.id}</p>
          </div>
        </Col>
        <Col span={12}>
          <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}>Ngày nhập: {props.data.date_created}</p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}>Nhà cung cấp: {props.data.supplier}</p>
          </div>
        </Col>
        {/* </Row>
      <Row> */}
        <Col span={12}>
          <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}>Tổng tiền: {props.data.total}</p>
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

      <p className="site-description-item-profile-p" style={{ fontSize: '20px', marginTop: '20px', fontWeight: 'bold' }}>Danh sách sản phẩm nhập
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
export default InventoryReceivingModal;