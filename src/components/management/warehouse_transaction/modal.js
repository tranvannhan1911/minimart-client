import { Button, Drawer, Row, Col, Divider } from 'antd';
import React, { useState } from 'react';

const WarehouseTransactionModal = (props) => {

  const showDrawer = () => {
    props.setOpen(true);
  };

  const onClose = () => {
    props.setOpen(false);
  };

  return (
    <Drawer width={640} placement="right" closable={false} onClose={onClose} visible={props.open}>
        <p
          className="site-description-item-profile-p"
          style={{
            marginBottom: 24,
            fontSize: 25
          }}
        >
          Thông tin bảng biến động kho
        </p>
        <p className="site-description-item-profile-p" style={{fontSize:'20px', marginTop:'20px'}}>Thông tin cơ bản</p>
        <Row>
          <Col span={12}>
            <div className="site-description-item-profile-wrapper">
              <p className="site-description-item-profile-p-label" style={{fontSize:'15px'}}>Mã bảng biến động: {props.data.id}</p>
            </div>
          </Col>
          <Col span={12}>
          <div className="site-description-item-profile-wrapper">
              <p className="site-description-item-profile-p-label" style={{fontSize:'15px'}}>Họ tên: {props.data.fullname}</p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
          <div className="site-description-item-profile-wrapper">
              <p className="site-description-item-profile-p-label" style={{fontSize:'15px'}}>Giới tính: {props.data.gender}</p>
            </div>
          </Col>
          <Col span={12}>
          <div className="site-description-item-profile-wrapper">
              <p className="site-description-item-profile-p-label" style={{fontSize:'15px'}}>Số điện thoại: {props.data.phone}</p>
            </div>
          </Col>
        </Row>
        
        <Row>
          <Col span={24}>
          <div className="site-description-item-profile-wrapper">
              <p className="site-description-item-profile-p-label" style={{fontSize:'15px'}}>Ghi chú: {props.data.note}</p>
            </div>
          </Col>
        </Row>
        <Divider />
        <p className="site-description-item-profile-p" style={{fontSize:'20px'}}>Tài khoản</p>
        <Row>
          <Col span={12}>
          <div className="site-description-item-profile-wrapper">
              <p className="site-description-item-profile-p-label" style={{fontSize:'15px'}}>Trạng thái: {props.data.is_active ? 'Hoạt động':'Khóa'}</p>
            </div>
          </Col>
          <Col span={12}>
          <div className="site-description-item-profile-wrapper">
              <p className="site-description-item-profile-p-label" style={{fontSize:'15px'}}>Vị trí: {props.data.is_superuser}</p>
            </div>
          </Col>
        </Row>
        <Divider />
        <p className="site-description-item-profile-p" style={{fontSize:'20px'}}>Lịch sử truy cập</p>
        <Row>
          <Col span={24}>
          <div className="site-description-item-profile-wrapper">
              <p className="site-description-item-profile-p-label" style={{fontSize:'15px'}}>Ngày tạo: {props.data.date_joined}</p>
            </div>
          </Col>
        </Row>
        <Divider />
      </Drawer>
  );
};
export default WarehouseTransactionModal;