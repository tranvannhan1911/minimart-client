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
    var worksheet = ExcelJSWorkbook.addWorksheet("DonViTinh");

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

    worksheet.getRow(8).font = { bold: true };

    let header = ["STT", "Mã sản phẩm", "Sản phẩm", "Số lượng trước (DVT cơ bản)", "Số lượng sau (DVT cơ bản)", "Chênh lệch", "Ghi chú"];

    worksheet.mergeCells("A6:G6");

    const customCell7 = worksheet.getCell("A6");
    customCell7.font = {
      name: "Times New Roman",
      family: 4,
      size: 8,
    };
    customCell7.alignment = { vertical: 'middle', horizontal: 'center' };
    customCell7.value = "Mã phiếu kiểm kê: " + props.data.id + "       Ngày kiểm kê: " + props.data.date_created.slice(0, 10);

    worksheet.mergeCells("A7:G7");
    const customCell8 = worksheet.getCell("A7");
    customCell8.font = {
      name: "Times New Roman",
      family: 4,
      size: 8,
    };
    customCell8.alignment = { vertical: 'middle', horizontal: 'center' };

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
      } else if (i == 2 || i == 3 || i == 4) {
        worksheet.getColumn(i + 1).width = "30";
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
        column: 7
      }
    };
    let i = 1;
    dataSource.forEach(element => {
      worksheet.addRow([i,element.product_obj.product_code, element.product, element.quantity_before, element.quantity_after, (element.quantity_after - element.quantity_before) + " " + element.product_obj.base_unit.name, element.note]);
      for (let j = 0; j < headerColumn.length; j++) {
        const columnn = worksheet.getCell(headerColumn[j] + (i + 8));
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
        //  else {
        //     columnn.alignment = { vertical: 'middle', horizontal: 'right' };
        // }

      }

      i++;
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
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}>Trạng thái: {props.data.status == 'pending' ? 'Tạo mới' : ''}{props.data.status == 'complete' ? 'Hoàn thành' : ''}{props.data.status == 'cancel' ? 'Hủy' : ''}</p>
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