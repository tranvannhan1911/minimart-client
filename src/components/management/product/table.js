import { SearchOutlined } from '@ant-design/icons';
import { Button, Space, Table as AntdTable, Input, Tag, Pagination } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import Highlighter from 'react-highlight-words';
import { useNavigate } from 'react-router-dom';
import paths from '../../../utils/paths'
const { Search } = Input;

const ProductTable = (props) => {
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
      title: 'Mã sản phẩm',
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
      ...renderSearch()
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      sorter: {
        compare: (a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
        multiple: 2
      },
      ...renderSearch()
    },
    {
      title: 'Code sản phẩm',
      dataIndex: 'product_code',
      key: 'product_code',
      ...renderSearch()
    },
    {
      title: 'Mã vạch',
      dataIndex: 'barcode',
      key: 'barcode',
      ...renderSearch()
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ...renderSearch()
    },
    {
      title: 'Nhóm sản phẩm',
      dataIndex: 'product_groups',
      key: 'product_groups',
      filters: props.dataProductGroups.map(elm => {
        const _elm = {
          "text": elm.name,
          "value": elm.name,
        }
        return _elm
      }),
      filteredValue: props.filteredInfo.product_groups || null,
      onFilter: (value, record) => record.product_groups && record.product_groups.toString().includes(value),
      render: (groups) => (
        <span>
          {groups.map((group) => {
            let color = 'geekblue';
  
            return (
              <Tag color={color} key={group}>
                {group.toString().toUpperCase()}
              </Tag>
            );
          })}
        </span>
      ),
    },
    {
      title: 'Ghi chú nội bộ',
      dataIndex: 'note',
      key: 'note',
      ...renderSearch()
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
        total: currentCountData,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `Tất cả ${total}`,
      }}
      loading={props.loading}
      onRow={(record, rowIndex) => {
        return {
          onClick: event => {
            navigate(paths.product.change(record.id))
          }, // click row
          onDoubleClick: event => {
            navigate(paths.product.change(record.id))
          }, // double click row
          onContextMenu: event => {}, // right button click row
          onMouseEnter: event => {}, // mouse enter row
          onMouseLeave: event => {}, // mouse leave row
        };
      }}
    />
  );
};

export default ProductTable;