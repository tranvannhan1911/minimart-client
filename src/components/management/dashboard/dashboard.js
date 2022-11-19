import {
    UserOutlined,
    ShoppingCartOutlined,
    DollarCircleOutlined,
} from '@ant-design/icons';
import React, { useEffect, useState } from 'react'
import { Space, Table, Tag, Row, Col, Card, Typography, message } from 'antd';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import api from '../../../api/apis'
import { useNavigate } from 'react-router-dom';
import OrderDetailModal from './modal_details';


const topCustomers = {
    head: [
        {
            title: 'Họ tên',
            dataIndex: 'username',
            key: 'name',
            render: (product, record) => (
                <Typography>{`${record.customer?.fullname}`}</Typography>
            ),
        },
        {
            title: 'Số hóa đơn',
            dataIndex: 'order',
            key: 'age',
            render: (product, record) => (
                <Typography>{`${record.count}`}</Typography>
            ),
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'final_total',
            key: 'address',
            render: (product, record) => (
                <Typography>{`${record.final_total.toLocaleString()}`}</Typography>
            ),
        },
    ],

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
            dataIndex: 'customer',
            key: 'name',
        },
        {
            title: 'Ngày mua',
            dataIndex: 'date',
            key: 'name',
            render: (product, record) => (
                <Typography>{`${record.date_created?.slice(0, 10)}`}</Typography>
            ),
        },

        {
            title: 'Tổng tiền',
            dataIndex: 'price',
            key: 'address',
            render: (product, record) => (
                <Typography>{`${record.final_total?.toLocaleString()}`}</Typography>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'age',
            render: (product, record) => (
                <Typography>{`${record.status == "complete" ? "Hoàn thành" : "Trả hàng"}`}</Typography>
            ),
        },
    ],

}

