
import {
  EyeOutlined, FormOutlined, SearchOutlined
} from '@ant-design/icons'
import { Table as AntdTable, Tag, Button, Space,Input } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import Highlighter from 'react-highlight-words';
import { useNavigate } from 'react-router-dom';
import paths from '../../../utils/paths'
import PriceModal from './modal';
// const idstaff=0;

const DescriptionItem = ({ title, content }) => (
  <div className="site-description-item-profile-wrapper">
    <p className="site-description-item-profile-p-label">{title}:</p>
    {content}
  </div>
);

const PriceTable = (props) => {
  const navigate = useNavigate();
  const [data1, setData1] = useState();
  const [open, setOpen] = useState(false);
  const [dataIndex, setDataIndex] = useState("");
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  // const [isStatus, setStatus] = useState(false);
  const [currentCountData, SetCurrentCountData] = useState(0);

  const handleChange = (pagination, filters, sorter, extras) => {
    console.log('Various parameters\n', pagination, filters, sorter);
    props.setFilteredInfo(filters);
    props.setSortedInfo(sorter);
    SetCurrentCountData(extras.currentDataSource.length)
  };

  ///////

  const onOpen = async (id) => {
    let detail = [];
    props.data.forEach(async element => {
      if (element.price_list_id == id) {
        let date = element.date_created.slice(0, 10);
        let time = element.date_created.slice(12, 19);
        element.date_created = date + " " + time;
        if (element.date_updated != null) {
          let date2 = element.date_updated.slice(0, 10);
          let time2 = element.date_updated.slice(12, 19);
          element.date_updated = date + " " + time;
        }

        let index = {
          "pricedetails": [],
          "name": element.name,
          "start_date": element.start_date,
          "end_date": element.end_date,
          "status": element.status,
          "note": element.note,
          "price_list_id": element.price_list_id,
          "date_created": element.date_created,
          "date_updated": element.date_updated,
          "user_created": element.user_created,
          "user_updated": element.user_updated,

        }
        element.pricedetails.forEach(elementt => {
          let ind = {
            "note": elementt.note,
            "product": elementt.product.name,
            "price": elementt.price,
            "unit_exchange": elementt.unit_exchange.unit_name
          }
          detail.push(ind);
        });
        index.pricedetails = detail;
        setDataIndex(index);
        setOpen(true);

      }
    });
  };

  const tagStatus = (status) => {
    if (status == true) {
      return 'HOẠT ĐỘNG';
    } else {
      return 'KHÓA';
    }
  };

  const tagStatusColor = (status) => {
    if (status == true) {
      return 'geekblue';
    } else {
      return 'volcano';
    }
  };

  const onClose = () => {
    setOpen(false);
  };
  //////

  const setIdxBtn = (id) => {
    navigate(paths.price.change(id))
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
      title: 'Mã',
      dataIndex: 'price_list_id',
      key: 'price_list_id',
      sorter: {
        compare: (a, b) => a.price_list_id > b.price_list_id,
        multiple: 1
      },
      defaultSortOrder: 'descend',
      filteredValue: props.searchInfo || null,
      onFilter: (value, record) => {
        return (record.name && record.name.toLowerCase().includes(value.toLowerCase()))
          || (record.price_list_id && record.price_list_id.toString().toLowerCase().includes(value.toLowerCase()))
      },
      ...renderSearch(),
      ...getColumnSearchProps('mã')
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      sorter: {
        compare: (a, b) => a.fullname.toLowerCase().localeCompare(b.fullname.toLowerCase()),
        multiple: 2
      },
      ...renderSearch(),
      ...getColumnSearchProps('tên')
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'start_date',
      key: 'start_date',
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'end_date',
      key: 'end_date',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filters: [
        {
          text: 'HOẠT ĐỘNG',
          value: 'true',
        },
        {
          text: 'KHÓA',
          value: 'false',
        },
      ],
      filteredValue: props.filteredInfo.status || null,
      onFilter: (value, record) => record.status.toString().includes(value),
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
      dataIndex: 'price_list_id',
      key: 'price_list_id',
      render: (price_list_id) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined title='Xem chi tiết' />}
            onClick={() => onOpen(price_list_id)} ></Button>
          <Button
            type="text"
            icon={<FormOutlined title='Chỉnh sửa' />}
            onClick={() => setIdxBtn(price_list_id)} ></Button>
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
    <>
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
        loading={props.loading} />
      <PriceModal open={open} data={dataIndex} setOpen={setOpen} />
    </>

  );
};

export default PriceTable;