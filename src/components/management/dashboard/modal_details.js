import { Modal, Row, Col, Divider, Table, Typography, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import api from '../../../api/apis';
import messages from '../../../utils/messages';

const OrderDetailModal = (props) => {
  const [dataSourceIndex, setDataSourceindex] = useState("");

  const showDrawer = () => {
    props.setOpenDetails(true);
  };

  const onClose = () => {
    props.setOpenDetails(false);
  };

  useEffect(() => {

    setDataSourceindex(props.data.details)


  });

  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'product',
      key: 'name',
      render: (price, record) => (
        <Typography>{record.product?.name.toLocaleString()}</Typography>
      ),
    },
    {
      title: 'Đơn vị tính',
      dataIndex: 'unit_exchange',
      key: 'age',
      render: (price, record) => (
        <Typography>{record.unit_exchange?.unit_name}</Typography>
      ),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'address',
      render: (price, record) => (
        <Typography>{record.price?.price.toLocaleString()}</Typography>
      ),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'address',
    },
    {
      title: 'Thành tiền',
      dataIndex: 'total',
      key: 'address',
      render: (total, record) => (
        <Typography>{total?.toLocaleString()}</Typography>
      ),
    },
  ];

  return (
    <Modal width={640} placement="right"
      onCancel={onClose} open={props.openDetails}
      footer={[
        // <Button key="back" onClick={onClose}>
        //   Thoát
        // </Button>,
        
      ]}>
      <p
        className="site-description-item-profile-p"
        style={{
          marginBottom: 15,
          fontSize: 25,
          fontWeight: 'bold'
        }}
      >
        Thông tin hóa đơn bán hàng
      </p>

      <p className="site-description-item-profile-p" style={{ fontSize: '20px', marginTop: '10px', fontWeight: 'bold' }}>Thông tin cơ bản</p>
      <Row>
        <Col span={12}>
          <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}>Mã hóa đơn: {props.data.id}</p>
          </div>
        </Col>
        <Col span={12}>
          <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}>Ngày tạo: {props.data.date_created?.slice(0, 10)}</p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}>Nhân viên bán hàng: {sessionStorage.getItem("nameStaff")}</p>
          </div>
        </Col>
        {/* </Row>
      <Row> */}
        <Col span={12}>
          <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}>Khách hàng: {props.data.customer}</p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}>Khuyến mãi: {(props.data.total - props.data.final_total)?.toLocaleString()}</p>
          </div>
        </Col>
        <Col span={12}>
          <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}>Tổng tiền: {props.data.final_total?.toLocaleString()} VND</p>
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

      <p className="site-description-item-profile-p" style={{ fontSize: '20px', marginTop: '5px', fontWeight: 'bold' }}>Danh sách sản phẩm mua</p>
      <Table dataSource={dataSourceIndex} columns={columns} size='small' />

    </Modal>
  );
};
export default OrderDetailModal;