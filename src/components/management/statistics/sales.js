import {
    PlusOutlined, EditOutlined, DeleteOutlined, HistoryOutlined
} from '@ant-design/icons';
import { Button, Form, Input, Select, message, Space, Popconfirm, Switch, Row, Col, DatePicker, Table, Radio } from 'antd';
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
import StatisticsSalesByCustomer from './sales/sales_by_customer';
import StatisticsSalesByStaff from './sales/sales_by_staff';


const { Option } = Select;
const { TextArea } = Input;
const idCity = 0;
const { RangePicker } = DatePicker;


const StatisticsSales = () => {

    const [loadings, setLoadings] = useState([]);
    const [data, setData] = useState([]);
    const [typeStatistics, setTypeStatistics] = useState("true");

    useEffect(() => {
      document.title = "Thống kê bán hàng - Quản lý siêu thị mini NT"
    }, [])

    const onChange = (e) => {
        console.log('radio checked', e.target.value);
        setTypeStatistics(e.target.value);
    };

    return (
        <div>
            <Row><Col span={24}><h1 style={{ textAlign: 'center', fontSize: '25px', margin:"0" }}>Thống kê doanh số bán hàng</h1></Col></Row>
            <Row>
                <Col span={24}>
                <Radio.Group onChange={onChange} value={typeStatistics}>
                    <Radio value="true">Theo nhân viên</Radio>
                    <Radio value="false">Theo khách hàng</Radio>
                </Radio.Group>
                </Col>
            </Row>
            <span style={{ display: typeStatistics == "true" ? "none" : "block" }}><StatisticsSalesByCustomer></StatisticsSalesByCustomer></span>
            <span style={{ display: typeStatistics == "true" ? "block" : "none" }}><StatisticsSalesByStaff></StatisticsSalesByStaff></span>

        </div>

    )

}

export default StatisticsSales;