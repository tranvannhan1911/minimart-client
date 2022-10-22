import { FormOutlined,EyeOutlined,SearchOutlined } from '@ant-design/icons';
import { Table as AntdTable,Button, Input, Space } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import Highlighter from 'react-highlight-words';
import { useNavigate } from 'react-router-dom';
import paths from '../../../utils/paths'
import ShowForPermission from '../../basic/permission';
import ProductGroupModal from './modal';

const ProductGroupTable = (props) => {
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
      if(element.id==id){
        setDataIndex(element);
        setOpen(true);
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
    navigate(paths.product_group.change(id))
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
      title: 'Mã nhóm sản phẩm',
      dataIndex: 'product_group_code',
      key: 'product_group_code',
      // sorter: {
      //   compare: (a, b) => a.id > b.id,
      //   multiple: 1
      // },
      // defaultSortOrder: 'descend',
      filteredValue: props.searchInfo || null,
      onFilter: (value, record) => {
        return (record.name && record.name.toLowerCase().includes(value.toLowerCase()))
          || (record.id && record.id.toString().toLowerCase().includes(value.toLowerCase()))
          || (record.product_group_code && record.product_group_code.toString().toLowerCase().includes(value.toLowerCase()))
          || (record.note && record.note.toString().toLowerCase().includes(value.toLowerCase()))
          || (record.description && record.description.toLowerCase().includes(value.toLowerCase()))
      },
      ...renderSearch(),
      ...getColumnSearchProps('mã')
    },
    {
      title: 'Tên nhóm sản phẩm',
      dataIndex: 'name',
      key: 'name',
      sorter: {
        compare: (a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
        multiple: 2
      },
      ...renderSearch(),
      ...getColumnSearchProps('tên')
    },
    // {
    //   title: 'Code nhóm sản phẩm',
    //   dataIndex: 'product_group_code',
    //   key: 'product_group_code',
    //   ...renderSearch(),
    // },
    // {
    //   title: 'Mô tả',
    //   dataIndex: 'description',
    //   key: 'description',
    //   ...renderSearch(),
    //   ...getColumnSearchProps('description'),
    // },
    // {
    //   title: 'Ghi chú nội bộ',
    //   dataIndex: 'note',
    //   key: 'note',
    //   ...renderSearch(),
    //   ...getColumnSearchProps('note'),
    // },
    {
      title: '',
      dataIndex: 'id',
      width: '10%',
      key: 'id',
      render: (id) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined title='Xem chi tiết' />}
            onClick={() => onOpen(id)} ></Button>
            
          <ShowForPermission>
            <Button
              type="text"
              icon={<FormOutlined title='Chỉnh sửa' />}
              onClick={() => setIdxBtn(id)} ></Button>
          </ShowForPermission>
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
      <ProductGroupModal open={open} data={dataIndex} setOpen={setOpen} /></>
    // onRow={(record, rowIndex) => {
    //   return {
    //     onClick: event => {
    //       navigate(paths.product_group.change(record.id))
    //     }, // click row
    //     onDoubleClick: event => {
    //       navigate(paths.product_group.change(record.id))
    //     }, // double click row
    //     onContextMenu: event => {}, // right button click row
    //     onMouseEnter: event => {}, // mouse enter row
    //     onMouseLeave: event => {}, // mouse leave row
    //   };
    // }}
    
  );
};

export default ProductGroupTable;