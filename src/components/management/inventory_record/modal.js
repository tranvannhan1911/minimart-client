import { Button, Drawer, Row, Col, Divider, Image, Table } from 'antd';
import React, { useState,useEffect } from 'react';

const InventoryRecordModal = (props) => {
  const [data, setData] = useState("");
  const [dataSource, setDataSource] = useState('');

  // const handleData = async () => {
  //   setLoadingData(true)
  //   try {
  //     const response = await api..get(id);
  //     const values = response.data.data
  //     values.supplier=values.supplier.name
  //     values.details = values.details.map(elm =>{
  //     elm.product=elm.product.id
  //     elm.unit_exchange=elm.unit_exchange.unit_name
  //     return elm;
    
  //   })      
      
  //     form.setFieldsValue(values)

  //   } catch (error) {
  //     message.error(messages.ERROR)
  //   } finally {
  //     setLoadingData(false)
  //   }
  // }

  useEffect(() => {
    setDataSource(props.data.details)
    // console.log(dataSource)
    setData(props.data)
    // if(data.status == true){
    //   data.status = "Hoạt động"
    // }
    // // data.status
    // console.log(data)

    // setData(props.data);
    // if(props.data.status==true){
    //   props.data.status='Hoạt động';
    // }else{
    //   props.data.status='Khóa';
    // }
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
    },
    {
      title: 'Số lượng sau',
      dataIndex: 'quantity_after',
      key: 'age',
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
          fontWeight:'bold'
        }}
      >
        Thông tin phiếu kiểm kê
      </p>
      <Divider />
      <p className="site-description-item-profile-p" style={{ fontSize: '20px', marginTop: '20px', fontWeight:'bold' }}>Thông tin cơ bản</p>
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
      <p className="site-description-item-profile-p" style={{ fontSize: '20px', marginTop: '20px' }}>Danh sách sản phẩm</p>
      <Table dataSource={dataSource} columns={columns}/>

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
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}>Người cập nhật: {props.data.updated}</p>
          </div>
        </Col>
      </Row>
    </Drawer>
  );
};
export default InventoryRecordModal;