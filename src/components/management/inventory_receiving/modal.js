import { Button, Drawer, Row, Col, Divider, Image, Table } from 'antd';
import React, { useState, useEffect } from 'react';

const InventoryReceivingModal = (props) => {
  const [dataSource, setDataSource] = useState("");
  const showDrawer = () => {
    props.setOpen(true);
  };

  const onClose = () => {
    props.setOpen(false);
  };

  useEffect(() => {
    setDataSource(props.data.details)
    // console.log(dataSource,1111)
  });

  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'product',
      key: 'name',
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
      key: 'address',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'address',
    },
  ];

  return (
    <Drawer width={640} placement="right" closable={false} onClose={onClose} visible={props.open}>
      <p
        className="site-description-item-profile-p"
        style={{
          marginBottom: 24,
          fontSize: 25,
          fontWeight:'bold'
        }}
      >
        Thông tin phiếu nhập hàng
      </p>
      
      <p className="site-description-item-profile-p" style={{ fontSize: '20px', marginTop: '20px', fontWeight:'bold' }}>Thông tin cơ bản</p>
      <Row>
        <Col span={24}>
          <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}>Mã phiếu nhập hàng: {props.data.id}</p>
          </div>
        </Col>
        <Col span={24}>
          <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}>Ngày nhập: {props.data.id}</p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}>Nhà cung cấp: {props.data.supplier}</p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}>Tổng tiền: {props.data.total}</p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}>Trạng thái: {props.data.status == 'pending' ? 'Chờ xác nhận' :''}{props.data.status == 'complete' ? 'Hoàn thành':''}{props.data.status == 'cancel' ? 'Hủy':''}</p>
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
      <p className="site-description-item-profile-p" style={{ fontSize: '20px', marginTop: '20px', fontWeight:'bold' }}>Danh sách sản phẩm nhập</p>
      <Table dataSource={dataSource} columns={columns}/>
    </Drawer>
  );
};
export default InventoryReceivingModal;