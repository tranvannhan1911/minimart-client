import { Button, Modal, Row, Col, Divider, Image, Input, Table, Form, message } from 'antd';
import React, { useState, useEffect, useRef, useContext } from 'react';
import messages from '../../../utils/messages'
import api from '../../../api/apis'

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
        <Input ref={inputRef} onPressEnter={save} onBlur={save} min='0' type='number' style={{ width: '100px' }} />
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

const OrderRefundModal = (props) => {
  const [disabled, setDisabled] = useState(false);
  const [total, setTotal] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [idOrder, setIdOrder] = useState(0);
  const [formRefund] = Form.useForm();

  useEffect(() => {
    if (props.data.length != 0) {
      if (props.open == true) {
        // if (idOrder == 0 || idOrder != props.data.key) {
        setTotal(props.data.total);
        setIdOrder(props.data.key);
        setDataSource([]);
        console.log(props.data.details)
        let datainput = [];
        props.data.details.forEach(element => {
          let dataIndex = {
            "key": element.id,
            "quantity": element.quantity,
            "quantityBuy": element.quantity,
            "note": element.note,
            "product": element.product,
            "unit_exchange": element.unit_exchange,
            "price": element.price,
            "total": 0,
            "idProduct": element.idProduct,
            "idUnit": element.idUnit,
          }
          datainput.push(dataIndex)

        });
        setDataSource(datainput);
      }
    }
  }, [props.open]);

  const onExit = () => {
    props.setOpen(false);
    setDataSource([]);
  };

  const onSave = async () => {
    let detailss = [];
    dataSource.forEach(element => {
      let index = {
        "quantity": element.quantity,
        "note": element.note,
        "product": element.idProduct,
        "unit_exchange": element.idUnit
      }
      detailss.push(index);
    });
    let values = {
      "details": detailss,
      "note": formRefund.getFieldValue("note"),
      "status": "complete",
      "order": props.idOrder
    }
    if(total == null || total == 0){
      message.error("Không có sản phẩm trả")
      return;
    }
    try {
      const response = await api.order_refund.add(values);
      if (response.data.code == 1) {
        message.success(messages.order_refund.SUCCESS_SAVE())
        props.setOpen(false);
        console.log(dataSource);
        setDataSource([]);
        props.handleGetData()
        return true
      } else if (response.data.code == 0) {
        message.error("Lỗi")
      } else {
        message.error(response.data.message.toString())
      }
    } catch (error) {
      message.error(messages.ERROR)
      console.log('Failed:', error)
    }
    return false

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
      title: 'Số lượng mua',
      dataIndex: 'quantityBuy',
    },
    {
      title: 'Số lượng trả',
      dataIndex: 'quantity',
      editable: true,
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
    if (props.data.details[index].total < newData[index].quantity * newData[index].price) {
      message.error('Lỗi! Số lượng sản phẩm trả lớn hơn số sản phẩm mua trong hóa đơn!!');
      return;
    }
    newData[index].total = newData[index].quantity * newData[index].price;
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
          <Col span={24}>
            <Form.Item name='note' label='Ghi chú:'>
              <Input></Input>
            </Form.Item>
          </Col>

        </Row>
      </Form>
      <Row style={{ marginTop: '20px' }}>
        <Col span={24}>
          <label>Thông tin hàng trả:</label>
          <label style={{
            float: 'right'
          }}>*Bấm vào số lượng trả để sửa đổi.</label>
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
          <span style={{ fontWeight: 'bold', fontSize: '15px' }}>Tổng tiền trả khách: <span style={{ color: 'red' }}>{total}</span> VND</span>
        </Col>

      </Row>

    </Modal>

  );
};
export default OrderRefundModal;