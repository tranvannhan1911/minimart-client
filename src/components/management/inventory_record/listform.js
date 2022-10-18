import {
    PlusOutlined, ReloadOutlined,
    SearchOutlined
} from '@ant-design/icons';
import { Button, Input, message, DatePicker } from 'antd';
import React, { useState, useEffect,  } from 'react';
import ListForm from '../templates/listform';
import InventoryRecordTable from './table';
import api from '../../../api/apis'
import { useNavigate } from 'react-router-dom'
import paths from '../../../utils/paths'
import messages from '../../../utils/messages'
import { ExportReactCSV } from '../../../utils/exportExcel';

const { RangePicker } = DatePicker;

const InventoryRecordListForm = (props) => {
    const [dataMain, setDataMain] = useState([])
    const [data, setData] = useState([])
    const [filteredInfo, setFilteredInfo] = useState({})
    const [searchInfo, setSearchInfo] = useState([])
    const [dataSearchId, setDataSearchId] = useState("")
    const [searchDate, setSearchDate] = useState([])
    const [sortedInfo, setSortedInfo] = useState({})
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const handleGetData = async () => {
        setLoading(true)
        try {
            const response = await api.inventory_record.list()
            const _data = response.data.data.results.map(elm => {
                elm.key = elm.id

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
        setDataSearchId("")
        setFilteredInfo({})
        setSortedInfo({})
        setSearchInfo([])
    };

    const onChange = (dates, dateStrings) => {
        if (dates) {
            setLoading(true);
            setSearchDate([dates[0], dates[1]])
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
            setDataSearchId("")
            setData(dataMain)
        }
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


    return (
        <>

            <ListForm
                title="Phiếu kiểm kê"
                actions={[
                    <Button onClick={() => handleGetData()} icon={<ReloadOutlined />}>Làm mới</Button>,
                    <ExportReactCSV csvData={data} fileName='inventoryrecord.xlsx'
                        header={[
                            { label: 'Mã', key: 'id' },
                            { label: 'Ngày kiểm kê', key: 'date_created' },
                            { label: 'Trạng thái', key: 'status' },
                            { label: 'Ghi chú', key: 'note' },
                        ]}
                    />,
                    <Button onClick={() => navigate(paths.inventory_record.add)} type="primary" icon={<PlusOutlined />}>Kiểm kê</Button>,
                ]}
                table={<InventoryRecordTable
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
                    clearFiltersAndSort={clearFiltersAndSort}
                    />}
                extra_actions={[
                    <Input
                        placeholder="Tìm kiếm phiếu kiểm kê"
                        allowClear value={searchInfo[0]}
                        prefix={<SearchOutlined />}
                        onChange={(e) => setSearchInfo([e.target.value])} />,
                    <RangePicker value={searchDate}
                        onChange={onChange}
                    />,
                    <Button onClick={clearFiltersAndSort}>Xóa lọc</Button>
                ]}
            >

            </ListForm></>
    )
}

export default InventoryRecordListForm;