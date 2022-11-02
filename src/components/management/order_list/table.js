import { RollbackOutlined, EyeOutlined, CloseCircleOutlined,SearchOutlined } from '@ant-design/icons';
import { Button, Space, Table as AntdTable, Popconfirm, Tooltip, message, Tag, Input, Typography } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import Highlighter from 'react-highlight-words';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/apis';
import messages from '../../../utils/messages';
import { tagStatus, tagStatusColor } from '../../../utils/util';
import OrderRefundModal from './modal';
import OrderDetailModal from './modal_details';

const OrderTable = (props) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [dataIndex, setDataIndex] = useState({});
  const [idIndex, setIdIndex] = useState("");
  const [currentCountData, SetCurrentCountData] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [wantCancel, setWantCancel] = useState(false);

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
        setIdIndex(id);
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

  const onOrderCancel = async (record) => {
    console.log("onOrderCancel", record)
    try {
      const values = {
        status: "cancel"
      }
      const response = await api.order.update(record.key, values);
      if (response.data.code == 1) {
        message.success("Hủy đơn hàng thành công!");
        props.handleGetData()
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
    if (column == "nhân viên") {
      props.dataSearchStaff(data)
    } else if (column == "mã") {
      props.dataSearchId(data)
    } else if (column == "khách hàng") {
      props.dataSearchCustomer(data)
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
      title: 'Mã hóa đơn',
      dataIndex: 'key',
      key: 'key',
      with: '10%',
      sorter: {
        compare: (a, b) => a.key > b.key,
        // multiple: 1
      },
      filteredValue: props.searchInfo || null,
      onFilter: (value, record) => {
        return (record.customer && record.customer.toLowerCase().includes(value.toLowerCase()))
          || (record.key && record.key.toString().toLowerCase().includes(value.toLowerCase()))
          || (record.user_created && record.user_created.toLowerCase().includes(value.toLowerCase()))
          || (record.total && record.total.toString().toLowerCase().includes(value.toLowerCase()))
      },
      ...renderSearch(),
      ...getColumnSearchProps('mã')
    },
    {
      title: 'Người tạo',
      dataIndex: 'user_created',
      key: 'user_created',
      with: '20%',
      sorter: {
        compare: (a, b) => a.user_created.toLowerCase().localeCompare(b.user_created.toLowerCase()),
        // multiple: 2
      },
      ...renderSearch(),
      ...getColumnSearchProps('nhân viên')
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customer',
      key: 'customer',
      with: '20%',
      ...renderSearch(),
      ...getColumnSearchProps('khách hàng')
    },
    {
      title: 'Ngày bán',
      dataIndex: 'date_created',
      key: 'date_created',
      ...renderSearch(),
      // defaultSortOrder: 'descend',
      // sorter: {
      //   compare: (a, b) => {
      //     var d1 = new Date(a.date_created);
      //     var d2 = new Date(b.date_created);
      //     console.log(d1, d2, d1 > d2)
      //     return d1 > d2
      //   },
      //   // multiple: 1
      // }
    },
    {
      title: 'Khuyến mãi',
      dataIndex: 'final_total',
      key: 'final_total',
      render: (final_total, record) => (
        <Typography>{(record.total-record.final_total)?.toLocaleString()}</Typography>
      ),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'final_total',
      key: 'final_total',
      // sorter: {
      //   compare: (a, b) => a.final_total > b.final_total,
      //   multiple: 1
      // },
      // defaultSortOrder: 'descend',
      render: (final_total, record) => (
        <Typography>{record.final_total?.toLocaleString()}</Typography>
      ),
      // ...renderSearch(),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
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
      dataIndex: 'key',
      key: 'key',
      render: (key, record) => (
        <Space>
          <Button
            type="text"
            onClick={() => {
              
              setWantCancel(false)
              onOpenDetails(key)
            }}
            icon={<EyeOutlined />}></Button>
          {
            record.status != "complete" ? null :
              // <Popconfirm
              //   title="Trả đơn hàng này?"
              //   onConfirm={() => onOpen(key)}
              //   okText="Đồng ý"
              //   okType="danger"
              //   cancelText="Không"
              // >
                <Tooltip placement="top" title="Trả hàng">
                  <Button
                    type="text"
                    icon={<RollbackOutlined />}
                    onClick={() => onOpen(key)}></Button>
                </Tooltip>
              // </Popconfirm>
          }
          {
            record.status != "complete" ? null :
                <Tooltip placement="top" title="Hủy hóa đơn">
                  <Button
                    type="text"
                    icon={<CloseCircleOutlined />}
                    onClick={() => {
                      setWantCancel(true)
                      onOpenDetails(key)
                    }}></Button>
                </Tooltip>
          }
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
      size='small'
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
      <OrderRefundModal
        open={open}
        data={dataIndex}
        setOpen={setOpen}
        idOrder={idIndex}
        handleGetData={props.handleGetData} />
      <OrderDetailModal 
        openDetails={openDetails} 
        data={dataIndex} 
        setOpenDetails={setOpenDetails}
        handleGetData={props.handleGetData} 
        wantCancel={wantCancel}/>
    </>
  );
};

export default OrderTable;