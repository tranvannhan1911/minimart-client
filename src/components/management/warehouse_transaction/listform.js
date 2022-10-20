import {
    PlusOutlined, ImportOutlined,
    ExportOutlined, ReloadOutlined,
    SearchOutlined
} from '@ant-design/icons';
import { Button, Col, Row, Space, Input, message, Modal, DatePicker } from 'antd';
import { Typography } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import ListForm from '../templates/listform';
import WarehouseTransactionTable from './table';
import api from '../../../api/apis'
import { useNavigate } from 'react-router-dom'
import paths from '../../../utils/paths'
import messages from '../../../utils/messages'
import axios from 'axios';
import { ExportReactCSV } from '../../../utils/exportExcel';
const { RangePicker } = DatePicker;

const WarehouseTransactionListForm = (props) => {
    const [dataMain, setDataMain] = useState([])
    const [data, setData] = useState([])
    const [filteredInfo, setFilteredInfo] = useState({})
    const [searchInfo, setSearchInfo] = useState([])
    const [searchDate, setSearchDate] = useState([])
    const [dataSearchId, setDataSearchId] = useState("")
    const [dataSearchProduct, setDataSearchProduct] = useState("")
    const [sortedInfo, setSortedInfo] = useState({})
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const handleGetData = async () => {
        setLoading(true)
        try {
            // const response = (await axios.get('https://63252b299075b9cbee471829.mockapi.io/api/warehouse-transaction')).data;
            // const _data = response.map(elm => {
            const response = await api.warehouse_transaction.list()
            const _data = response.data.data.results.map(elm => {
                elm.key = elm.id;
                let date = elm.date_created.slice(0, 10);
                let time = elm.date_created.slice(11, 19);
                // elm.date_created = date + " " + time;   
                // elm.change = elm.change > 0 ? `+${elm.change}` : elm.change;
                // elm.unit_exchange = elm.reference?.unit_exchange?.unit_name;
                
                // elm.product_obj = elm.product;
                // elm.product = elm.product.name;
                // elm.type = elm.type.type_name;
                // elm.change = elm.change > 0 ? `+${elm.change}` : elm.change;
                // elm.reference = elm.product.base_unit.name;
                // elm.product = elm.product.name;
                // elm.type = elm.type.type_name;
                let reference='';
                let link="";
                if(elm.type.type == "promotion"){
                    reference="";
                }else if(elm.type.type == "order" || elm.type.type == "order_cancel"){
                    reference=elm.reference.order;
                    link="navigate(paths.order.get("+reference+"))";
                }else if(elm.type.type == "inventory_receiving" || elm.type.type == "inventory_receiving_cancel"){
                    reference=elm.reference.receiving_voucher
                }else if(elm.type.type == "refund"){
                    reference=elm.reference.receiving_voucher
                }else if(elm.type.type == "inventory" || elm.type.type == "inventory_cancel"){
                    reference=elm.reference.receiving_voucher
                }

                let elmm={
                    key: elm.id,
                    id: elm.id,
                    unit: elm.product.base_unit.name,
                    product: elm.product.name,
                    change: elm.change > 0 ? `+${elm.change}` : elm.change,
                    date_created: date + " " + time,
                    reference: reference,
                    type: elm.type.type_name,
                    note: elm.note,
                    link: link
                }
                
                return elmm
            })
            setData(_data)
            setDataMain(_data)
        } catch (error) {
            console.log('Failed:', error)
            message.error(messages.ERROR_REFRESH)
        }
        setLoading(false)
    }

    useEffect(() => {
        handleGetData()
        props.setBreadcrumb(false)
    }, []);

    const clearFiltersAndSort = () => {
        setData(dataMain)
        setSearchDate([])
        setDataSearchId("")
        setDataSearchProduct("")
        setFilteredInfo({})
        setSortedInfo({})
        setSearchInfo([])
    };

    const onChange = (dates, dateStrings) => {
        if (dates) {
            setSearchDate([dates[0],dates[1]])
            setLoading(true);
            console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
            const datest = new Date(dateStrings[0].slice(0, 10));
            const dateen = new Date(dateStrings[1].slice(0, 10));
            let data_ = [];
            dataMain.forEach(elm => {
                const datecr = new Date(elm.date_created.slice(0, 10));
                if (datest <= datecr && datecr <= dateen) {
                    data_.push(elm);
                }
            });
            // console.log(data_)
            console.log(data_);
            setData(data_);
            setLoading(false);
        } else {
            console.log('Clear');
            setSearchDate([])
            setData(dataMain)
        }
    };

    const searchProduct = (value) => {
        setDataSearchProduct(value);
        let data_ = [];
        dataMain.forEach(element => {
            if (element.product.toLowerCase().includes(value.toLowerCase())) {
                data_.push(element);
            }
        });
        setData(data_);
    }

    const searchId = (value) => {
        setDataSearchId(value);
        let data_ = [];
        dataMain.forEach(element => {
            if (element.id.toString().toLowerCase().includes(value.toLowerCase())) {
                data_.push(element);
            }
        });
        setData(data_);
    }

    return (
        <>
            {/* <ModalStaff >

        </ModalStaff> */}
            <ListForm
                title="Lịch sử biến động kho"
                actions={[
                    <Button onClick={() => handleGetData()} icon={<ReloadOutlined />}>Làm mới</Button>,
                    <ExportReactCSV csvData={data} fileName='warehousetransaction.xlsx' 
                    header={[
                        { label: 'Mã', key: 'id' },
                        { label: 'Sản phẩm', key: 'product' },
                        { label: 'Loại', key: 'type' },
                        { label: 'Số lượng thay đổi', key: 'change' },
                        { label: 'Ngày thay đổi', key: 'date_created' },
                        { label: 'Ghi chú', key: 'note' },
                    ]} 
                    />,
                    // <Button onClick={() => navigate(paths.staff.add)} type="primary" icon={<PlusOutlined />}>Thêm</Button>,
                ]}
                table={<WarehouseTransactionTable
                    data={data}
                    loading={loading}
                    setLoading={setLoading}
                    filteredInfo={filteredInfo}
                    setFilteredInfo={setFilteredInfo}
                    searchInfo={searchInfo}
                    setSearchInfo={setSearchInfo}
                    sortedInfo={sortedInfo}
                    setSortedInfo={setSortedInfo} 
                    dataSearchId={searchId} 
                    dataSearchProduct={searchProduct}
                    clearFiltersAndSort={clearFiltersAndSort}
                    />}
                extra_actions={[
                    <Input
                        placeholder="Tìm kiếm biến động kho"
                        allowClear value={searchInfo[0]}
                        prefix={<SearchOutlined />}
                        onChange={(e) => setSearchInfo([e.target.value])} />,
                    <RangePicker value={searchDate}
                        onChange={onChange}
                    />,
                    // <Input
                    //     placeholder="Tìm kiếm theo sản phẩm"
                    //     allowClear value={dataSearchProduct}
                    //     prefix={<SearchOutlined />}
                    //     onChange={(e) => searchProduct(e.target.value)}
                    // />,
                    <Button onClick={clearFiltersAndSort}>Xóa lọc</Button>
                ]}
            >

            </ListForm></>
    )
}

export default WarehouseTransactionListForm;