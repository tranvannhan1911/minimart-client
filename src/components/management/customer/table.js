import { SearchOutlined } from '@ant-design/icons';
import { Button, Space, Table as AntdTable, Input, Tag, Pagination } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import Highlighter from 'react-highlight-words';
import { useNavigate } from 'react-router-dom';
const { Search } = Input;



const CustomerTable = (props) => {
  const navigate = useNavigate();

  const handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters\n', pagination, filters, sorter);
    props.setFilteredInfo(filters); 
    props.setSortedInfo(sorter);
  };

  // useEffect(() => {
    
  //   console.log("handleChange", filteredInfo)
  //   console.log("gender", filteredInfo.gender)
  // }, [filteredInfo]);

  const handleLoadingChange = (enable) => {
    props.setLoading(enable);
  };


  const renderSearch = () => ({render: (text) =>
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
      title: 'Mã khách hàng',
      dataIndex: 'customer_id',
      key: 'customer_id',
      sorter: {
        compare: (a, b) => a.customer_id > b.customer_id,
        multiple: 1
      },
      defaultSortOrder: 'descend',
      filteredValue: props.searchInfo || null,
      onFilter: (value, record) => {
        return record.fullname.toLowerCase().includes(value.toLowerCase())
          || record.customer_id.toString().toLowerCase().includes(value.toLowerCase())
          || record.phone.toLowerCase().includes(value.toLowerCase())},
      ...renderSearch()
    },
    {
      title: 'Tên',
      dataIndex: 'fullname',
      key: 'fullname',
      sorter: {
        compare: (a, b) => a.fullname.toLowerCase().localeCompare(b.fullname.toLowerCase()),
        multiple: 2
      },
      ...renderSearch()
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      ...renderSearch()
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
      title: 'Nhóm khách hàng',
      dataIndex: 'customer_group',
      key: 'customer_group',
      filters: props.data_customer_group.map(elm => {
        const _elm = {
          "text": elm.name,
          "value": elm.name,
        }
        return _elm
      }),
      filteredValue: props.filteredInfo.customer_group || null,
      onFilter: (value, record) => record.customer_group && record.customer_group.toString().includes(value),
      render: (groups) => (
        <span>
          {groups.map((group) => {
            let color = 'geekblue';
  
            return (
              <Tag color={color} key={group}>
                {group.toUpperCase()}
              </Tag>
            );
          })}
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
        total: props.data.length,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `Tất cả ${total}`,
      }}
      loading={props.loading}
      onRow={(record, rowIndex) => {
        return {
          onClick: event => {
            // let _selectedRowKeys = Object.assign([], selectedRowKeys)
            // if(selectedRowKeys.indexOf(record.customer_id) !== -1){
            //   _selectedRowKeys.splice(_selectedRowKeys.indexOf(record.customer_id), 1)
            // }else{
            //   _selectedRowKeys.push(record.customer_id)
            // }
            // setSelectedRowKeys(_selectedRowKeys)
          }, // click row
          onDoubleClick: event => {
            console.log("onClick", record, rowIndex)
            navigate("/quan-ly/khach-hang/"+record.customer_id)
          }, // double click row
          onContextMenu: event => {}, // right button click row
          onMouseEnter: event => {}, // mouse enter row
          onMouseLeave: event => {}, // mouse leave row
        };
      }}
    />
  );
};

export default CustomerTable;