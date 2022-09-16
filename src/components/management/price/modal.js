import { Button, Modal, message, Table } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import api from '../../../api/apis'

const PriceModal = (props) => {
  const [disabled, setDisabled] = useState(false);
  const [data, setData] = useState([]);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  const draggleRef = useRef(null);

  // console.log(props,1122);
  
  const showModal = () => {
    props.setOpen(true);
    // console.log("setOpen", true);
  };

  const handleOk = (e) => {
    // console.log(e);
    props.setOpen(false);
  };

  const handleCancel = (e) => {
    // console.log(e);
    props.setOpen(false);
  };

  const columns = [
    {
      title: 'Mã sản phẩm',
      dataIndex: "product",
      key: 'product',
      
    },
    {
      title: 'Đơn vị tính',
      dataIndex: 'unit_exchange',
      key: 'unit_exchange',
      
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
    },
    
    
  ];

  // useEffect( async () => {
  //   props.data.pricedetails.forEach(async element => {
  //     try {
  //       const response = await api.product.get(element.product);
  //       const valuesProduct = response.data.data
  //       element.product=valuesProduct.name;
  //     } catch (error) {
  //       message.error("Lỗi")
  //     } finally {
        
  //     }
  //     try {
  //       const response = await api.unit.get(element.unit_exchange);
  //       const valuesUnit = response.data.data
  //       element.unit_exchange=valuesUnit.name;
  //     } catch (error) {
  //       message.error("Lỗi")
  //     } finally {
        
  //     }
  //   });
  //     }, [props.open])

  const onStart = (_event, uiData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();

    if (!targetRect) {
      return;
    }

    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };

  return (
    <>
      <Modal
      width={'900px'}
        title={
          <div
            style={{
              width: '100%',
              cursor: 'move',
            }}
            onMouseOver={() => {
              if (disabled) {
                setDisabled(false);
              }
            }}
            onMouseOut={() => {
              setDisabled(true);
            }} // fix eslintjsx-a11y/mouse-events-have-key-events
            // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/mouse-events-have-key-events.md
            onFocus={() => {}}
            onBlur={() => {}} // end
          >
            <p style={{fontSize:'20px'}}>Chi tiết bảng giá</p>
          </div>
        }
        visible={props.open}
        onOk={handleOk}
        onCancel={handleCancel}
        modalRender={(modal) => (
          <Draggable
            disabled={disabled}
            bounds={bounds}
            onStart={(event, uiData) => onStart(event, uiData)}
          >
            <div ref={draggleRef}>{modal}</div>
          </Draggable>
        )}
      >
        <p style={{fontSize:'15px'}}>Tên bảng giá: {props.data.name}</p>
        <p style={{fontSize:'15px'}}>Ngày bắt đầu: {props.data.start_date}</p>
        <p style={{fontSize:'15px'}}>Ngày kết thúc: {props.data.end_date}</p>
        
        {/* <Table columns={columns} dataSource={data} /> */}
        <br />
      </Modal>
    </>
  );
};

export default PriceModal;