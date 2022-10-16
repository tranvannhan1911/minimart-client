import { Button, Modal, Result, Row, Col, Table } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

const SuccessModal = (props) => {
  const [open, setOpen] = useState(false);
  const [openFooter, setOpenFooter] = useState(true);
  const refBtnPrint = useRef()
  const [staffId, setStaffId] = useState(sessionStorage.getItem("idStaff"));
  const [staffName, setStaffName] = useState(sessionStorage.getItem("nameStaff"));
  const [detailsOrder, setDetailsOrder] = useState([]);
  const [dateBuy, setDateBuy] = useState([]);


  const showModal = () => {
    props.setOpen(true);
  };

  const handleOk = () => {
    setOpenFooter(false)
    setTimeout(() => {
      window.print()
    }, 1000);
    setTimeout(() => {
      props.onFinish();
      setOpen(true)
      props.setOpen(false);
    }, 2000);

  };

  const handleCancel = () => {
    props.onFinish();
    props.setOpen(false);
  };


  useEffect(() => {

    setTimeout(() => {
      if (refBtnPrint.current) {
        refBtnPrint.current.focus()
      }
    }, 200)

    if (props.order != "") {
      let details = [];

      let date = props.dateBuy.slice(0, 10);
      let time = props.dateBuy.slice(11, 19);
      setDateBuy(date + " " + time);

      props.order.forEach(element => {
        let index = {
          product: element.product.name,
          unit: element.unit_exchange.unit_name,
          price: element.price == null ? "0" : element.price.price,
          quantity: element.quantity,
          total: element.total
        }
        details.push(index);
      });
      setDetailsOrder(details);
      setOpenFooter(true)
      // handleCustomer(props.order.customer);
      // handleStaff(props.order.user_created);
      // if(props.order.customer != null){
      // setCustomer(props.order.customer.fullname)
      // setStaff(props.order.staff.fullname)
      // // window.print()
      // }

    }

  }, [props.open])

  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'product',
      key: 'product',
    },
    {
      title: 'Đơn vị tính',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Thành tiền',
      dataIndex: 'total',
      key: 'total',
    },
  ];

  return (
    <>
      {/* <Modal
        open={props.open}
        title="Tạo hóa đơn thành công"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        onPressEnter={() => {
          console.log("enter")
        }}
      >
        <Result
          status="success"
          title="Tạo đơn hàng thành công"
          extra={[
            <Button type="primary" key="print" onClick={handleOk} ref={refBtnPrint}>
              In hóa đơn
            </Button>,
            <Button key="exit" onClick={handleCancel}>Thoát</Button>,
          ]}
        />

      </Modal> */}

      <Modal
        open={props.open}
        title="Hóa đơn bán hàng"
        onOk={handleOk}
        onCancel={handleCancel}
        okText="In"
        footer={null}
        onPressEnter={() => {
          console.log("enter")
        }}
        width={900}
      >
        <Row>
          <Col style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold', marginTop: "-20px" }} span={24}>SIÊU THỊ MINI</Col>
        </Row>
        <Row>
          <Col style={{ textAlign: 'center', fontSize: '17px' }} span={24}>Địa chỉ: Gò Vấp - Tp.Hồ Chí Minh</Col>
        </Row>
        <Row>
          <Col style={{ textAlign: 'center', fontSize: '17px' }} span={24}>Điện thoại: 0987654321</Col>
        </Row>
        <Row>
          <Col style={{ textAlign: 'center', fontSize: '17px', fontWeight: 'bold', marginTop: '8px', marginBottom: '8px' }} span={24}>HÓA ĐƠN THANH TOÁN</Col>
        </Row>
        <Row style={{ marginLeft: '0px', marginTop: '8px' }} span={24}>
          <Col span={7}>Mã hóa đơn: {props.orderId}</Col>
          <Col span={17}>Ngày mua: {dateBuy}</Col>
        </Row>
        <Row style={{ marginLeft: '0px', marginTop: '8px' }} span={24}>
          <Col span={7}>Mã khách hàng: {props.customerId}</Col>
          <Col span={17}>Tên khách hàng: {props.customerName}</Col>
        </Row>
        <Row style={{ marginLeft: '0px', marginTop: '8px' }} span={24}>
          <Col span={7}>Mã nhân viên: {staffId}</Col>
          <Col span={17}>Tên nhân viên: {staffName}</Col>
        </Row>
        <Row>
          <Col style={{ marginLeft: '0px', marginTop: '8px' }} span={24}>
            <Table columns={columns} dataSource={detailsOrder} pagination={false} />
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right', fontSize: '13px', marginTop: '8px' }}>Số lượng sản phẩm: {props.order.length}</Col>
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right', fontSize: '13px', marginTop: '8px', fontWeight: 'bold' }}>Tổng tiền hàng: {props.totalProduct} vnđ</Col>
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right', fontSize: '13px', marginTop: '8px' }}>Giảm giá: {props.totalProduct - props.total} vnđ</Col>
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right', fontSize: '13px', marginTop: '8px', fontWeight: 'bold', color: 'red' }}>Tổng tiền thanh toán: {props.total} vnđ</Col>
        </Row>

        <Row>
          <Col style={{ textAlign: 'center', marginTop: '13px' }} span={24}>CẢM ƠN QUÝ KHÁCH ĐÃ MUA SẮM TẠI SIÊU THỊ MINI</Col>
        </Row>
        <Row>
          <Col style={{ textAlign: 'center' }} span={24}>Hẹn gặp lại quý khách lần sau</Col>
        </Row>
        <Row>
          <Button type="primary" key="print" onClick={handleOk} ref={refBtnPrint} style={{ display: openFooter == true ? 'block' : "none", position:"absolute", right:'20px' }}>
            In hóa đơn
          </Button>
          <Button key="exit" onClick={handleCancel} style={{ display: openFooter == true ? 'block' : "none", position:"absolute", right:'130px'}}>Thoát</Button>,
        </Row>
      </Modal>
    </>
  );
};

export default SuccessModal;