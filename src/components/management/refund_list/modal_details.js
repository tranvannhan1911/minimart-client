import { Button, Drawer, Row, Col, Divider, Image, Table } from 'antd';
import React, { useState, useEffect } from 'react';

const OrderRefundDetailModal = (props) => {
  const [dataSourceIndex, setDataSourceindex] = useState("");

  const showDrawer = () => {
    props.setOpen(true);
  };

  const onClose = () => {
    props.setOpen(false);
  };

  useEffect(() => {
    // detail = props.data.details;
    // if (props.data.details != null) {
    //   detail.map(element => {
    //     element.product = element.product.name;
    //     return element;
    //   });
      setDataSourceindex(props.data.details)
    // }
    // console.log(props.data.details, 1111);

  });

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
    // {
    //   title: 'Giá',
    //   dataIndex: 'price',
    //   key: 'address',
    // },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'address',
    },
    // {
    //   title: 'Thành tiền',
    //   dataIndex: 'total',
    //   key: 'address',
    // },
  ];

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
        Thông tin đơn trả hàng
      </p>

      <p className="site-description-item-profile-p" style={{ fontSize: '20px', marginTop: '20px', fontWeight: 'bold' }}>Thông tin cơ bản</p>
      <Row>
        <Col span={12}>
          <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}>Mã đơn trả hàng: {props.data.key}</p>
          </div>
        </Col>
        <Col span={12}>
          <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}>Ngày tạo: {props.data.date_created}</p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}>Nhân viên bán hàng: {props.data.user_created}</p>
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
      {/* <Row>
      <Col span={12}>
          <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}>Khuyến mãi: {props.data.total}</p>
          </div>
        </Col>
        <Col span={12}>
          <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}>Tổng tiền: {props.data.total}</p>
          </div>
        </Col>
      </Row> */}

      <Row>
        <Col span={24}>
          <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}>Ghi chú: {props.data.note}</p>
          </div>
        </Col>
      </Row>
      <Divider />

      <p className="site-description-item-profile-p" style={{ fontSize: '20px', marginTop: '20px', fontWeight: 'bold' }}>Danh sách sản phẩm trả</p>
      <Table dataSource={dataSourceIndex} columns={columns} />

      {/* <Divider />
      <p className="site-description-item-profile-p" style={{ fontSize: '15px', marginTop: '20px', fontWeight: 'bold',color:'red', textAlign:'right' }}>Tổng tiền: {props.data.total} đ</p> */}
      
    </Drawer>
  );
};
export default OrderRefundDetailModal;