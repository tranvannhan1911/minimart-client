import { Button, Drawer, Row, Col, Divider } from 'antd';
import React, { useState } from 'react';

const SupplierModal = (props) => {
  const [disabled, setDisabled] = useState(false);

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
            fontSize: 25,
            fontWeight:'bold'
          }}
        >
          Thông tin nhà cung cấp
        </p>
        <Divider />      
        <p className="site-description-item-profile-p" style={{fontSize:'20px', marginTop:'20px', fontWeight:'bold'}}>Thông tin cơ bản</p>
        <Row>
          <Col span={12}>
            <div className="site-description-item-profile-wrapper">
              <p className="site-description-item-profile-p-label" style={{fontSize:'15px'}}>Mã nhà cung cấp: {props.data.id}</p>
            </div>
          </Col>
          <Col span={12}>
          <div className="site-description-item-profile-wrapper">
              <p className="site-description-item-profile-p-label" style={{fontSize:'15px'}}>Tên nhà cung cấp: {props.data.name}</p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
          <div className="site-description-item-profile-wrapper">
              <p className="site-description-item-profile-p-label" style={{fontSize:'15px'}}>Số điện thoại: {props.data.phone}</p>
            </div>
          </Col>
          <Col span={12}>
          <div className="site-description-item-profile-wrapper">
              <p className="site-description-item-profile-p-label" style={{fontSize:'15px'}}>Email: {props.data.email}</p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
          <div className="site-description-item-profile-wrapper">
              <p className="site-description-item-profile-p-label" style={{fontSize:'15px'}}>Địa chỉ: {props.data.address}</p>
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
      </Drawer>
  );
};
export default SupplierModal;