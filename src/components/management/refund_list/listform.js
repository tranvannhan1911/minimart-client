import {
    ReloadOutlined,
    SearchOutlined
} from '@ant-design/icons';
import { Button, Input, message, DatePicker } from 'antd';
import React, { useState, useEffect,  } from 'react';
import ListForm from '../templates/listform';
import RefundTable from './table';
import api from '../../../api/apis'
import { useNavigate } from 'react-router-dom'
import messages from '../../../utils/messages'
import { ExportReactCSV } from '../../../utils/exportExcel';

const { RangePicker } = DatePicker;


const RefundListForm = (props) => {
    const [dataMain, setDataMain] = useState([])
    const [data, setData] = useState([])
    const [dataProductGroups, setDataProductGroups] = useState([])
    const [filteredInfo, setFilteredInfo] = useState({})
    const [searchInfo, setSearchInfo] = useState([])
    const [dataSearchDate, setDataSearchDate] = useState([])
    const [dataSearchCustomer, setDataSearchCustomer] = useState("")
    const [dataSearchStaff, setDataSearchStaff] = useState("")
    const [sortedInfo, setSortedInfo] = useState({})
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const handleGetData = async () => {
        setLoading(true)
        try {
            const response = await api.order_refund.list()
            // const response = (await axios.get('https://63252b299075b9cbee471829.mockapi.io/api/order')).data;
            // const _data = response.map(elm => {
            const _data = response.data.data.results.map(elm => {
                elm.details = elm.details.map(element => {
                    if(element.price == null){
                        element.price=0;
                    }else{
                        element.price= element.price.price
                    }
                    element.product = element.product.name;
                    element.unit_exchange = element.unit_exchange.unit_name;
                    return element;
                });
                let date = elm.date_created.slice(0, 10);
                let time = elm.date_created.slice(11, 19);
                elm.date_created = date + " " + time; 

                let index = {
                    ...elm,
                    "key": elm.id,
                    "details": elm.details,
                    "note": elm.note,
                    "total": elm.total,
                    "status": elm.status,
                    "date_created": elm.date_created,
                    "date_updated": elm.date_updated,
                    "customer": elm.customer == null ? "khách hàng lẻ" : elm.customer.fullname,
                    "user_created": elm.user_created == null ? "" : elm.user_created.fullname,
                    "user_updated": elm.user_updated,
                };
                return index;
            })
            // console.log(data)
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
        // handleGetDataProductGroups()
        props.setBreadcrumb(false)
    }, []);

    const clearFiltersAndSort = () => {
        setData(dataMain)
        setDataSearchDate([])
        setDataSearchCustomer("")
        setDataSearchStaff("")
        setFilteredInfo({})
        setSortedInfo({})
        setSearchInfo([])
    };

    const onChange = (dates, dateStrings) => {
        if (dates) {
            setDataSearchDate([dates[0],dates[1]])
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
            setDataSearchDate([])
            setData(dataMain)
        }
    };

    const searchCustomer = (value) => {
        setDataSearchCustomer(value);
        let data_ = [];
        dataMain.forEach(element => {
            if (element.customer.toLowerCase().includes(value.toLowerCase())) {
                data_.push(element);
            }
        });
        setData(data_);
    }

    const searchStaff = (value) => {
        setDataSearchStaff(value);
        let data_ = [];
        dataMain.forEach(element => {
            if (element.user_created.toLowerCase().includes(value.toLowerCase())) {
                data_.push(element);
            }
        });
        setData(data_);
    }

    return (
        <ListForm
            title="Đơn trả hàng"
            actions={[

                <Button onClick={() => handleGetData()} icon={<ReloadOutlined />}>Làm mới</Button>,
                <ExportReactCSV csvData={data} fileName='listrefund' 
                    header={[
                        { label: 'Mã', key: 'id' },
                        { label: 'Nhân viên', key: 'user_created' },
                        { label: 'Khách hàng', key: 'customer' },
                        { label: 'Ngày trả', key: 'date_created' },
                        { label: 'Trạng thái', key: 'status' },
                        { label: 'Ghi chú', key: 'note' },
                    ]} 
                    />,
            ]}
            table={
                <RefundTable
                    data={data}
                    handleGetData={handleGetData}
                    dataProductGroups={dataProductGroups}
                    loading={loading}
                    setLoading={setLoading}
                    filteredInfo={filteredInfo}
                    setFilteredInfo={setFilteredInfo}
                    searchInfo={searchInfo}
                    setSearchInfo={setSearchInfo}
                    sortedInfo={sortedInfo}
                    setSortedInfo={setSortedInfo}
                />
            }
            extra_actions={[
                <Input
                    placeholder="Tìm kiếm đơn trả hàng"
                    allowClear value={searchInfo[0]}
                    prefix={<SearchOutlined />}
                    onChange={(e) => setSearchInfo([e.target.value])}
                />,
                <RangePicker value={dataSearchDate}
                    onChange={onChange}
                />,
                <Input
                    placeholder="Tìm kiếm theo nhân viên"
                    allowClear value={dataSearchStaff}
                    prefix={<SearchOutlined />}
                    onChange={(e) => searchStaff(e.target.value)}
                />,
                <Input
                    placeholder="Tìm kiếm theo khách hàng"
                    allowClear value={dataSearchCustomer}
                    prefix={<SearchOutlined />}
                    onChange={(e) => searchCustomer(e.target.value)}
                />,
                <Button onClick={clearFiltersAndSort}>Xóa lọc</Button>
            ]}
        >

        </ListForm>
    )
}

export default RefundListForm;