const Dashboard = () => {

    useEffect(() => {
        document.title = "Trang chủ - Quản lý siêu thị mini NT"
    }, [])

    const navigate = useNavigate();
    const [dataOrder, setDataOrder] = useState([]);
    const [dataCustomer, setDataCustomer] = useState([]);
    const [dataTotalMoney, setDataTotalMoney] = useState("");
    const [dataTotalOrder, setDataTotalOrder] = useState("");
    const [dataTotalOrderRefund, setDataTotalOrderRefund] = useState("");
    const [dataTotalCustomer, setDataTotalCustomer] = useState("");
    const [dataDTBH, setDataDTBH] = useState([]);
    const [dataDTTH, setDataDTTH] = useState([]);
    const [dataLabel, setDataLabel] = useState([]);
    const [openDetails, setOpenDetails] = useState(false);
    const [dataIndex, setDataIndex] = useState({});

    useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
        const response = await api.dashboard.list();
        setDataTotalCustomer(response.data.data.count_customer_7_days)
        setDataTotalMoney(response.data.data.total_money_7_days)
        setDataTotalOrder(response.data.data.count_order_7_days)
        setDataTotalOrderRefund(response.data.data.count_order_refund_7_days)
        setDataCustomer(response.data.data.top_5_customer)
        setDataOrder(response.data.data.top_5_order)
        let label = [];
        let dataDuLieuBH = [];
        let dataDuLieuTH = [];
        response.data.data.order_7_days.forEach(element => {
            label.push(element.date);
            dataDuLieuBH.push(element.final_total);
        });
        response.data.data.order_refund_7_days.forEach(element => {
            dataDuLieuTH.push(element.total);
        });
        setDataLabel(label);
        setDataDTBH(dataDuLieuBH);
        setDataDTTH(dataDuLieuTH);
    }

    return (
        <div>
            <Row><h2 className="page-header">Dashboard</h2></Row>
            <Row style={{ marginTop: "-15px" }}><h3>(Từ {dataLabel[0]} đến {dataLabel[6]})</h3></Row>
            <Row>
                <Col span={13}>
                    <Row style={{ paddingTop: '10px' }}>
                        <Col span={11}>
                            {/* <a href='#' title='Tổng tiền' onClick={() => { navigate("/quan-ly/don-ban-hang") }}> */}
                            <Card style={{ backgroundColor: "#95c2ec", borderRadius: "20px" }}>
                                <Row>
                                    <Col span={10}>
                                        <DollarCircleOutlined style={{ fontSize: '50px' }} />
                                    </Col>
                                    <Col span={14}>
                                        <div style={{ fontWeight: "bold", fontSize: '20px' }}>{dataTotalMoney == null ? "0" : dataTotalMoney?.toLocaleString()}</div>
                                        <div>Tổng tiền</div>
                                    </Col>

                                </Row>
                            </Card>
                            {/* </a> */}
                        </Col>
                        <Col span={2}></Col>
                        <Col span={11}>
                            {/* <a href='#' title='Tổng khách hàng' onClick={() => { navigate("/quan-ly/don-ban-hang") }}> */}
                            <Card style={{ backgroundColor: "#95c2ec", borderRadius: "20px" }}>
                                <Row>
                                    <Col span={10}>
                                        <UserOutlined style={{ fontSize: '50px' }} />
                                    </Col>
                                    <Col span={14}>
                                        <div style={{ fontWeight: "bold", fontSize: '20px' }}>{dataTotalCustomer?.toLocaleString()}</div>
                                        <div>Tổng khách hàng</div>
                                    </Col>

                                </Row>
                            </Card>
                            {/* </a> */}
                        </Col>

                    </Row>
                    <Row style={{ paddingTop: '30px' }}>
                        <Col span={11}>
                            {/* <a href='#' title='Tổng hóa đơn' onClick={() => { navigate("/quan-ly/don-ban-hang") }}> */}
                            <Card style={{ backgroundColor: "#95c2ec", borderRadius: "20px" }}>
                                <Row>
                                    <Col span={10}>
                                        <ShoppingCartOutlined style={{ fontSize: '50px' }} />
                                    </Col>
                                    <Col span={14}>
                                        <div style={{ fontWeight: "bold", fontSize: '20px' }}>{dataTotalOrder?.toLocaleString()}</div>
                                        <div style={{ fontSize: '15px' }}>Tổng hóa đơn</div>
                                    </Col>

                                </Row>
                            </Card>
                            {/* </a> */}
                        </Col>
                        <Col span={2}></Col>
                        <Col span={11}>
                            {/* <a href='#' title='Tổng hóa đơn trả' onClick={() => { navigate("/quan-ly/don-tra-hang") }}> */}
                            <Card style={{ backgroundColor: "#95c2ec", borderRadius: "20px" }}>
                                <Row>
                                    <Col span={10}>
                                        <ShoppingCartOutlined style={{ fontSize: '50px' }} />
                                    </Col>
                                    <Col span={14}>
                                        <div style={{ fontWeight: "bold", fontSize: '20px' }}>{dataTotalOrderRefund?.toLocaleString()}</div>
                                        <div>Tổng hóa đơn trả</div>
                                    </Col>
                                </Row>
                            </Card>
                            {/* </a> */}
                        </Col>

                    </Row>
                </Col>
                <Col span={1}></Col>
                <Col span={10}>
                    <Card style={{ borderRadius: "20px" }}>
                        <div className="card__header">
                            <h3>Doanh thu (VND)</h3>
                        </div>
                        {/* chart */}
                        <Bar
                            height={70}
                            width={200}
                            data={{
                                labels: dataLabel,
                                // datasets: [
                                //     {
                                //         label: "Doanh thu (VND)",
                                //         backgroundColor: [
                                //             "#3e95cd",
                                //             "#3e95cd",
                                //             "#3e95cd",
                                //             "#3e95cd",
                                //             "#3e95cd",
                                //             "#3e95cd",
                                //             "#3e95cd"
                                //         ],
                                //         data: dataDT
                                //     }
                                // ]
                                datasets: [
                                    {
                                        label: 'Bán hàng',
                                        data: dataDTBH,
                                        backgroundColor: 'rgba(53, 162, 235, 0.5)',
                                    },
                                    {
                                        label: 'Trả hàng',
                                        data: dataDTTH,
                                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                    },
                                ],
                            }}
                            options={{
                                legend: { display: false },
                                title: {
                                    display: true,
                                    text: `Doanh thu (VND) từ ${dataLabel[0]} đến ${dataLabel[6]}`
                                }
                            }}
                        />
                    </Card>
                </Col>
            </Row>
            <Row style={{ marginTop: "20px" }}>
                <Col span={9}>
                    <Card style={{ borderRadius: "20px" }}>
                        <div className="card__header">
                            <h3>Top 5 khách hàng thân thiết</h3>
                        </div>
                        <div className="card__body">
                            <Table
                                columns={topCustomers.head}
                                dataSource={dataCustomer}
                                pagination={false}
                                size="small"
                            />
                        </div>
                    </Card>
                </Col>
                <Col span={1}></Col>

                <Col span={14}>
                    <Card style={{ borderRadius: "20px" }}>
                        <div className="card__header">
                            <h3>Top 5 hóa đơn bán hàng</h3>
                        </div>
                        <div className="card__body">
                            <Table
                                columns={latestOrders.header}
                                dataSource={dataOrder}
                                pagination={false}
                                size="small"
                                onRow={(record, rowIndex) => {
                                    return {
                                        onClick: event => {
                                            console.log(record);
                                            setDataIndex(record);
                                            setOpenDetails(true)
                                        }, // click row
                                        onDoubleClick: event => {
                                            setDataIndex(record);
                                            setOpenDetails(true)
                                        }, // double click row
                                        onContextMenu: event => { }, // right button click row
                                        onMouseEnter: event => { }, // mouse enter row
                                        onMouseLeave: event => { }, // mouse leave row
                                    };
                                }}
                            />
                        </div>
                    </Card>
                </Col>
            </Row>
            <OrderDetailModal
                openDetails={openDetails}
                data={dataIndex}
                setOpenDetails={setOpenDetails}
            />
        </div>
    )
}

export default Dashboard