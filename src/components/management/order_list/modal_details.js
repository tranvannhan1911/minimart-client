import { Drawer, Row, Col, Divider, Table, Typography, Space, Button, Popconfirm, Input, message } from 'antd';
import React, { useState, useEffect } from 'react';
import api from '../../../api/apis';
import messages from '../../../utils/messages';

const OrderDetailModal = (props) => {
  const [dataSourceIndex, setDataSourceindex] = useState("");
  const [reason, setReason] = useState("");

  const showDrawer = () => {
    props.setOpenDetails(true);
  };

  const onClose = () => {
    props.setOpenDetails(false);
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
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'address',
      render: (price, record) => (
        <Typography>{price?.toLocaleString()}</Typography>
      ),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'address',
    },
    {
      title: 'Thành tiền',
      dataIndex: 'total',
      key: 'address',
      render: (total, record) => (
        <Typography>{total?.toLocaleString()}</Typography>
      ),
    },
  ];

  const onOrderCancel = async () => {
    try {
      const values = {
        status: "cancel",
        note: reason
      }
      const response = await api.order.update(props.data.key, values);
      if (response.data.code == 1) {
        message.success("Hủy đơn hàng thành công!");
        props.handleGetData()
        onClose()
      } else {
        message.error(response.data.message.toString())
      }
    } catch (error) {
      message.error(messages.ERROR)
      console.log('Failed:', error)
    }
  }

  return (
    <Drawer width={640} placement="right"
      closable={false} onClose={onClose} visible={props.openDetails}>
      <p
        className="site-description-item-profile-p"
        style={{
          marginBottom: 24,
          fontSize: 25,
          fontWeight: 'bold'
        }}
      >
        Thông tin hóa đơn bán hàng
      </p>

      <p className="site-description-item-profile-p" style={{ fontSize: '20px', marginTop: '20px', fontWeight: 'bold' }}>Thông tin cơ bản</p>
      <Row>
        <Col span={12}>
          <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}>Mã hóa đơn: {props.data.key}</p>
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
      <Row>
        <Col span={12}>
          <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}>Khuyến mãi: {(props.data.total - props.data.final_total)?.toLocaleString()}</p>
          </div>
        </Col>
        <Col span={12}>
          <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label" style={{ fontSize: '15px' }}>Tổng tiền: {props.data.final_total?.toLocaleString()}</p>
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
      {props.wantCancel ?
        <Row>
          <Col span={24}>
            <div className="site-description-item-profile-wrapper">
              <p className="site-description-item-profile-p-label" style={{ fontSize: '15px', color: 'red' }}>Vui lòng xem lại hóa đơn, điền lý do và bấm nút hủy ở bên dưới</p>
            </div>
          </Col>
        </Row>
        : null
      }
      <Divider />

      <p className="site-description-item-profile-p" style={{ fontSize: '20px', marginTop: '20px', fontWeight: 'bold' }}>Danh sách sản phẩm mua</p>
      <Table dataSource={dataSourceIndex} columns={columns} size='small' />
      {props.wantCancel ?
        <div>
          <Divider />
          {/* <p className="site-description-item-profile-p" style={{ fontSize: '15px', marginTop: '20px', fontWeight: 'bold',color:'red', textAlign:'right' }}>Tổng tiền: {props.data.final_total?.toLocaleString()} đ</p> */}
          <div style={{
            display: 'flex'
          }}>

            <Input style={{
              flex: 1,
              marginRight: '10px'
            }} name='reason' placeholder='Lý do hủy đơn hàng'
              value={reason}
              onChange={(e) => {
                setReason(e.target.value)
              }} />
            <Popconfirm
              title="Hủy hóa đơn này?"
              onConfirm={() => onOrderCancel()}
              okText="Đồng ý"
              okType="danger"
              cancelText="Không"
            >
              <Button type="danger">
                Hủy đơn hàng
              </Button>
            </Popconfirm>
          </div>
        </div>
        : null
      }

    </Drawer>
  );
};
export default OrderDetailModal;