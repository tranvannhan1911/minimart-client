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
import InventoryReceivingModal from './modal';
const { Search } = Input;
// const idstaff=0;

const InventoryReceivingTable = (props) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [dataIndex, setDataIndex] = useState("");
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  // const [isStatus, setStatus] = useState(false);
  const [currentCountData, SetCurrentCountData] = useState(0);

  const handleChange = (pagination, filters, sorter, extras) => {
    console.log('Various parameters\n', pagination, filters, sorter);
    props.setFilteredInfo(filters);
    props.setSortedInfo(sorter);
    SetCurrentCountData(extras.currentDataSource.length)
  };

  
  const onOpen = (id) => {
    props.data.forEach(element => {
      if(element.id==id){
        console.log(element);
        element.details.forEach(elementt => {
          elementt.product=elementt.product.name;
        });
        // if(element.status=='pending'){
        //   element.status="Chờ xác nhận";
        // }else if(element.status=='complete'){
        //   element.status="Hoàn thành";
        // }else{
        //   element.status="Hủy";
        // }
        // element.details = element.details.map(elm =>{
        //   elm.product=elm.product.name;
        //   return elm;
        
        // })      
        setDataIndex(element);
        // renderProfile(element)
        setOpen(true);
        console.log(element);
      }
    });
  };

  const tagStatus = (status) => {
    if(status=='pending'){
      return 'CHỜ XÁC NHẬN';
    }else if(status=='complete'){
      return 'HOÀN THÀNH';
    }else if(status=='cancel'){
      return 'HỦY';
    }
  };

  const tagStatusColor = (status) => {
    if(status=='pending'){
      return 'processing';
    }else if(status=='complete'){
      return 'success';
    }else{
      return 'warning';
    }
    // if(status==true){
    //   return 'geekblue';
    // }else{
    //   return 'volcano';
    // }
  };

  const onClose = () => {
    setOpen(false);
  };
  //////

  const setIdxBtn = (id) => {
    navigate(paths.inventory_receiving.change(id))
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

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div
        style={{
          padding: 8,
        }}
      >
        <Input
          ref={searchInput}
          placeholder={`Tìm kiếm`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Tìm kiếm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Quay lại
          </Button>
          {/* <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button> */}
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1890ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });


  const columns = [
    {
      title: 'Mã phiếu nhập hàng',
      dataIndex: 'id',
      key: 'id',
      sorter: {
        compare: (a, b) => a.id > b.id,
        multiple: 1
      },
      defaultSortOrder: 'descend',
      filteredValue: props.searchInfo || null,
      onFilter: (value, record) => {
        return (record.supplier && record.supplier.toLowerCase().includes(value.toLowerCase()))
          || (record.id && record.id.toString().toLowerCase().includes(value.toLowerCase()))
      },
      ...renderSearch(),
      ...getColumnSearchProps('id'),
    },
    {
      title: 'Nhà cung cấp',
      dataIndex: 'supplier',
      key: 'name',
      sorter: {
        compare: (a, b) => a.supplier.toLowerCase().localeCompare(b.supplier.toLowerCase()),
        multiple: 2
      },
      ...renderSearch(),
      ...getColumnSearchProps('supplier'),
    },
    {
      title: 'Ngày nhập',
      dataIndex: 'total',
      key: 'start_date',
      ...getColumnSearchProps('total'),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      key: 'total',
      sorter: {
        compare: (a, b) => a.total > b.total,
        multiple: 1
      },
      ...getColumnSearchProps('total'),
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
      dataIndex: 'id',
      key: 'id',
      render: (id) => (
        <span>
          <a onClick={() => onOpen(id)} key={id}><EyeOutlined title='Xem chi tiết' className="site-form-item-icon" style={{ fontSize: '20px' }} /></a>
          <a onClick={() => setIdxBtn(id)}><FormOutlined title='Chỉnh sửa' className="site-form-item-icon" style={{ fontSize: '20px', marginLeft: '10px' }} /></a>
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
        <InventoryReceivingModal open={open} data={dataIndex} setOpen={setOpen} />
    </>

  );
};

export default InventoryReceivingTable;