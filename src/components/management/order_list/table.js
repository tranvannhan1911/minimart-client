import { RollbackOutlined, EyeOutlined, FormOutlined } from '@ant-design/icons';
import { Button, Space, Table as AntdTable, Input, Tag, Pagination, message, Table, Popconfirm, Tooltip } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import Highlighter from 'react-highlight-words';
import { useNavigate } from 'react-router-dom';
import paths from '../../../utils/paths'
import api from '../../../api/apis'
import messages from '../../../utils/messages'
import OrderRefundModal from './modal';
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
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customer',
      key: 'customer',
      with:'20%',
      ...renderSearch(),
    },
    {
      title: 'Ngày bán',
      dataIndex: 'date_created',
      key: 'date_created',
      ...renderSearch(),
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
    },
    
    {
      title: '',
      dataIndex: 'key',
      key: 'key',
      render: (key) => (
        <Space>
          <Button 
            type="text" 
            onClick={() => onOpenDetails(key)}
            icon={<EyeOutlined/>}></Button>
          <Popconfirm
            title="Trả đơn hàng này?"
            onConfirm={() => onOpen(key)}
            okText="Đồng ý"
            okType="danger"
            cancelText="Không"
          >
            <Tooltip placement="right" title="Trả hàng">
              <Button 
                type="text" 
                icon={<RollbackOutlined  style={{color: 'red'}}/>}></Button>
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
      <OrderRefundModal 
        open={open} 
        data={dataIndex} 
        setOpen={setOpen} 
        idOrder={idIndex}
        handleGetData={props.handleGetData}/>
      <OrderDetailModal openDetails={openDetails} data={dataIndex} setOpenDetails={setOpenDetails} />
      </>
  );
};

export default OrderTable;