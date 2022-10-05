import { Button, Modal, Row, Col, Divider, Image, Input, Table, Form, message } from 'antd';
import React, { useState, useEffect, useRef, useContext } from 'react';
const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `Vui lòng nhập số lượng.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} min='0' type='number' style={{width:'100px'}}/>
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const OrderModal = (props) => {
  const [disabled, setDisabled] = useState(false);
  const [total, setTotal] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [idOrder, setIdOrder] = useState(0);
  const [formRefund] = Form.useForm();

  useEffect(() => {
    if (props.data.length != 0) {
      if(props.open == true){
      // if (idOrder == 0 || idOrder != props.data.key) {
        setTotal(props.data.total);
        setIdOrder(props.data.key);
        setDataSource([]);
        props.data.details.forEach(element => {
          let dataIndex = {
            "key": element.key,
            "quantity": element.quantity,
            "note": element.note,
            "product": element.product,
            "unit_exchange": element.unit_exchange,
            "price": element.price,
            "total": element.total
          }
          setDataSource([...dataSource, dataIndex]);
        });
        
      }
    }
  },[props.open]);

  const onExit = () => {
    props.setOpen(false);
    setDataSource([]);
  };

  const onSave = () => {
    // props.setOpen(false);
    setDataSource([]);
  };

  const calculateTotal = (value) => {
    console.log(value)
  };

  const defaultColumns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'product',
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
    },
    {
      title: 'Đơn vị',
      dataIndex: 'unit_exchange',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      editable: true,
      // render: (quantity) => (
      //   <Input type='number' min='0' max={quantity} defaultValue={quantity} style={{ width: '100px' }} onChange={(e) => calculateTotal(e.target.value)}></Input>
      // )
    },
    {
      title: 'Thành tiền',
      dataIndex: 'total',
    },

  ];

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    if(newData[index].total < newData[index].quantity*newData[index].price){
      message.error('Lỗi! Số lượng sản phẩm trả lớn hơn số sản phẩm mua trong hóa đơn!!');
      return;
    }
    newData[index].total= newData[index].quantity*newData[index].price;
    setDataSource(newData);
    calculateTotalAmount(newData);
  };

  const calculateTotalAmount = (data) => {
    let tong = 0;
    data.forEach(element => {
      // if (element.note == "") {
        tong += Number(element.total);
      // } else {
      // }
    });
    setTotal(tong);
  }

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <Modal
      title="Tạo đơn trả hàng"
      centered
      visible={props.open}
      onOk={() => onSave()}
      onCancel={() => onExit()}
      width={900}
      heigh={500}
    >

<Form layout="vertical" hideRequiredMark form={formRefund}>
      <Row>
        <Col span={12}>
          <label>Ghi chú:</label>
          <Input></Input>
        </Col>

      </Row>
</Form>
      <Row style={{ marginTop: '20px' }}>
        <Col span={24}>
          <label>Thông tin hàng trả:</label>

        </Col>

      </Row>
      <Row style={{ marginTop: '20px' }}>
        <Col span={24}>
          <Table columns={columns} dataSource={dataSource} components={components}
            rowClassName={() => 'editable-row'}
            bordered>

          </Table>

        </Col>

      </Row>

      <Divider />
      <Row>
        <Col span={16}>

        </Col>
        <Col span={8}>
          <span>-----------------------------------</span>
        </Col>

      </Row>
      <Row style={{ marginTop: '20px' }}>
        <Col span={16}>

        </Col>
        <Col span={8}>
          <span style={{ fontWeight: 'bold', fontSize: '15px' }}>Tổng tiền trả khách: <span style={{color:'red'}}>{total}</span> VND</span>
        </Col>

      </Row>

    </Modal>

  );
};
export default OrderModal;