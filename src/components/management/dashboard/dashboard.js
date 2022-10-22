import {
    UserOutlined,
    ShoppingCartOutlined,
    DollarCircleOutlined,
} from '@ant-design/icons';
import React, { useEffect } from 'react'
import { Space, Table, Tag, Row, Col, Card } from 'antd';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const topCustomers = {
    head: [
        {
            title: 'Họ tên',
            dataIndex: 'username',
            key: 'name',
        },
        {
            title: 'Số hóa đơn',
            dataIndex: 'order',
            key: 'age',
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'price',
            key: 'address',
        },
    ],
    body: [
        {
            "username": "john doe",
            "order": "490",
            "price": "15,870"
        },
        {
            "username": "frank iva",
            "order": "250",
            "price": "12,251"
        },
        {
            "username": "anthony baker",
            "order": "120",
            "price": "10,840"
        },
        {
            "username": "frank iva",
            "order": "110",
            "price": "9,251"
        },
        {
            "username": "anthony baker",
            "order": "80",
            "price": "8,840"
        }
    ]
}

const latestOrders = {
    header: [
        {
            title: 'Mã hóa đơn',
            dataIndex: 'id',
            key: 'name',
        },
        {
            title: 'Khách hàng',
            dataIndex: 'user',
            key: 'name',
        },
        {
            title: 'Ngày mua',
            dataIndex: 'date',
            key: 'name',
        },

        {
            title: 'Tổng tiền',
            dataIndex: 'price',
            key: 'address',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'age',
        },
    ],
    body: [
        {
            id: "#OD1711",
            user: "john doe",
            date: "17 Jun 2021",
            price: "900000",
            status: ""
        },
        {
            id: "#OD1712",
            user: "frank iva",
            date: "1 Jun 2021",
            price: "400000",
            status: ""
        },
        {
            id: "#OD1713",
            user: "anthony baker",
            date: "27 Jun 2021",
            price: "200000",
            status: ""
        },
        {
            id: "#OD1712",
            user: "frank iva",
            date: "1 Jun 2021",
            price: "40000",
            status: ""
        },
        {
            id: "#OD1713",
            user: "anthony baker",
            date: "27 Jun 2021",
            price: "$200",
            status: "refund"
        }
    ]
}

const Dashboard = () => {

    return (
        <div>
            <Row><h2 className="page-header">Dashboard</h2></Row>
            <Row>
                <Col span={13}>
                    <Row style={{ paddingTop: '10px' }}>
                        <Col span={11}>
                            <Card style={{backgroundColor:"#95c2ec", borderRadius: "20px"}}>
                                <Row>
                                    <Col span={10}>
                                        <ShoppingCartOutlined style={{ fontSize: '50px' }} />
                                    </Col>
                                    <Col span={14}>
                                        <div style={{fontWeight:"bold", fontSize:'20px'}}>12,000,000</div>
                                        <div>Tổng tiền</div>
                                    </Col>
                                    
                                </Row>
                            </Card>
                        </Col>
                        <Col span={2}></Col>
                        <Col span={11}>
                            <Card style={{backgroundColor:"#95c2ec", borderRadius: "20px"}}>
                                <Row>
                                    <Col span={10}>
                                    <UserOutlined style={{ fontSize: '50px' }} />
                                    </Col>
                                    <Col span={14}>
                                        <div style={{fontWeight:"bold", fontSize:'20px'}}>1200</div>
                                        <div>Tổng khách hàng</div>
                                    </Col>
                                    
                                </Row>
                            </Card>
                        </Col>

                    </Row>
                    <Row style={{ paddingTop: '30px' }}>
                        <Col span={11}>
                            <Card style={{backgroundColor:"#95c2ec", borderRadius: "20px"}}>
                                <Row>
                                    <Col span={10}>
                                    <DollarCircleOutlined style={{ fontSize: '50px' }} />
                                    </Col>
                                    <Col span={14}>
                                        <div style={{fontWeight:"bold", fontSize:'20px'}}>1200</div>
                                        <div style={{ fontSize:'15px'}}>Tổng hóa đơn</div>
                                    </Col>
                                    
                                </Row>
                            </Card>
                        </Col>
                        <Col span={2}></Col>
                        <Col span={11}>
                            <Card style={{backgroundColor:"#95c2ec", borderRadius: "20px"}}>
                                <Row>
                                    <Col span={10}>
                                        <ShoppingCartOutlined style={{ fontSize: '50px' }} />
                                    </Col>
                                    <Col span={14}>
                                        <div style={{fontWeight:"bold", fontSize:'20px'}}>0</div>
                                        <div>Tổng hóa đơn trả</div>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>

                    </Row>
                </Col>
                <Col span={1}></Col>
                <Col span={10}>
                    <Card style={{borderRadius: "20px"}}>
                        <div className="card__header">
                            <h3>Đồ thị</h3>
                        </div>
                        {/* chart */}
                        <Bar
                            height={70}
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
                    </Card>
                </Col>
            </Row>
            <Row style={{ marginTop: "20px" }}>
                <Col span={9}>
                    <Card style={{borderRadius: "20px"}}>
                        <div className="card__header">
                            <h3>Top 5 khách hàng thân thiết</h3>
                        </div>
                        <div className="card__body">
                            <Table
                                columns={topCustomers.head}
                                dataSource={topCustomers.body}
                                pagination={false}
                                size="small"
                            />
                        </div>
                    </Card>
                </Col>
                <Col span={1}></Col>

                <Col span={14}>
                    <Card style={{borderRadius: "20px"}}>
                        <div className="card__header">
                            <h3>Top 5 hóa đơn bán hàng</h3>
                        </div>
                        <div className="card__body">
                            <Table
                                columns={latestOrders.header}
                                dataSource={latestOrders.body}
                                pagination={false}
                                size="small"
                            />
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default Dashboard