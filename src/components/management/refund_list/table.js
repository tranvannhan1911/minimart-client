import { CloseCircleOutlined, EyeOutlined,  } from '@ant-design/icons';
import { Button, Space, Table as AntdTable, Input, Tag, 
  message, Popconfirm, Tooltip } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import Highlighter from 'react-highlight-words';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/apis'
import messages from '../../../utils/messages'
import OrderRefundDetailModal from './modal_details';
// import OrderModal from './modal';

const RefundTable = (props) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [dataIndex, setDataIndex] = useState("");
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

  // const tagStatus = (status) => {
  //   if (status == 'pending') {
  //     return 'CHỜ XÁC NHẬN';
  //   } else if (status == 'complete') {
  //     return 'HOÀN THÀNH';
  //   } else if (status == 'cancel') {
  //     return 'HỦY';
  //   }
  // };

  // const tagStatusColor = (status) => {
  //   if (status == 'pending') {
  //     return 'processing';
  //   } else if (status == 'complete') {
  //     return 'success';
  //   } else {
  //     return 'warning';
  //   }

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

  const onOpen = async (id) => {
    props.data.forEach(element => {
      if (element.key == id) {
        setDataIndex(element);
        setOpen(true);
      }
    });
  };

  const onCancel =  (id) => {
    props.data.forEach(async element => {
      if (element.key == id) {
        const response = await api.order_refund.update(element.key, {status: "cancel"})
        if(response.data.code == 1){
          message.success("Cập nhật trạng thái thành công!")
          props.handleGetData()
        }else{
          message.error(messages.ERROR_REFRESH)
        }
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

  const tagStatusColor = (status) => {
    if (status == 'pending') {
      return 'processing';
    } else if (status == 'complete') {
      return 'success';
    } else {
      return 'warning';
    }
  };

  const tagStatus = (status) => {
    if(status == "complete")
      return "Hoàn thành"
    else 
      return "Đã hủy"
  }

  
  const columns = [
    {
      title: 'Mã đơn trả hàng',
      dataIndex: 'key',
      key: 'key',
      // with:'10%',
      sorter: {
        compare: (a, b) => a.id > b.id,
        multiple: 1
      },
      defaultSortOrder: 'descend',
      filteredValue: props.searchInfo || null,
      onFilter: (value, record) => {
        return (record.customer && record.customer.toLowerCase().includes(value.toLowerCase()))
          || (record.key && record.key.toString().toLowerCase().includes(value.toLowerCase()))
          || (record.user_created && record.user_created.toString().toLowerCase().includes(value.toLowerCase()))
      },
      ...renderSearch(),
    },
    {
      title: 'Người tạo',
      dataIndex: 'user_created',
      key: 'user_created',
      // with:'20%',
      sorter: {
        compare: (a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
        multiple: 2
      },
      ...renderSearch(),
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customer',
      key: 'customer',
      // with:'20%',
      ...renderSearch(),
    },
    {
      title: 'Ngày trả hàng',
      dataIndex: 'date_created',
      key: 'date_created',
      ...renderSearch(),
    },
    // {
    //   title: 'Tổng tiền',
    //   dataIndex: 'total',
    //   key: 'total',
    //   ...renderSearch(),
    // },
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
            onClick={() => onOpen(key)}
            icon={<EyeOutlined/>}></Button>
          {record.status == "complete" ? 
          <Popconfirm
            title="Hủy đơn trả hàng này?"
            onConfirm={() => onCancel(key)}
            okText="Đồng ý"
            okType="danger"
            cancelText="Không"
          >
            <Tooltip placement="right" title="Trả hàng">
              <Button 
                type="text" 
                icon={<CloseCircleOutlined style={{color: 'red'}}/>}></Button>  
            </Tooltip>
          </Popconfirm>
            
          : null}
          
          
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
      // expandable={{
      //   expandedRowRender: (record) => (

      //     <Table columns={columnsCon} dataSource={record.details}>
      //     </Table>

      //   ),
      //   rowExpandable: (record) => record.id !== 'Not Expandable',
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
      <OrderRefundDetailModal open={open} data={dataIndex} setOpen={setOpen} />      </>
  );
};

export default RefundTable;