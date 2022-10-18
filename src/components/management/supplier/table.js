import { SearchOutlined, FormOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Space, Table as AntdTable, Input, Tag, Pagination } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import Highlighter from 'react-highlight-words';
import { useNavigate } from 'react-router-dom';
import SupplierModal from './modal';
import paths from '../../../utils/paths'
const { Search } = Input;

const SupplierTable = (props) => {
  const navigate = useNavigate();
  const [currentCountData, SetCurrentCountData] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [open, setOpen] = useState(false);
  const [dataIndex, setDataIndex] = useState("");

  const handleChange = (pagination, filters, sorter, extras) => {
    console.log('Various parameters\n', pagination, filters, sorter);
    props.setFilteredInfo(filters);
    props.setSortedInfo(sorter);
    SetCurrentCountData(extras.currentDataSource.length)
  };

  const onOpen = async (id) => {
    props.data.forEach(element => {
      if (element.id == id) {
        console.log(element)
        setDataIndex(element);
        // renderProfile(element)
        setOpen(true);
        console.log(element);
      }
    });
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
  const setIdxBtn = (id) => {
    navigate(paths.supplier.change(id))
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

  ///////////////////

  const handleSearch = (data, column) => {
    if (column == "tên") {
      props.dataSearchName(data)
    } else if (column == "mã") {
      props.dataSearchId(data)
    } else if (column == "số điện thoại") {
      props.dataSearchPhone(data)
    } else if (column == "email") {
      props.dataSearchEmail(data)
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
      title: 'Mã nhà cung cấp',
      dataIndex: 'code',
      key: 'code',
      sorter: {
        compare: (a, b) => a.id > b.id,
        multiple: 1
      },
      defaultSortOrder: 'descend',
      filteredValue: props.searchInfo || null,
      onFilter: (value, record) => {
        return (record.name && record.name.toLowerCase().includes(value.toLowerCase()))
          || (record.code && record.code.toString().toLowerCase().includes(value.toLowerCase()))
          || (record.phone && record.phone.toString().toLowerCase().includes(value.toLowerCase()))
          || (record.email && record.email.toString().toLowerCase().includes(value.toLowerCase()))
          || (record.address && record.address.toString().toLowerCase().includes(value.toLowerCase()))
          || (record.note && record.note.toString().toLowerCase().includes(value.toLowerCase()))
      },
      ...renderSearch(),
      ...getColumnSearchProps('mã')
    },
    {
      title: 'Tên nhà cung cấp',
      dataIndex: 'name',
      key: 'name',
      sorter: {
        compare: (a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
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
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      ...renderSearch(),
      ...getColumnSearchProps('email')
    },
    // {
    //   title: 'Địa chỉ',
    //   dataIndex: 'address',
    //   key: 'address',
    //   ...renderSearch(),
    //   render: (address, record) => (
    //     <span>
    //       {`${record.address}, ${record.address}`}
    //     </span>
    //   ),
    // },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      ...renderSearch(),
    },
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      render: (id) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined title='Xem chi tiết' />}
            onClick={() => onOpen(id)} ></Button>
          <Button
            type="text"
            icon={<FormOutlined title='Chỉnh sửa' />}
            onClick={() => setIdxBtn(id)} ></Button>
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
    <><AntdTable
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
      loading={props.loading} /><SupplierModal open={open} data={dataIndex} setOpen={setOpen} /></>
  );
};

export default SupplierTable;