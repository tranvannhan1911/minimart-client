import {
    ReloadOutlined,
    SearchOutlined
} from '@ant-design/icons';
import { Button, Input, message, DatePicker } from 'antd';
import React, { useState, useEffect,  } from 'react';
import ListForm from '../templates/listform';
import OrderTable from './table';
import api from '../../../api/apis'
import { useNavigate } from 'react-router-dom'
import messages from '../../../utils/messages'
import { ExportReactCSV } from '../../../utils/exportExcel';

const { RangePicker } = DatePicker;

const OrderListForm = (props) => {
    const [dataMain, setDataMain] = useState([])
    const [data, setData] = useState([])
    const [dataProductGroups, setDataProductGroups] = useState([])
    const [filteredInfo, setFilteredInfo] = useState({})
    const [searchInfo, setSearchInfo] = useState([])
    const [searchDate, setSearchDate] = useState([])
    const [dataSearchId, setDataSearchId] = useState("")
    const [dataSearchCustomer, setDataSearchCustomer] = useState("")
    const [dataSearchStaff, setDataSearchStaff] = useState("")
    const [sortedInfo, setSortedInfo] = useState({})
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const handleGetData = async () => {
        setLoading(true)
        try {
            const response = await api.order.list()
            // const response = (await axios.get('https://63252b299075b9cbee471829.mockapi.io/api/order')).data;
            // const _data = response.map(elm => {
            const _data = response.data.data.results.map(elm => {

                elm.details = elm.details.map(element => {
                    if (element.price == null) {
                        element.price = 0;
                    } else {
                        element.price = element.price.price
                    }
                    let index = {
                        "id": element.id,
                        "idProduct": element.product.id,
                        "idUnit": element.unit_exchange.id,
                        "product": element.product.name,
                        "unit_exchange": element.unit_exchange.unit_name,
                        "price": element.price,
                        "quantity": element.quantity,
                        "total": element.total,
                        "note": element.note,
                        "order": element.order,

                    }
                    return index;
                });

                let date = elm.date_created.slice(0, 10);
                let time = elm.date_created.slice(11, 19);
                elm.date_created = date + " " + time;

                let index = {
                    "key": elm.id,
                    "details": elm.details,
                    "note": elm.note,
                    "total": elm.total,
                    "final_total": elm.final_total,
                    "status": elm.status,
                    "date_created": elm.date_created,
                    "date_updated": elm.date_updated,
                    "customer": elm.customer == null ? "Khách hàng lẻ" : elm.customer.fullname,
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
        setSearchDate([])
        setDataSearchCustomer("")
        setDataSearchStaff("")
        setDataSearchId("")
        setFilteredInfo({});
        setSortedInfo({});
        setSearchInfo([]);
    };

    const onChange = (dates, dateStrings) => {
        if (dates) {
            setSearchDate([dates[0], dates[1]])
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

    const searchId = (value) => {
        setDataSearchId(value);
        let data_ = [];
        dataMain.forEach(element => {
            if (element.key.toString().toLowerCase().includes(value.toLowerCase())) {
                data_.push(element);
            }
        });
        setData(data_);
    }

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
            title="Hóa đơn bán hàng"
            actions={[

                <Button onClick={() => handleGetData()} icon={<ReloadOutlined />}>Làm mới</Button>,
                <ExportReactCSV csvData={data} fileName='listrorder.xlsx' 
                    header={[
                        { label: 'Mã', key: 'id' },
                        { label: 'Nhân viên', key: 'user_created' },
                        { label: 'Khách hàng', key: 'customer' },
                        { label: 'Ngày bán', key: 'date_created' },
                        { label: 'Tổng tiền', key: 'final_total' },
                        { label: 'Ghi chú', key: 'note' },
                    ]} 
                    />,
            ]}
            table={
                <OrderTable
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
                    dataSearchId={searchId}
                    dataSearchStaff={searchStaff}
                    dataSearchCustomer={searchCustomer}
                    clearFiltersAndSort={clearFiltersAndSort}
                />
            }
            extra_actions={[
                <Input
                    placeholder="Tìm kiếm hóa đơn"
                    allowClear value={searchInfo[0]}
                    prefix={<SearchOutlined />}
                    onChange={(e) => setSearchInfo([e.target.value])}
                />,
                <RangePicker value={searchDate}
                    onChange={onChange}
                />,
                // <Input
                //     placeholder="Tìm kiếm theo nhân viên"
                //     allowClear value={dataSearchStaff}
                //     prefix={<SearchOutlined />}
                //     onChange={(e) => searchStaff(e.target.value)}
                // />,
                // <Input
                //     placeholder="Tìm kiếm theo khách hàng"
                //     allowClear value={dataSearchCustomer}
                //     prefix={<SearchOutlined />}
                //     onChange={(e) => searchCustomer(e.target.value)}
                // />,
                <Button onClick={clearFiltersAndSort}>Xóa lọc</Button>
            ]}
        >

        </ListForm>
    )
}

export default OrderListForm;