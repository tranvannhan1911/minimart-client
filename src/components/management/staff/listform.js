import {
    PlusOutlined, UploadOutlined,
    ReloadOutlined,
    SearchOutlined
} from '@ant-design/icons';
import { Button, Input, message, Upload } from 'antd';
import React, { useState, useEffect,  } from 'react';
import ListForm from '../templates/listform';
import StaffTable from './table';
import api from '../../../api/apis'
import { useNavigate } from 'react-router-dom'
import paths from '../../../utils/paths'
import messages from '../../../utils/messages'
import { ExportReactCSV } from '../../../utils/exportExcel';
import * as XLSX from 'xlsx';

const StaffListForm = (props) => {
    const [dataMain, setDataMain] = useState([])
    const [data, setData] = useState([])
    const [filteredInfo, setFilteredInfo] = useState({})
    const [searchInfo, setSearchInfo] = useState([])
    const [dataSearchName, setDataSearchName] = useState("")
    const [dataSearchPhone, setDataSearchPhone] = useState('')
    const [sortedInfo, setSortedInfo] = useState({})
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    const uploadData = {
        async beforeUpload(file) {
            // console.log(file.name)
            var typeFile = file.name.split('.').pop().toLowerCase();
            if (typeFile == "xlsx" || typeFile == "csv") {
                setLoading(true);
                const data = await file.arrayBuffer();
                const workbook = XLSX.read(data);

                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                for (let index = 0; index < jsonData.length; index++) {
                    const element = jsonData[index];
                    const response = await api.staff.add({
                        "phone": '0' + element.phone,
                        "fullname": element.fullname,
                        "gender": element.gender,
                        "address": element.address,
                        "note": element.note,
                    });
                    if (index == jsonData.length - 1) {
                        console.log(index)
                        message.success("Xong quá trình thêm dữ liệu");
                        setLoading(false);
                        handleGetData();
                    }
                }
            } else {
                message.error("Chỉ nhập dữ liệu bằng file .csv, .xlsx");
                return;
            }

        }
    };

    const handleGetData = async () => {
        setLoading(true)
        try {
            const response = await api.staff.list()
            const _data = response.data.data.results.map(elm => {
                elm.key = elm.id
                switch (elm.gender) {
                    case "M":
                        elm.gender = "Nam"
                        break
                    case "F":
                        elm.gender = "Nữ"
                        break
                    case "U":
                        elm.gender = "Không xác định"
                        break
                }
                if (elm.is_manager == true) {
                    elm.is_manager = "Quản lý";
                } else {
                    elm.is_manager = "Nhân viên";
                }
                if (elm.date_joined != null) {
                    let datej = elm.date_joined.slice(0, 10);
                    let timej = elm.date_joined.slice(11, 19);
                    elm.date_joined = datej + " " + timej;
                }

                let date = elm.date_created.slice(0, 10);
                let time = elm.date_created.slice(11, 19);
                elm.date_created = date + " " + time;

                if (elm.date_updated != null) {
                    let date2 = elm.date_updated.slice(0, 10);
                    let time2 = elm.date_updated.slice(11, 19);
                    elm.date_updated = date2 + " " + time2;
                }

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
        setDataSearchName("")
        setDataSearchPhone("")
        setFilteredInfo({})
        setSortedInfo({})
        setSearchInfo([])
    };

    const searchName = (value) => {
        setDataSearchName(value);
        let data_ = [];
        dataMain.forEach(element => {
            if (element.fullname.toLowerCase().includes(value.toLowerCase())) {
                data_.push(element);
            }
        });
        setData(data_);
    }

    const searchPhone = (value) => {
        setDataSearchPhone(value);
        let data_ = [];
        dataMain.forEach(element => {
            if (element.phone.toString().toLowerCase().includes(value.toString().toLowerCase())) {
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
                title="Nhân viên"
                actions={[
                    <Button onClick={() => handleGetData()} icon={<ReloadOutlined />}>Làm mới</Button>,
                    <Upload showUploadList={false} {...uploadData}>
                        <Button icon={<UploadOutlined />}>Nhập Excel</Button>
                    </Upload>,
                    <ExportReactCSV csvData={data} fileName='staff' 
                    // header={[
                    //     { label: 'Mã', key: 'id' },
                    //     { label: 'Họ tên', key: 'fullname' },
                    //     { label: 'Giới tính', key: 'gender' },
                    //     { label: 'Số điện thoại', key: 'phone' },
                    //     { label: 'Vị trí', key: 'is_manager' },
                    //     { label: 'Địa chỉ', key: 'address' },
                    //     { label: 'Ghi chú', key: 'note' },
                    //     { label: 'Trạng thái', key: 'is_active' },
                    // ]} 
                    />,
                    <Button onClick={() => navigate(paths.staff.add)} type="primary" icon={<PlusOutlined />}>Thêm</Button>,
                ]}
                table={<StaffTable
                    data={data}
                    loading={loading}
                    setLoading={setLoading}
                    filteredInfo={filteredInfo}
                    setFilteredInfo={setFilteredInfo}
                    searchInfo={searchInfo}
                    setSearchInfo={setSearchInfo}
                    sortedInfo={sortedInfo}
                    setSortedInfo={setSortedInfo} />}
                extra_actions={[
                    <Input
                        placeholder="Tìm kiếm nhân viên"
                        allowClear value={searchInfo[0]}
                        prefix={<SearchOutlined />}
                        onChange={(e) => setSearchInfo([e.target.value])} />,
                    <Input
                        placeholder="Tìm kiếm theo tên"
                        allowClear value={dataSearchName}
                        prefix={<SearchOutlined />}
                        onChange={(e) => searchName(e.target.value)}
                    />,
                    <Input
                        placeholder="Tìm kiếm số điện thoại"
                        allowClear value={dataSearchPhone}
                        prefix={<SearchOutlined />}
                        onChange={(e) => searchPhone(e.target.value)}
                    />,
                    <Button onClick={clearFiltersAndSort}>Xóa lọc</Button>
                ]}
            >

            </ListForm></>
    )
}

export default StaffListForm;