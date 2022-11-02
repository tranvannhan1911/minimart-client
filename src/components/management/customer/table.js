import { EyeOutlined, FormOutlined, SearchOutlined } from '@ant-design/icons';
import { Table as AntdTable, Tag, Button, Space, Input } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import Highlighter from 'react-highlight-words';
import { useNavigate } from 'react-router-dom';
import paths from '../../../utils/paths'
import ShowForPermission from '../../basic/permission';
import CustomerModal from './modal';



const CustomerTable = (props) => {
  const navigate = useNavigate();
  const [currentCountData, SetCurrentCountData] = useState(0);
  const [open, setOpen] = useState(false);
  const [dataIndex, setDataIndex] = useState("");
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
    props.data.forEach(async element => {
      if (element.id == id) {
        // if(element.is_active==true){
        //   element.is_active="Hoạt động";
        // }else{
        //   element.is_active="Khóa";
        // }

        // const response2 = await api.address.get_parent(element.ward);
        // element.ward=response2.data.data.tree;
        console.log(element)
        setDataIndex(element);
        // renderProfile(element)
        setOpen(true);
        console.log(element);
      }
    });
  };
  const setIdxBtn = (id) => {
    navigate(paths.customer.change(id))
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
    } else if (column == "số điện thoại") {
      props.dataSearchPhone(data)
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
      title: 'Mã khách hàng',
      dataIndex: 'id',
      key: 'id',
      width:'10%',
      sorter: {
        compare: (a, b) => a.id > b.id,
        multiple: 1
      },
      defaultSortOrder: 'descend',
      filteredValue: props.searchInfo || null,
      onFilter: (value, record) => {
        return record.fullname.toLowerCase().includes(value.toLowerCase())
          || record.id.toString().toLowerCase().includes(value.toLowerCase())
          || record.phone.toLowerCase().includes(value.toLowerCase())
      },
      ...renderSearch(),
      ...getColumnSearchProps('mã')
    },
    {
      title: 'Tên',
      dataIndex: 'fullname',
      key: 'fullname',
      sorter: {
        compare: (a, b) => a.fullname.toLowerCase().localeCompare(b.fullname.toLowerCase()),
        multiple: 2
      },
      ...renderSearch(),
      ...getColumnSearchProps('tên')
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      ...renderSearch(),
      ...getColumnSearchProps('số điện thoại')
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
          <Button
            type="text"
            icon={<FormOutlined title='Chỉnh sửa' />}
            onClick={() => setIdxBtn(id)} ></Button>
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
      size="small"
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
      <CustomerModal open={open} data={dataIndex} setOpen={setOpen} /></>
  );
};

export default CustomerTable;