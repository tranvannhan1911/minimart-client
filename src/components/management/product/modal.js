import { Button, Drawer, Row, Col, Divider, Image } from 'antd';
import React, { useState, useEffect } from 'react';

const PriceModal = (props) => {
  const [disabled, setDisabled] = useState(false);
  const [baseUnit, setBaseUnit] = useState('');

  useEffect(() => {
    if (props.data.length != 0) {
      props.data.units.forEach(element => {
        if (element.is_base_unit == true) {
          setBaseUnit(element.unit_name);
        }
      });
    }
  });

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
          fontWeight: 'bold'
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
              src={props.data.image}
            />
          </div>
        </Col>
        {/* </Row> */}
        <Col span={12}>
          <p className="site-description-item-profile-p" style={{ fontSize: '20px', marginTop: '0px', fontWeight: 'bold' }}>Thông tin cơ bản</p>
          <Row>
            <Col span={24}>
              <div className="site-description-item-profile-wrapper">
                <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}><span style={{ fontWeight: 'bold' }}>Mã sản phẩm:</span> {props.data.product_code}</p>
              </div>
            </Col>
            <Col span={24}>
              <div className="site-description-item-profile-wrapper">
                <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}><span style={{ fontWeight: 'bold' }}>Tên sản phẩm:</span> {props.data.name}</p>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <div className="site-description-item-profile-wrapper">
                <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}><span style={{ fontWeight: 'bold' }}>BarCode:</span> {props.data.barcode}</p>
              </div>
            </Col>

            <Col span={24}>
              <div className="site-description-item-profile-wrapper">
                <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}><span style={{ fontWeight: 'bold' }}>Nhóm sản phẩm:</span> {props.data.product_groups}</p>
              </div>
            </Col>
            <Col span={24}>
              <div className="site-description-item-profile-wrapper">
                <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}><span style={{ fontWeight: 'bold' }}>Số lượng còn trong kho:</span> {props.data.stock} {baseUnit}</p>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      <Col span={24}>
        <div className="site-description-item-profile-wrapper">
          <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}><span style={{ fontWeight: 'bold' }}>Ngành hàng:</span> {props.data.product_category}</p>
        </div>
      </Col>
      <Row>
        <Col span={24}>
          <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}><span style={{ fontWeight: 'bold' }}>Mô tả sản phẩm:</span></p>
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
export default PriceModal;