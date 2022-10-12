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
              <p className="site-description-item-profile-p-label" style={{fontSize:'15px'}}>Sản phẩm: {props.data.product}</p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
          <div className="site-description-item-profile-wrapper">
              <p className="site-description-item-profile-p-label" style={{fontSize:'15px'}}>Số lượng thay đổi: {props.data.change}</p>
            </div>
          </Col>
          <Col span={12}>
          <div className="site-description-item-profile-wrapper">
              <p className="site-description-item-profile-p-label" style={{fontSize:'15px'}}>Loại biến động: {props.data.type}</p>
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
        <p className="site-description-item-profile-p" style={{fontSize:'20px'}}>Lịch sử thay đổi</p>
        <Row>
          <Col span={24}>
          <div className="site-description-item-profile-wrapper">
              <p className="site-description-item-profile-p-label" style={{fontSize:'15px'}}>Ngày biến động: {props.data.date_created}</p>
            </div>
          </Col>
        </Row>
        <Divider />
      </Drawer>
  );
};
export default WarehouseTransactionModal;