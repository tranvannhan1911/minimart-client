import {
    PlusOutlined, ReloadOutlined,
    SearchOutlined
} from '@ant-design/icons';
import { Button, Input, message, DatePicker } from 'antd';
import React, { useState, useEffect,  } from 'react';
import ListForm from '../templates/listform';
import PromotionTable from './table';
import api from '../../../api/apis'
import { useNavigate } from 'react-router-dom'
import paths from '../../../utils/paths'
import messages from '../../../utils/messages'
import { ExportReactCSV } from '../../../utils/exportExcel';


const PromotionListForm = (props) => {
    const [dataMain, setDataMain] = useState([])
    const [data, setData] = useState([])
    const [filteredInfo, setFilteredInfo] = useState({})
    const [searchInfo, setSearchInfo] = useState([])
    const [dataSearchId, setDataSearchId] = useState("")
    const [dataSearchTitle, setDataSearchTitle] = useState("")
    const [dataSearchDescription, setDataSearchDescription] = useState("")
    const [dataSearchDate, setDataSearchDate] = useState("")
    const [sortedInfo, setSortedInfo] = useState({})
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const handleGetData = async () => {
        setLoading(true)
        try {
            const response = await api.promotion.list()
            const _data = response.data.data.results.map(elm => {
                elm.key = elm.id

                let datest = elm.start_date.slice(0, 10);
                // let time=elm.start_date.slice(12, 19);
                elm.start_date = datest;

                let dateen = elm.end_date.slice(0, 10);
                // let time2=elm.end_date.slice(12, 19);
                elm.end_date = dateen;

                let date = elm.date_created.slice(0, 10);
                let time = elm.date_created.slice(11, 19);
                elm.date_created = date + " " + time;

                if (elm.date_updated != null) {
                    let date2 = elm.date_updated.slice(0, 10);
                    let time2 = elm.date_updated.slice(11, 19);
                    elm.date_updated = date2 + " " + time2;
                }


                const _applicable_customer_groups = [];
                elm.applicable_customer_groups.forEach(gr => _applicable_customer_groups.push(gr.name))
                elm.applicable_customer_groups = _applicable_customer_groups;

                return elm;
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
        setDataSearchId("")
        setDataSearchDate("")
        setDataSearchTitle("")
        setDataSearchDescription("")
        setFilteredInfo({})
        setSortedInfo({})
        setSearchInfo([])
    };

    const onChange = (dates, dateStrings) => {
        if (dates) {
            setDataSearchDate(dates)
            setLoading(true);
            const datecr = new Date(dateStrings.slice(0, 10));
            let data_ = [];
            dataMain.forEach(elm => {
                const datest = new Date(elm.start_date.slice(0, 10));
                const dateen = new Date(elm.end_date.slice(0, 10));
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
            setDataSearchDate("")
            setData(dataMain)
        }
    };

    const searchId = (value) =>{
        setDataSearchId(value);
        let data_ = [];
        dataMain.forEach(element => {
            if(element.id.toString().toLowerCase().includes(value.toLowerCase())){
                data_.push(element);
            }
        });
        setData(data_);
    }

    const searchTitle = (value) => {
        setDataSearchTitle(value);
        let data_ = [];
        dataMain.forEach(element => {
            if (element.title.toLowerCase().includes(value.toLowerCase())) {
                data_.push(element);
            }
        });
        setData(data_);
    }

    const searchDescription = (value) => {
        setDataSearchDescription(value);
        let data_ = [];
        dataMain.forEach(element => {
            if (element.description.toLowerCase().includes(value.toLowerCase())) {
                data_.push(element);
            }
        });
        setData(data_);
    }

    return (
        <>

            <ListForm
                title="Chương trình khuyến mãi"
                actions={[
                    <Button onClick={() => handleGetData()} icon={<ReloadOutlined />}>Làm mới</Button>,
                    <ExportReactCSV csvData={data} fileName='listrpromotion.xlsx' 
                    header={[
                        { label: 'Mã', key: 'id' },
                        { label: 'Tiêu đề', key: 'title' },
                        { label: 'Mô tả', key: 'description' },
                        { label: 'Ngày bắt đầu', key: 'start_date' },
                        { label: 'Ngày kết thúc', key: 'end_date' },
                        // { label: 'Nhóm khách hàng', key: 'applicable_customer_groups' },
                        { label: 'Trạng thái', key: 'status' },
                        { label: 'Ghi chú', key: 'note' },
                    ]} 
                    />,
                    <Button onClick={() => navigate(paths.promotion.add)} type="primary" icon={<PlusOutlined />}>Thêm</Button>,
                ]}
                table={<PromotionTable
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
                    dataSearchTitle={searchTitle}
                    dataSearchDescription={searchDescription}
                    clearFiltersAndSort={clearFiltersAndSort}
                    />}
                extra_actions={[
                    <Input
                        placeholder="Tìm kiếm chương trình khuyến mãi"
                        allowClear value={searchInfo[0]}
                        prefix={<SearchOutlined />}
                        onChange={(e) => setSearchInfo([e.target.value])} />,
                    // <Input
                    //     placeholder="Tìm kiếm theo tiêu đề"
                    //     allowClear value={dataSearchTitle}
                    //     prefix={<SearchOutlined />}
                    //     onChange={(e) => searchTitle(e.target.value)}
                    // />,
                    // <Input
                    //     placeholder="Tìm kiếm theo mô tả"
                    //     allowClear value={dataSearchDescription}
                    //     prefix={<SearchOutlined />}
                    //     onChange={(e) => searchDescription(e.target.value)}
                    // />,
                    <DatePicker onChange={onChange} value={dataSearchDate} />,
                    <Button onClick={clearFiltersAndSort}>Xóa lọc</Button>
                ]}
            >

            </ListForm></>
    )
}

export default PromotionListForm;