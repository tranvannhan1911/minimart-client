import { Drawer, Row, Col, Divider, Table, Typography } from 'antd';
import React, { useState, useEffect } from 'react';
import { ExportReactCSV } from '../../../utils/exportExcel';


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
        <Typography>{`${record.quantity_after-record.quantity_before} ${record.product_obj.base_unit.name}`}</Typography>
      ),
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'age',
    },
  ];

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
      <p className="site-description-item-profile-p" style={{ fontSize: '20px', marginTop: '20px', fontWeight: 'bold' }}>Thông tin cơ bản</p>
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
        <span style={{ float: 'right' }}>
          <ExportReactCSV csvData={dataSource} fileName='productrecord.xlsx'
            header={[
              { label: 'Sản phẩm', key: 'product' },
              { label: 'Số lượng trước', key: 'quantity_before' },
              { label: 'Số lượng sau', key: 'quantity_after' },
              { label: 'Ghi chú', key: 'note' },
            ]}
          />
        </span>
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
export default InventoryRecordModal;