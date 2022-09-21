import { Button, Drawer, Row, Col, Divider, Image, Table } from 'antd';
import React, { useState,useEffect } from 'react';

const PriceModal = (props) => {
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
    setDataSource(props.data.pricedetails)
    console.log(dataSource,1111)
    // setData(props.data.pricedetails)
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
      title: 'Đơn vị tính',
      dataIndex: 'unit_exchange',
      key: 'age',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
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
        Thông tin bảng giá
      </p>
      
      <p className="site-description-item-profile-p" style={{ fontSize: '20px', marginTop: '20px', fontWeight:'bold' }}>Thông tin cơ bản</p>
      <Row>
        <Col span={24}>
          <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}>Mã bảng giá: {props.data.price_list_id}</p>
          </div>
        </Col>
        <Col span={24}>
          <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}>Tên bảng giá: {props.data.name}</p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}>Ngày bắt đầu: {props.data.start_date}</p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}>Ngày kết thúc: {props.data.end_date}</p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}>Trạng thái: {props.data.status ? "Hoạt động" : "Khóa"}</p>
          </div>
        </Col>
      </Row>
      <Divider />
      <p className="site-description-item-profile-p" style={{ fontSize: '20px', marginTop: '20px', fontWeight:'bold' }}>Danh sách giá sản phẩm</p>
      <Table dataSource={dataSource} columns={columns}/>
    </Drawer>
  );
};
export default PriceModal;