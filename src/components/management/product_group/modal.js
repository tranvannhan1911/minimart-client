import { Button, Drawer, Row, Col, Divider } from 'antd';
import React, { useState } from 'react';

const ProductGroupModal = (props) => {
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
          Thông tin nhóm sản phẩm
        </p>
        <p className="site-description-item-profile-p" style={{fontSize:'20px', marginTop:'20px', fontWeight:'bold'}}>Thông tin cơ bản</p>
        <Row>
          <Col span={12}>
            <div className="site-description-item-profile-wrapper">
              <p className="site-description-item-profile-p-label" style={{fontSize:'15px'}}>Mã nhóm sản phẩm: {props.data.id}</p>
            </div>
          </Col>
          <Col span={24}>
          <div className="site-description-item-profile-wrapper">
              <p className="site-description-item-profile-p-label" style={{fontSize:'15px'}}>Tên nhóm sản phẩm: {props.data.name}</p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
          <div className="site-description-item-profile-wrapper">
              <p className="site-description-item-profile-p-label" style={{fontSize:'15px'}}>Code nhóm sản phẩm: {props.data.product_group_code}</p>
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
        <Row>
          <Col span={24}>
          <div className="site-description-item-profile-wrapper">
              <p className="site-description-item-profile-p-label" style={{fontSize:'15px'}}>Mô tả: {props.data.description}</p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
          <div className="site-description-item-profile-wrapper">
              <p className="site-description-item-profile-p-label" style={{fontSize:'15px'}}>{props.data.description}</p>
            </div>
          </Col>
        </Row>

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
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}>Người cập nhật: {props.data.user_updated}</p>
          </div>
        </Col>
      </Row>
 
      </Drawer>
  );
};
export default ProductGroupModal;