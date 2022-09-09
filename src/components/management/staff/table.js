import { SearchOutlined } from '@ant-design/icons';
import { Button, Space, Table as AntdTable, Input, Tag, Pagination } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import Highlighter from 'react-highlight-words';
import { useNavigate } from 'react-router-dom';
import paths from '../../../utils/paths'
const { Search } = Input;



const StaffTable = (props) => {
  const navigate = useNavigate();
  const [currentCountData, SetCurrentCountData] = useState(0);

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
          || (record.phone && record.phone.toLowerCase().includes(value.toLowerCase()))},
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
    }
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
        total: currentCountData,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `Tất cả ${total}`,
      }}
      loading={props.loading}
      onRow={(record, rowIndex) => {
        return {
          onClick: event => {
            // let _selectedRowKeys = Object.assign([], selectedRowKeys)
            // if(selectedRowKeys.indexOf(record.id) !== -1){
            //   _selectedRowKeys.splice(_selectedRowKeys.indexOf(record.id), 1)
            // }else{
            //   _selectedRowKeys.push(record.id)
            // }
            // setSelectedRowKeys(_selectedRowKeys)
            console.log("onClick", record, rowIndex)
            navigate(paths.staff.change(record.id))
          }, // click row
          onDoubleClick: event => {
            console.log("onClick", record, rowIndex)
            navigate(paths.staff.change(record.id))
          }, // double click row
          onContextMenu: event => {}, // right button click row
          onMouseEnter: event => {}, // mouse enter row
          onMouseLeave: event => {}, // mouse leave row
        };
      }}
    />
  );
};

export default StaffTable;