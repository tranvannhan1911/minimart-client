import { SearchOutlined,FormOutlined } from '@ant-design/icons';
import { Button, Space, Table as AntdTable, Input, Tag, Pagination } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import Highlighter from 'react-highlight-words';
import { useNavigate } from 'react-router-dom';
import paths from '../../../utils/paths'
const { Search } = Input;

const UnitTable = (props) => {
  const navigate = useNavigate();
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
  const setIdxBtn = (id) => {
    navigate(paths.unit.change(id))
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
      title: 'Mã đơn vị tính',
      dataIndex: 'id',
      key: 'id',
      sorter: {
        compare: (a, b) => a.id > b.id,
        multiple: 1
      },
      defaultSortOrder: 'descend',
      filteredValue: props.searchInfo || null,
      onFilter: (value, record) => {
        return (record.name && record.name.toLowerCase().includes(value.toLowerCase()))
          || (record.id && record.id.toString().toLowerCase().includes(value.toLowerCase()))
          || (record.note && record.note.toString().toLowerCase().includes(value.toLowerCase()))},
      ...renderSearch(),
    },
    {
      title: 'Tên đơn vị tính',
      dataIndex: 'name',
      key: 'name',
      sorter: {
        compare: (a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
        multiple: 2
      },
      ...renderSearch(),
    },
    {
      title: 'Ghi chú nội bộ',
      dataIndex: 'note',
      key: 'note',
      ...renderSearch(),
    },
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      render: (id) => (
        <span>
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
      loading={props.loading}
      // onRow={(record, rowIndex) => {
      //   return {
      //     onClick: event => {
      //       navigate(paths.unit.change(record.id))
      //     }, // click row
      //     onDoubleClick: event => {
      //       navigate(paths.unit.change(record.id))
      //     }, // double click row
      //     onContextMenu: event => {}, // right button click row
      //     onMouseEnter: event => {}, // mouse enter row
      //     onMouseLeave: event => {}, // mouse leave row
      //   };
      // }}
    />
  );
};

export default UnitTable;