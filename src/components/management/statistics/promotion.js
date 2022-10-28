import {
  PlusOutlined, EditOutlined, DeleteOutlined, HistoryOutlined
} from '@ant-design/icons';
import { Button, Form, Input, Select, message, Space, Popconfirm, Switch, Row, Col, Table, DatePicker } from 'antd';
import { Typography } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import api from '../../../api/apis'
import ChangeForm from '../templates/changeform';
import { useNavigate, useParams } from 'react-router-dom'
import Loading from '../../basic/loading';
import paths from '../../../utils/paths'
import messages from '../../../utils/messages'
import { validPhone, validName } from '../../../resources/regexp'

const { Option } = Select;
const { TextArea } = Input;
const idCity = 0;
const { RangePicker } = DatePicker;

const StatisticsPromotion = () => {

  const [data, setData] = useState([]);
  const [type, setType] = useState("Order");
  // const navigate = useNavigate();
  // const [form] = Form.useForm();
  // const [loadings, setLoadings] = useState([]);
  // const [loadingData, setLoadingData] = useState(true);
  // const [disableSubmit, setDisableSubmit] = useState(false);
  // const [idxBtnSave, setIdxBtnSave] = useState([]);
  // let { id } = useParams();
  // const [is_create, setCreate] = useState(null); // create
  // const refAutoFocus = useRef(null)


  // const enterLoading = (index) => {
  //   setLoadings((prevLoadings) => {
  //     const newLoadings = [...prevLoadings];
  //     newLoadings[index] = true;
  //     return newLoadings;
  //   });
  // };

  // const stopLoading = (index) => {
  //   setLoadings((prevLoadings) => {
  //     const newLoadings = [...prevLoadings];
  //     newLoadings[index] = false;
  //     return newLoadings;
  //   });
  // }

  // const onFinish = async (values) => {
  //   setDisableSubmit(true)
  //   enterLoading(idxBtnSave)
  //   // console.log(state);
  //   if (!validName.test(values.fullname)) {
  //     message.error('Tên không hợp lệ! Ký tự đầu mỗi từ phải viết hoa');
  //     setDisableSubmit(false)
  //     stopLoading(idxBtnSave)
  //     return;
  //   }
  //   if (!validPhone.test(values.phone)) {
  //     message.error('Số điện thoại không hợp lệ! Số điện thoại bao gồm 10 ký tự số bắt đầu là 84 hoặc 03, 05, 07, 08, 09');
  //     setDisableSubmit(false)
  //     stopLoading(idxBtnSave)
  //     return;
  //   }
  // //   if (is_create) {
  // //     await create(values)
  // //   } else {
  // //     await update(values)
  // //   }
  //   stopLoading(idxBtnSave)
  //   setDisableSubmit(false)
  // }

  // const onFinishFailed = (errorInfo) => {
  //   // console.log("props.create", props.create)
  //   console.log('Failed:', errorInfo)
  //   stopLoading(0)
  // };

  // const handleData = async () => {
  //   setLoadingData(true)
  //   try {
  //     const response = await api.staff.get(id);
  //     const values = response.data.data
  //     // console.log(values)
  //     form.setFieldsValue(values)
  //   } catch (error) {
  //     message.error(messages.ERROR)
  //   } finally {
  //     setLoadingData(false)
  //   }
  // }

  const onChange = (date, dateString) => {
    console.log(date, dateString);

  };

  const columns = [
    {
      title: 'Mã CTKM',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Tên CTKM',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'address',
      key: 'address',
    },

    {
      title: 'Mã SP tặng',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Tên SP tặng',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'SL tặng',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Đơn vị tính',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Số tiền chiết khấu',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Ngân sách tổng',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Ngân sách đã sử dụng',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Ngân sách còn lại',
      dataIndex: 'address',
      key: 'address',
    },

  ];

  const onThongKe = () => {

  }


  return (
    <div><Row style={{ marginBottom: '0px' }}><Col span={24}><h1 style={{ textAlign: 'center', fontSize: '25px', margin: '0px' }}>Thống kê tổng kết khuyến mãi</h1></Col></Row>
      <Row style={{ marginTop: '5px' }}>
        <Col span={24}>
          <label style={{ paddingRight: '10px' }}>Ngày thống kê:</label>
          <RangePicker onChange={onChange} />
          <label style={{ paddingLeft: '10px', paddingRight: '10px' }}>Loại khuyến mãi:</label>
          <Select
            showSearch
            style={{
              width: '200px',
              textAlign: 'left'
            }}
            defaultValue={type}
            optionFilterProp="children"
            onChange={(option) => { setType(option); console.log(option) }}
            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
          >
            <Option value="Order">Chiết khấu và giảm tiền</Option>
            <Option value="Product">Tặng sản phẩm</Option>
          </Select>
          <Button type="primary" style={{ marginLeft: '10px' }} onClick={() => onThongKe()}>Thống kê</Button>
          {/* <Button style={{ marginLeft: '10px' }} onClick={() => exportExcel()}> <DownloadOutlined /> Xuất báo cáo</Button> */}

        </Col>
      </Row>
      {/* <Row style={{ marginTop: '10px', marginBottom: '10px' }}><Col span={24}><h2 style={{ textAlign: 'center' }}>Đồ thị</h2></Col></Row> */}
      <Row style={{ marginTop: '5px', marginBottom: '10px' }}>
        <Col span={24}>
          <Table dataSource={data}
            columns={columns}
          >
          </Table>
        </Col>
        {/* <Col span={12}>
                  <Bar
                      height={100}
                      width={200}
                      data={{
                          labels: [
                              "Africa",
                              "Asia",
                              "Europe",
                              "Latin America",
                              "North America"
                          ],
                          datasets: [
                              {
                                  label: "Population (millions)",
                                  backgroundColor: [
                                      "#3e95cd",
                                      "#8e5ea2",
                                      "#3cba9f",
                                      "#e8c3b9",
                                      "#c45850"
                                  ],
                                  data: [2478, 5267, 734, 784, 433]
                              }
                          ]
                      }}
                      options={{
                          legend: { display: false },
                          title: {
                              display: true,
                              text: "Predicted world population (millions) in 2050"
                          }
                      }}
                  />
              </Col> */}
      </Row>
    </div >

  )

}

export default StatisticsPromotion;