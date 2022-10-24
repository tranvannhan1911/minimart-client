import {
    PlusOutlined, ReloadOutlined,
    SearchOutlined
} from '@ant-design/icons';
import { Button, Input, message, DatePicker } from 'antd';
import React, { useState, useEffect } from 'react';
import ListForm from '../templates/listform';
import InventoryReceivingTable from './table';
import api from '../../../api/apis'
import { useNavigate } from 'react-router-dom'
import paths from '../../../utils/paths'
import messages from '../../../utils/messages'
import { ExportReactCSV } from '../../../utils/exportExcel';
import ShowForPermission from '../../basic/permission';
import { ExportTemplateReactCSV } from '../../../utils/exportTemplate';
const { RangePicker } = DatePicker;

const InventoryReceivingListForm = (props) => {
    const [dataMain, setDataMain] = useState([])
    const [data, setData] = useState([])
    const [filteredInfo, setFilteredInfo] = useState({})
    const [searchInfo, setSearchInfo] = useState([])
    const [searchDate, setSearchDate] = useState([])
    const [dataSearchId, setDataSearchId] = useState("")
    const [dataSearchSupplier, setDataSearchSupplier] = useState("")
    const [dataSearchTotal, setDataSearchTotal] = useState('')
    const [sortedInfo, setSortedInfo] = useState({})
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const handleGetData = async () => {
        setLoading(true)
        try {
            const response = await api.inventory_receiving.list()
            const _data = response.data.data.results.map(elm => {
                elm.key = elm.id;
                elm.supplier = elm.supplier.name;

                let date = elm.date_created.slice(0, 10);
                let time = elm.date_created.slice(11, 19);
                elm.date_created = date + " " + time;
                elm.date_updated = elm.date_updated
                    ? elm.date_updated.slice(0, 10) + " " + elm.date_updated.slice(11, 19)
                    : null;
                return elm
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
        setDataSearchId('')
        setDataSearchSupplier("")
        setDataSearchTotal("")
        setFilteredInfo({})
        setSortedInfo({})
        setSearchInfo([])
    };

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


    const searchSupplier = (value) => {
        setDataSearchSupplier(value);
        let data_ = [];
        dataMain.forEach(element => {
            if (element.supplier.toLowerCase().includes(value.toLowerCase())) {
                data_.push(element);
            }
        });
        setData(data_);
    }

    const searchTotal = (value) => {
        setDataSearchTotal(value);
        let data_ = [];
        dataMain.forEach(element => {
            if (element.total.toString().toLowerCase().includes(value.toString().toLowerCase())) {
                data_.push(element);
            }
        });
        setData(data_);
    }

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

    return (
        <>

            <ListForm
                title="Phiếu nhập hàng"
                actions={[
                    <Button onClick={() => handleGetData()} icon={<ReloadOutlined />}>Làm mới</Button>,

                    <ShowForPermission>
                        <ExportReactCSV csvData={data} fileName='ds_nhap_hang.xlsx'
                            header={[
                                { label: 'Mã', key: 'id' },
                                { label: 'Nhà cung cấp', key: 'supplier' },
                                { label: 'Ngày nhập', key: 'date_created' },
                                { label: 'Tổng tiền', key: 'total' },
                                { label: 'Trạng thái', key: 'status' },
                                { label: 'Ghi chú', key: 'note' },
                            ]}
                        />
                    </ShowForPermission>,
                    <ShowForPermission>
                        <ExportTemplateReactCSV csvData={[]} fileName='template_nhap_hang.xlsx'
                            header={[
                                { label: 'maSP', key: 'maSP' },
                                { label: 'soluong', key: 'soluong' },
                                { label: 'gia', key: 'gia' },
                                { label: 'ghichu', key: 'ghichu' },
                                { label: '(So luong theo don vi co ban)', key: 'note' },
                            ]}
                        />
                    </ShowForPermission>,
                    <ShowForPermission>
                        <Button onClick={() => navigate(paths.inventory_receiving.add)} type="primary" icon={<PlusOutlined />}>Nhập hàng</Button>
                    </ShowForPermission>,
                ]}
                table={<InventoryReceivingTable
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
                    dataSearchSupplier={searchSupplier}
                    dataSearchTotal={searchTotal}
                    clearFiltersAndSort={clearFiltersAndSort}
                />}
                extra_actions={[
                    <Input
                        placeholder="Tìm kiếm phiếu nhập hàng"
                        allowClear value={searchInfo[0]}
                        prefix={<SearchOutlined />}
                        onChange={(e) => setSearchInfo([e.target.value])} />,
                    <RangePicker value={searchDate}
                        onChange={onChange}
                    />,
                    // <Input
                    //     placeholder="Tìm kiếm theo nhà cung cấp"
                    //     allowClear value={dataSearchSupplier}
                    //     prefix={<SearchOutlined />}
                    //     onChange={(e) => searchSupplier(e.target.value)}
                    // />,
                    // <Input
                    //     placeholder="Tìm kiếm theo tổng tiền"
                    //     allowClear value={dataSearchTotal}
                    //     prefix={<SearchOutlined />}
                    //     onChange={(e) => searchTotal(e.target.value)}
                    // />,
                    <Button onClick={clearFiltersAndSort}>Xóa lọc</Button>
                ]}
            >

            </ListForm></>
    )
}

export default InventoryReceivingListForm;