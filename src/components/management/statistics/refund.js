import {
  PlusOutlined, EditOutlined, DeleteOutlined, HistoryOutlined
} from '@ant-design/icons';
import { Button, Form, Input, Select, message, Space, Popconfirm, Switch, Row, Col, Table, DatePicker, } from 'antd';
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

const StatisticsRefund = () => {
  const [loadings, setLoadings] = useState([]);
  const [data, setData] = useState([]);
  const [date, setDate] = useState([]);

  useEffect(() => {
    document.title = "Thống kê trả hàng - Quản lý siêu thị mini NT"
  }, [])


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

  const onChange = (dates, dateStrings) => {
    if (dates) {
        console.log('From: ', dates[0], ', to: ', dates[1]);
        console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
        setDate([dateStrings[0] + "T05:10:10.357Z", dateStrings[1] + "T23:10:10.357Z"])
    } else {
        console.log('Clear');
        setDate([]);
    }
};

  const columns = [
    {
      title: 'STT',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Hóa Đơn Mua',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Ngày đơn hàng mua',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Hóa Đơn Trả',
      dataIndex: 'address',
      key: 'address',
    },

    {
      title: 'Ngày đơn hàng trả',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Nhóm Sản Phẩm',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Ngành Hàng',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Mã sản phẩm',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Tên Sản Phẩm',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Số lượng thùng',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Số lượng lẻ',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Tổng số lượng',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Doanh Thu',
      dataIndex: 'address',
      key: 'address',
    },
  ];

  const onThongKe = async () => {
    if (date.length == 0) {
      message.error("Vui lòng chọn ngày cần thống kê");
      return;
    }
    const params = {
      params: {
        start_date: date[0],
        end_date: date[1],
        // product_id: 1
      }
    }
    const response = await api.statistics_refund.refund(params);
    setData(response.data.data.results);
    console.log(data)
  }

  return (
    <div>
      <Row style={{ marginBottom: '0px' }}><Col span={24}><h1 style={{ textAlign: 'center', fontSize: '25px', margin: '0px' }}>Thống kê trả hàng</h1></Col></Row>
      <Row style={{ marginTop: '5px' }}>
        <Col span={24}>
          <label style={{ paddingRight: '10px' }}>Ngày thống kê:</label>
          <RangePicker onChange={onChange} />
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
    </div>

  )

}

export default StatisticsRefund;