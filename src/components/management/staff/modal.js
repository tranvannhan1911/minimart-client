import { Drawer, Row, Col, Divider, message } from 'antd';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import api from '../../../api/apis';
import messages from '../../../utils/messages';

const StaffModal = (props) => {
  const [ward, setWard] = useState()
  const showDrawer = () => {
    props.setOpen(true);
  };

  const onClose = () => {
    props.setOpen(false);
  };

  const handleWardData = async () => {
    try {
      const response = await api.address.ward(props.data.ward);
      setWard(response.data.data.ward)
    } catch (error) {
      message.error(messages.ERROR)
    }
  }

  useEffect(() => {
    if(props.data && props.data.ward){
      handleWardData()
    }
  }, [props.data])

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
          Thông tin nhân viên
        </p>
        <Divider />      
        <p className="site-description-item-profile-p" style={{fontSize:'20px', marginTop:'20px', fontWeight:'bold'}}>Thông tin cơ bản</p>
        <Row>
          <Col span={12}>
            <div className="site-description-item-profile-wrapper">
              <p className="site-description-item-profile-p-label" style={{fontSize:'15px'}}>Mã nhân viên: {props.data.id}</p>
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
          <Col span={12}>
          <div className="site-description-item-profile-wrapper">
              <p className="site-description-item-profile-p-label" style={{fontSize:'15px'}}>Số nhà, đường: {props.data.address}</p>
            </div>
          </Col>
          <Col span={12}>
          <div className="site-description-item-profile-wrapper">
              <p className="site-description-item-profile-p-label" style={{fontSize:'15px'}}>Địa chỉ: {ward?.path_with_type}</p>
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
        <p className="site-description-item-profile-p" style={{fontSize:'20px', fontWeight:'bold'}}>Tài khoản</p>
        <Row>
          <Col span={12}>
          <div className="site-description-item-profile-wrapper">
              <p className="site-description-item-profile-p-label" style={{fontSize:'15px'}}>Trạng thái: {props.data.is_active ? 'Hoạt động':'Khóa'}</p>
            </div>
          </Col>
          <Col span={12}>
          <div className="site-description-item-profile-wrapper">
              <p className="site-description-item-profile-p-label" style={{fontSize:'15px'}}>Vị trí: {props.data.is_manager}</p>
            </div>
          </Col>
        </Row>
        <Divider />
        <p className="site-description-item-profile-p" style={{fontSize:'20px', fontWeight:'bold'}}>Lịch sử truy cập</p>
        <Row>
          <Col span={24}>
          <div className="site-description-item-profile-wrapper">
              <p className="site-description-item-profile-p-label" style={{fontSize:'15px'}}>Ngày tạo: {props.data.date_joined}</p>
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
export default StaffModal;