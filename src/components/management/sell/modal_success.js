import { Button, Modal, Result } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

const SuccessModal = (props) => {
  const [loading, setLoading] = useState(false);
  const refBtnPrint = useRef()

  const showModal = () => {
    props.setOpen(true);
  };

  const handlePrint = () => {
    // print here
  }

  const handleOk = () => {
    handlePrint();
    props.onFinish();
    props.setOpen(false);
  };

  const handleCancel = () => {
    props.onFinish();
    props.setOpen(false);
  };


  useEffect(() => {
    setTimeout(() => {
        if(refBtnPrint.current){
            refBtnPrint.current.focus()
        }
    }, 200)
    
  }, [props.open])

  return (
    <>
      <Modal
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
      </Modal>
    </>
  );
};

export default SuccessModal;