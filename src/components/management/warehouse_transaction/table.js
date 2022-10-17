import { SearchOutlined } from '@ant-design/icons';
import {
  EyeOutlined, FormOutlined
} from '@ant-design/icons'
import { Table as AntdTable, Input, Tag, Space,Button } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import Highlighter from 'react-highlight-words';
import { useNavigate } from 'react-router-dom';
import paths from '../../../utils/paths'
import WarehouseTransactionModal from './modal';
const { Search } = Input;

const WarehouseTransactionTable = (props) => {
  const navigate = useNavigate();
  const [dataIndex, setDataIndex] = useState("");
  const [open, setOpen] = useState(false);
  // const [isStatus, setStatus] = useState(false);
  const [currentCountData, SetCurrentCountData] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const handleChange = (pagination, filters, sorter, extras) => {
    console.log('Various parameters\n', pagination, filters, sorter);
    props.setFilteredInfo(filters);
    props.setSortedInfo(sorter);
    SetCurrentCountData(extras.currentDataSource.length)
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

  const onOpen = async (id) => {
    props.data.forEach(element => {
      if(element.id==id){
        // if(element.is_superuser=="Nhân viên"){
        //   element.is_superuser=false;
        // }else{
        //   element.is_superuser=true;
        // }
        setDataIndex(element);
        // renderProfile(element)
        setOpen(true);
        console.log(element);
      }
    });
    
    
  };

  const onClose = () => {
    setOpen(false);
  };
  //////

  const setIdxBtn = (id) => {
    navigate(paths.staff.change(id))
  };

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
      title: 'Mã',
      dataIndex: 'id',
      key: 'id',
      sorter: {
        compare: (a, b) => a.id > b.id,
        multiple: 1
      },
      defaultSortOrder: 'descend',
      filteredValue: props.searchInfo || null,
      onFilter: (value, record) => {
        return (record.product && record.product.toLowerCase().includes(value.toLowerCase()))
          || (record.id && record.id.toString().toLowerCase().includes(value.toLowerCase()))
      },
      ...renderSearch(),
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'product',
      key: 'product',
      sorter: {
        compare: (a, b) => a.product.toLowerCase().localeCompare(b.product.toLowerCase()),
        multiple: 2
      },
      ...renderSearch(),
    },
    // {
    //   title: 'Số lượng',
    //   dataIndex: 'reference',
    //   key: 'phone',
    // },
    {
      title: 'Số lượng thay đổi',
      dataIndex: 'change',
      key: 'gender',
    },
    {
      title: 'Loại thay đổi',
      dataIndex: 'type',
      key: 'type',
      filters: [
        {
          text: 'Bán hàng',
          value: 'Bán hàng',
        },
        {
          text: 'Hủy hóa đơn',
          value: 'Hủy hóa đơn',
        },
        {
          text: 'Trả hàng',
          value: 'Trả hàng',
        },
        {
          text: 'Khuyến mãi',
          value: 'Khuyến mãi',
        },
        {
          text: 'Nhập hàng',
          value: 'Nhập hàng',
        },
        {
          text: 'Hủy nhập hàng',
          value: 'Hủy nhập hàng',
        },
        {
          text: 'Kiểm kê',
          value: 'Kiểm kê',
        },
        {
          text: 'Hủy kiểm kê',
          value: 'Hủy kiểm kê',
        },
      ],
      filteredValue: props.filteredInfo.type || null,
      onFilter: (value, record) => record.type.includes(value),
    },
    {
      title: 'Ngày thay đổi',
      dataIndex: 'date_created',
      key: 'date_created',
    },
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      render: (id) => (
        <span>
          <a onClick={() => onOpen(id)} key={id}><EyeOutlined title='Xem chi tiết' className="site-form-item-icon" style={{ fontSize: '20px' }} /></a>
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
        // rowSelection={{
        //   selectedRowKeys,
        //   onChange: onSelectChange
        // }}
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
      <WarehouseTransactionModal open={open} data={dataIndex} setOpen={setOpen} />

    </>

  );
};

export default WarehouseTransactionTable;