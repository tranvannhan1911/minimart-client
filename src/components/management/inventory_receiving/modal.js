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
        <Typography>{(Number(quantity_base_unit) * Number(record.price)).toLocaleString()}</Typography>
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
    var worksheet = ExcelJSWorkbook.addWorksheet("PhieuNhapHang");

    worksheet.mergeCells("A1:G1");

    const customCell1 = worksheet.getCell("A1");
    customCell1.font = {
      name: "Times New Roman",
      family: 4,
      size: 8,
    };
    customCell1.value = "Tên cửa hàng: SIÊU THỊ MINI";

    worksheet.mergeCells("A2:G2");

    const customCell2 = worksheet.getCell("A2");
    customCell2.font = {
      name: "Times New Roman",
      family: 4,
      size: 8,
    };
    customCell2.value = "Địa chỉ: Gò Vấp - Tp.Hồ Chí Minh";

    worksheet.mergeCells("A3:G3");

    const customCell3 = worksheet.getCell("A3");
    customCell3.font = {
      name: "Times New Roman",
      family: 4,
      size: 8,
    };
    const day = new Date();
    customCell3.value = "Ngày in: " + day.getDate() + "/" + (day.getMonth() + 1) + "/" + day.getFullYear();

    worksheet.mergeCells("A4:G4");

    const customCell4 = worksheet.getCell("A4");
    customCell4.font = {
      name: "Times New Roman",
      family: 4,
      size: 8,
    };
    customCell4.value = "Người xuất báo cáo: " + sessionStorage.getItem("nameStaff") + ' - ' + sessionStorage.getItem("phoneStaff");

    worksheet.mergeCells("A5:G5");

    const customCell = worksheet.getCell("A5");
    customCell.font = {
      name: "Times New Roman",
      family: 4,
      size: 14,
      bold: true,
    };
    customCell.alignment = { vertical: 'middle', horizontal: 'center' };

    customCell.value = "Thông tin phiếu nhập hàng";

    let headerColumn = ["A", "B", "C", "D", "E", "F", "G"];

    worksheet.getRow(9).font = { bold: true };

    let header = ["STT", "Mã sản phẩm", "Sản phẩm", "Giá", "Số lượng (DVT cơ bản)", "Thành tiền", "Ghi chú"];

    worksheet.mergeCells("A6:G6");

    const customCell7 = worksheet.getCell("A6");
    customCell7.font = {
      name: "Times New Roman",
      family: 4,
      size: 8,
    };
    customCell7.alignment = { vertical: 'middle', horizontal: 'center' };
    customCell7.value = "Mã phiếu nhập hàng: " + props.data.id +"       Ngày nhập hàng: "+props.data.date_created.slice(0,10);

    worksheet.mergeCells("A7:G7");
    const customCell8 = worksheet.getCell("A7");
    customCell8.font = {
      name: "Times New Roman",
      family: 4,
      size: 8,
    };
    customCell8.alignment = { vertical: 'middle', horizontal: 'center' };
    customCell8.value = "Nhà cung cấp: " + props.data.supplier;

    worksheet.mergeCells("A8:G8");

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
      } else if(i == 2){
        worksheet.getColumn(i + 1).width = "30";
      }else{
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
        column: 7
      }
    };
    let i = 1;
    dataSource.forEach(element => {
      worksheet.addRow([i, element.product.product_code, element.product.name, element.price.toLocaleString(), element.quantity_base_unit, (element.quantity_base_unit * element.price).toLocaleString(), element.note]);
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
         else if (j == 3 || j == 5) {
            columnn.alignment = { vertical: 'middle', horizontal: 'right' };
        }

      }

      i++;
    });

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
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}>Tổng tiền: {props.data.total?.toLocaleString()}</p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}>Trạng thái: {props.data.status == 'pending' ? 'Tạo mới' : ''}{props.data.status == 'complete' ? 'Hoàn thành' : ''}{props.data.status == 'cancel' ? 'Đã hủy' : ''}</p>
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
export default InventoryReceivingModal;