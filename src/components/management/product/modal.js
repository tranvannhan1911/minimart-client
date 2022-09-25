import { Button, Drawer, Row, Col, Divider, Image } from 'antd';
import React, { useState } from 'react';

const PriceModal = (props) => {
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
        Thông tin sản phẩm
      </p>
      <Row>
        <Col span={12}>
          <div className="site-description-item-profile-wrapper">
            <Image
              width={200}
              height={200}
              src="https://satrafoods.com.vn/uploads/san-pham-cung-loai/8934588012228.jpg"
            />
          </div>
        </Col>
      {/* </Row> */}
      <Col span={12}>
      <p className="site-description-item-profile-p" style={{ fontSize: '20px', marginTop: '0px', fontWeight:'bold' }}>Thông tin cơ bản</p>
      <Row>
        <Col span={24}>
          <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}><span style={{fontWeight:'bold'}}>Mã sản phẩm:</span> {props.data.product_code}</p>
          </div>
        </Col>
        <Col span={24}>
          <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}><span style={{fontWeight:'bold'}}>Tên sản phẩm:</span> {props.data.name}</p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}><span style={{fontWeight:'bold'}}>BarCode:</span> {props.data.barcode}</p>
          </div>
        </Col>
        <Col span={24}>
          <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}><span style={{fontWeight:'bold'}}>Nhóm sản phẩm:</span> {props.data.product_groups}</p>
          </div>
        </Col>
      </Row>
      </Col>
      </Row>
      <Row>
        <Col span={24}>
          <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}><span style={{fontWeight:'bold'}}>Mô tả sản phẩm:</span></p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}>{props.data.description}</p>
          </div>
        </Col>
      </Row>
      <Divider />
      
    </Drawer>
    
  );
};
export default PriceModal;