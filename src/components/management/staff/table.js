import { SearchOutlined } from '@ant-design/icons';
import {
  EyeOutlined, FormOutlined
} from '@ant-design/icons'
import { Table as AntdTable, Input, Tag, Space,Button } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import Highlighter from 'react-highlight-words';
import { useNavigate } from 'react-router-dom';
import paths from '../../../utils/paths'
import StaffModal from './modal';
const { Search } = Input;

const StaffTable = (props) => {
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
        setDataIndex(element);
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
      title: 'Mã nhân viên',
      dataIndex: 'id',
      key: 'id',
      sorter: {
        compare: (a, b) => a.id > b.id,
        multiple: 1
      },
      defaultSortOrder: 'descend',
      filteredValue: props.searchInfo || null,
      onFilter: (value, record) => {
        return (record.fullname && record.fullname.toLowerCase().includes(value.toLowerCase()))
          || (record.id && record.id.toString().toLowerCase().includes(value.toLowerCase()))
          || (record.phone && record.phone.toLowerCase().includes(value.toLowerCase()))
      },
      ...renderSearch(),
      ...getColumnSearchProps('id'),
    },
    {
      title: 'Tên',
      dataIndex: 'fullname',
      key: 'fullname',
      sorter: {
        compare: (a, b) => a.fullname.toLowerCase().localeCompare(b.fullname.toLowerCase()),
        multiple: 2
      },
      ...renderSearch(),
      ...getColumnSearchProps('fullname'),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      ...renderSearch(),
      ...getColumnSearchProps('phone'),
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      filters: [
        {
          text: 'Nam',
          value: 'Nam',
        },
        {
          text: 'Nữ',
          value: 'Nữ',
        },
        {
          text: 'Không xác định',
          value: 'Không xác định',
        },

      ],
      filteredValue: props.filteredInfo.gender || null,
      onFilter: (value, record) => record.gender.includes(value),
    },
    {
      title: 'Vị trí',
      dataIndex: 'is_superuser',
      key: 'is_superuser',
      filters: [
        {
          text: 'Quản lý',
          value: 'Quản lý',
        },
        {
          text: 'Nhân viên',
          value: 'Nhân viên',
        },
      ],
      filteredValue: props.filteredInfo.is_superuser || null,
      onFilter: (value, record) => record.is_superuser.includes(value),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (is_active) => (
        <span>  
              <Tag color={tagStatusColor(is_active)} key={is_active}>
                {tagStatus(is_active)}
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
      <StaffModal open={open} data={dataIndex} setOpen={setOpen} />

    </>

  );
};

export default StaffTable;