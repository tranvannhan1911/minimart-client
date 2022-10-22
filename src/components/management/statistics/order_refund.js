import {
    PlusOutlined, EditOutlined, DeleteOutlined, HistoryOutlined
} from '@ant-design/icons';
import { Button, Form, Input, Select, message, Space, Popconfirm, Switch, Row, Col, DatePicker, Table } from 'antd';
import { Typography } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import api from '../../../api/apis'
import ChangeForm from '../templates/changeform';
import { useNavigate, useParams } from 'react-router-dom'
import Loading from '../../basic/loading';
import paths from '../../../utils/paths'
import messages from '../../../utils/messages'
import { validPhone, validName } from '../../../resources/regexp'
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';


const { Option } = Select;
const { TextArea } = Input;
const idCity = 0;
const { RangePicker } = DatePicker;


const StatisticsOrderRefund = () => {

    const [loadings, setLoadings] = useState([]);
    const [data, setData] = useState([]);
    

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

    const onChange = (date, dateString) => {
        console.log(date, dateString);

    };

    const columns = [
        {
          title: 'Ngày',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Số lượng hóa đơn bán',
          dataIndex: 'age',
          key: 'age',
        },
        {
          title: 'Số lượng hóa đơn trả',
          dataIndex: 'address',
          key: 'address',
        },
        {
            title: 'Số lượng hóa đơn hủy',
            dataIndex: 'address',
            key: 'address',
          },
          {
            title: 'Số lượng khuyến mãi dùng',
            dataIndex: 'address',
            key: 'address',
          },
          {
            title: 'Tổng tiền khuyến mãi',
            dataIndex: 'address',
            key: 'address',
          },
          {
            title: 'Tổng tiền bán hàng',
            dataIndex: 'address',
            key: 'address',
          },
      ];

    return (
        <div>
            <Row style={{ marginBottom: '10px' }}><Col span={24}><h1 style={{ textAlign: 'center', fontSize: '25px' }}>Thống kê bán hàng trả hàng</h1></Col></Row>
            <Row>
                <Col span={8} style={{ display: 'flex' }}>
                    <label style={{ marginRight: '10px' }}>Theo ngày:</label>
                    <RangePicker onChange={onChange} />
                </Col>
                {/* <Col span={8}>
                <label style={{ marginRight: '10px' }}>Theo tuần:</label>
                    <DatePicker onChange={onChange} picker="week" />
                </Col>
                <Col span={8}>
                <label style={{ marginRight: '10px' }}>Theo tháng:</label>
                    <DatePicker onChange={onChange} picker="month" />
                </Col> */}

            </Row>

            {/* <Row style={{ marginTop: '20px' }}>
                <Col span={8} style={{ display: 'flex' }}>
                <label style={{ marginRight: '10px' }}>Theo quý:</label>
                    <DatePicker onChange={onChange} picker="quarter" />
                </Col>
                <Col span={8}>
                <label style={{ marginRight: '10px' }}>Theo năm:</label>
                    <DatePicker onChange={onChange} picker="year" />
                </Col>
                <Col span={8}>
                    
                </Col>
            </Row> */}
            {/* <Row style={{ marginTop: '10px', marginBottom: '10px' }}><Col span={24}><h2 style={{ textAlign: 'center' }}>Đồ thị</h2></Col></Row> */}
            <Row style={{ marginTop: '20px', marginBottom: '10px' }}>
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

export default StatisticsOrderRefund;