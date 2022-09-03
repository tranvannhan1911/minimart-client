import { SearchOutlined } from '@ant-design/icons';
import { Button, Space, Table as AntdTable, Input, Tag } from 'antd';
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


  // const clearAll = () => {
  //   setFilteredInfo({});
  //   setSortedInfo({});
  // };

  // const setAgeSort = () => {
  //   setSortedInfo({
  //     order: 'descend',
  //     columnKey: 'age',
  //   });
  // };

  const columns = [
    {
      title: 'Mã khách hàng',
      dataIndex: 'customer_id',
      key: 'customer_id',
      sorter: {
        compare: (a, b) => a.customer_id > b.customer_id,
        multiple: 1
      },
      defaultSortOrder: 'descend'
      // sortOrder: () => {
      //   console.log("a", props.sortedInfo)
      //   if(props.sortedInfo.length > 1)
      //     return props.sortedInfo[0].columnKey === 'customer_id' ? props.sortedInfo[0].order : null
      //   return props.sortedInfo.columnKey === 'customer_id' ? props.sortedInfo.order : null
      // },
    },
    {
      title: 'Tên',
      dataIndex: 'fullname',
      key: 'fullname',
      sorter: {
        compare: (a, b) => a.fullname.toLowerCase().localeCompare(b.fullname.toLowerCase()),
        multiple: 2
      },
      // sortOrder: props.sortedInfo[1].columnKey === 'fullname' ? props.sortedInfo[1].order : null,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      filters: [
        {
          text: 'Nam',
          value: 'M',
        },
        {
          text: 'Nữ',
          value: 'F',
        },
        {
          text: 'Không xác định',
          value: 'U',
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
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      AntdTable.SELECTION_ALL,
      AntdTable.SELECTION_INVERT,
      AntdTable.SELECTION_NONE,
      {
        key: 'odd',
        text: 'Select Odd Row',
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return false;
            }

            return true;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
      {
        key: 'even',
        text: 'Select Even Row',
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return true;
            }

            return false;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
    ],
  };
//   const onSearch = (value) => console.log(value);

  return (
    <AntdTable 
      rowSelection={rowSelection} 
      columns={columns} 
      dataSource={props.data} 
      onChange={handleChange}
      scroll={{
          y: 240,
      }} 
      loading={props.loading}
      onRow={(record, rowIndex) => {
        return {
          onClick: event => {
            console.log("onClick", record, rowIndex)
            navigate("/quan-ly/khach-hang/"+record.customer_id)
          }, // click row
          onDoubleClick: event => {}, // double click row
          onContextMenu: event => {}, // right button click row
          onMouseEnter: event => {}, // mouse enter row
          onMouseLeave: event => {}, // mouse leave row
        };
      }}
    />
  );
};

export default CustomerTable;