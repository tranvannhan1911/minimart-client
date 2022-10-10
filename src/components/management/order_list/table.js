import { SearchOutlined, EyeOutlined, FormOutlined } from '@ant-design/icons';
import { Button, Space, Table as AntdTable, Input, Tag, Pagination, message, Table } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import Highlighter from 'react-highlight-words';
import { useNavigate } from 'react-router-dom';
import paths from '../../../utils/paths'
import api from '../../../api/apis'
import messages from '../../../utils/messages'
import OrderModal from './modal';
import OrderDetailModal from './modal_details';
const { Search } = Input;

const OrderTable = (props) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [dataIndex, setDataIndex] = useState("");
  const [idIndex, setIdIndex] = useState("");
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

  useEffect(() => {
    SetCurrentCountData(props.data.length)
  }, [props.data]);

  useEffect(() => {
    SetCurrentCountData(0)
  }, [props.searchInfo]);

  const handleLoadingChange = (enable) => {
    props.setLoading(enable);
  };

  const onOpen = async (id) => {
    props.data.forEach(element => {
      if (element.key == id) {
        setDataIndex(element);
        setIdIndex(element.id);
        setOpen(true);
      }
    });
  };

  const onOpenDetails = async (id) => {
    props.data.forEach(element => {
      if (element.key == id) {
        setDataIndex(element);
        setOpenDetails(true);
        console.log(element)
      }
    });
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
      title: 'Mã hóa đơn',
      dataIndex: 'key',
      key: 'key',
      with:'10%',
      sorter: {
        compare: (a, b) => a.key > b.key,
        multiple: 1
      },
      defaultSortOrder: 'descend',
      filteredValue: props.searchInfo || null,
      onFilter: (value, record) => {
        return (record.customer && record.customer.toLowerCase().includes(value.toLowerCase()))
          || (record.key && record.key.toString().toLowerCase().includes(value.toLowerCase()))
          || (record.user_created && record.user_created.toLowerCase().includes(value.toLowerCase()))
          || (record.total && record.total.toString().toLowerCase().includes(value.toLowerCase())) 
      },
      ...renderSearch(),
      ...getColumnSearchProps('key'),
    },
    {
      title: 'Người tạo',
      dataIndex: 'user_created',
      key: 'user_created',
      with:'20%',
      sorter: {
        compare: (a, b) => a.user_created.toLowerCase().localeCompare(b.user_created.toLowerCase()),
        multiple: 2
      },
      ...renderSearch(),
      ...getColumnSearchProps('user_created'),
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customer',
      key: 'customer',
      with:'20%',
      ...renderSearch(),
      ...getColumnSearchProps('customer'),
    },
    {
      title: 'Ngày bán',
      dataIndex: 'date_created',
      key: 'date_created',
      ...renderSearch(),
      ...getColumnSearchProps('date_created'),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'final_total',
      key: 'final_total',
      sorter: {
        compare: (a, b) => a.final_total > b.final_total,
        multiple: 1
      },
      defaultSortOrder: 'descend',
      ...renderSearch(),
      ...getColumnSearchProps('final_total'),
    },
    
    {
      title: '',
      dataIndex: 'key',
      key: 'key',
      with:'10%',
      render: (key) => (
        <span>
          <Button type="primary" onClick={() => onOpenDetails(key)}>
            Xem chi tiết
          </Button>
          <Button type="primary" style={{marginLeft:'10px'}} danger onClick={() => onOpen(key)}>
            Trả hàng
          </Button>
          
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
    <><AntdTable
      // rowSelection={{
      //   selectedRowKeys,
      //   onChange: onSelectChange
      // }}
      bordered
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
      <OrderModal open={open} data={dataIndex} setOpen={setOpen} idOrder={idIndex}/>
      <OrderDetailModal openDetails={openDetails} data={dataIndex} setOpenDetails={setOpenDetails} />
      </>
  );
};

export default OrderTable;