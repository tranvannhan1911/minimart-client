import { SearchOutlined } from '@ant-design/icons';
import {
  EyeOutlined, FormOutlined,DeleteOutlined
} from '@ant-design/icons'
import { Button, Space, Table as AntdTable, Input, Tag, Pagination, Switch, message, Popconfirm } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import Highlighter from 'react-highlight-words';
import { useNavigate } from 'react-router-dom';
import paths from '../../../utils/paths'
import { Col, Divider, Drawer, Row } from 'antd';
import api from '../../../api/apis'
import messages from '../../../utils/messages'
import PriceModal from './modal';
const { Search } = Input;
// const idstaff=0;

const DescriptionItem = ({ title, content }) => (
  <div className="site-description-item-profile-wrapper">
    <p className="site-description-item-profile-p-label">{title}:</p>
    {content}
  </div>
);

const StaffTable = (props) => {
  const navigate = useNavigate();
  const [data1, setData1] = useState();
  const [open, setOpen] = useState(false);
  const [dataIndex, setDataIndex] = useState("");
  // const [isStatus, setStatus] = useState(false);
  const [currentCountData, SetCurrentCountData] = useState(0);

  const handleChange = (pagination, filters, sorter, extras) => {
    console.log('Various parameters\n', pagination, filters, sorter);
    props.setFilteredInfo(filters);
    props.setSortedInfo(sorter);
    SetCurrentCountData(extras.currentDataSource.length)
  };

  ///////

  async function showDrawer(id) {
    // setOpen(true);
    // renderProfile()
    // console.log(props);
    props.data.forEach(element => {
      if(element.id==id){
        // if(element.is_superuser=="Nhân viên"){
        //   element.is_superuser=false;
        // }else{
        //   element.is_superuser=true;
        // }
        setData1(element);
        // renderProfile(element)
        console.log(element);
      }
    });

  };

  // const renderProfile = (dataa) => ({
  //   render: () =>
  //     <Profile
  //     data={dataa}
  //     ></Profile>
  // });

  const onOpen = async (id) => {
    try {
      const response = await api.price.get(id);
      const values = response.data.data
      setDataIndex(values);
    } catch (error) {
      message.error(messages.ERROR)
    } finally {
    }
    
    setOpen(true);
  };

  const tagStatus = (status) => {
    if(status==true){
      return 'HOẠT ĐỘNG';
    }else{
      return 'KHÓA';
    }
  };

  const tagStatusColor = (status) => {
    if(status==true){
      return 'geekblue';
    }else{
      return 'volcano';
    }
  };

  const onClose = () => {
    setOpen(false);
  };
  //////

  const setIdxBtn = (id) => {
    navigate(paths.price.change(id))
  };
  // const _delete = async (id) => {
  //   try {
  //     const response = await api.price.delete(id)
  //     if (response.data.code == 1) {
  //       message.success(messages.price.SUCCESS_DELETE(id))
  //       navigate(paths.staff.list)
  //       return true
  //     } else {
  //       message.error(messages.staff.ERROR_DELETE(id))
  //     }
  //   } catch (error) {
  //     message.error(messages.ERROR)
  //     console.log('Failed:', error)
  //   }
  //   return false
  // };
  // const setIdxBtnDelete = (id) => {
  //   // _delete(id)
  //   console.log(id)
  // };

  useEffect(() => {
    SetCurrentCountData(props.data.length)
  }, [props.data]);

  useEffect(() => {
    SetCurrentCountData(0)
  }, [props.searchInfo]);

  const handleLoadingChange = (enable) => {
    props.setLoading(enable);
  };

  const renderSearch = () => ({
    render: (text) =>
      <Highlighter
        highlightStyle={{
          backgroundColor: '#ffc069',
          padding: 0,
        }}
        searchWords={[props.searchInfo[0]]}
        autoEscape
        textToHighlight={text ? text.toString() : ''}
      />
  })


  const columns = [
    {
      title: 'Mã bảng giá',
      dataIndex: 'price_list_id',
      key: 'price_list_id',
      sorter: {
        compare: (a, b) => a.price_list_id > b.price_list_id,
        multiple: 1
      },
      defaultSortOrder: 'descend',
      filteredValue: props.searchInfo || null,
      onFilter: (value, record) => {
        return (record.name && record.name.toLowerCase().includes(value.toLowerCase()))
          || (record.price_list_id && record.price_list_id.toString().toLowerCase().includes(value.toLowerCase()))
      },
      ...renderSearch()
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      sorter: {
        compare: (a, b) => a.fullname.toLowerCase().localeCompare(b.fullname.toLowerCase()),
        multiple: 2
      },
      ...renderSearch()
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'start_date',
      key: 'start_date',
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'end_date',
      key: 'end_date',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      // filters: [
      //   {
      //     text: 'HOẠT ĐỘNG',
      //     value: 'true',
      //   },
      //   {
      //     text: 'KHÓA',
      //     value: 'false',
      //   },
      // ],
      // filteredValue: props.filteredInfo.status || null,
      // onFilter: (value, record) => record.status.includes(value),
      render: (status) => (
        <span>  
              <Tag color={tagStatusColor(status)} key={status}>
                {tagStatus(status)}
              </Tag>
        </span>
      ),
    },
    {
      title: '',
      dataIndex: 'price_list_id',
      key: 'price_list_id',
      render: (price_list_id) => (
        <span>
          <a onClick={() => onOpen(price_list_id)} key={price_list_id}><EyeOutlined title='Xem chi tiết' className="site-form-item-icon" style={{ fontSize: '20px' }} /></a>
          <a onClick={() => setIdxBtn(price_list_id)}><FormOutlined title='Chỉnh sửa' className="site-form-item-icon" style={{ fontSize: '20px', marginLeft: '10px' }} /></a>
          </span>
      ),
    },
  ];

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  return (
    <>
      <AntdTable
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectChange
        }}
        columns={columns}
        dataSource={props.data}
        onChange={handleChange}
        scroll={{
          x: 'max-content',
        }}
        sticky
        pagination={{
          total: currentCountData,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Tất cả ${total}`,
        }}
        loading={props.loading} />
        <PriceModal open={open} data={dataIndex} setOpen={setOpen} />
    </>

  );
};

export default StaffTable;