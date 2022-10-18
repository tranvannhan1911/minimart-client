
import {
  EyeOutlined, FormOutlined, ClearOutlined, SearchOutlined
} from '@ant-design/icons'
import { Table as AntdTable, Input, Tag, Popconfirm, Tooltip, Button, Space, message } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import Highlighter from 'react-highlight-words';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/apis';
import paths from '../../../utils/paths'
import StaffModal from './modal';
import messages from '../../../utils/messages';

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

  const onResetPassword = async (record) => {
    console.log("onResetPassword", record)
    try {
      const response = await api.staff.reset_password(record.key);
      if (response.data.code == 1) {
        message.success("Đặt lại mật khẩu thành công!");
      } else {
        message.error(response.data.message.toString())
      }
    } catch (error) {
      message.error(messages.ERROR)
      console.log('Failed:', error)
    }
  }

  ///////////////////

  const handleSearch = (data, column) => {
    if (column == "tên") {
      props.dataSearchName(data)
    } else if (column == "mã") {
      props.dataSearchId(data)
    } else if (column == "số điện thoại") {
      props.dataSearchPhone(data)
    }
  };
  const handleReset = (clearFilters) => {
    props.clearFiltersAndSort()
    clearFilters();
    setSearchText('');

  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div
        style={{
          padding: 8,
        }}
      >
        <Input
          ref={searchInput}
          placeholder={`Tìm kiếm ${dataIndex}`}
          value={searchText}
          onChange={(e) => { handleSearch(e.target.value, dataIndex); setSearchText(e.target.value);setSelectedKeys(e.target.value ? [e.target.value] : []) }}
          onPressEnter={(e) => handleSearch(e.target.value, dataIndex,selectedKeys, confirm)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>

          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Quay lại
          </Button>

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
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });
  //////////////////

  const columns = [
    {
      title: 'Mã nhân viên',
      dataIndex: 'code',
      key: 'code',
      sorter: {
        compare: (a, b) => a.id > b.id,
        multiple: 1
      },
      defaultSortOrder: 'descend',
      filteredValue: props.searchInfo || null,
      onFilter: (value, record) => {
        return (record.fullname && record.fullname.toLowerCase().includes(value.toLowerCase()))
          || (record.code && record.code.toString().toLowerCase().includes(value.toLowerCase()))
          || (record.phone && record.phone.toLowerCase().includes(value.toLowerCase()))
      },
      ...renderSearch(),
      ...getColumnSearchProps('mã')
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
      ...getColumnSearchProps('tên')
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      ...renderSearch(),
      ...getColumnSearchProps('số điện thoại')
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
      dataIndex: 'is_manager',
      key: 'is_manager',
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
      filteredValue: props.filteredInfo.is_manager || null,
      onFilter: (value, record) => record.is_manager.includes(value),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'is_active',
      key: 'is_active',
      filters: [
        {
          text: 'HOẠT ĐỘNG',
          value: 'true',
        },
        {
          text: 'KHÓA',
          value: 'false',
        },
      ],
      filteredValue: props.filteredInfo.is_active || null,
      onFilter: (value, record) => record.is_active.toString().includes(value),
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
      render: (id, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined title='Xem chi tiết'/>}
            onClick={() => onOpen(id)} ></Button>
          <Button
            type="text"
            icon={<FormOutlined title='Chỉnh sửa'/>}
            onClick={() => setIdxBtn(id)} ></Button>
          
          <Popconfirm
                title="Đặt lại mật khẩu của nhân viên này?"
                onConfirm={() => onResetPassword(record)}
                okText="Đồng ý"
                okType="danger"
                cancelText="Không"
              >
                <Tooltip placement="right" title="Đặt mật khẩu">
                  <Button
                    type="text"
                    icon={<ClearOutlined style={{ color: 'red' }} />}></Button>
                </Tooltip>
              </Popconfirm>
        </Space>
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