
import {
  EyeOutlined, FormOutlined, SearchOutlined
} from '@ant-design/icons'
import { Table as AntdTable, Tag,Button, Space,Input} from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import Highlighter from 'react-highlight-words';
import { useNavigate } from 'react-router-dom';
import paths from '../../../utils/paths'
import InventoryRecordModal from './modal';
// const idstaff=0;

const DescriptionItem = ({ title, content }) => (
  <div className="site-description-item-profile-wrapper">
    <p className="site-description-item-profile-p-label">{title}:</p>
    {content}
  </div>
);

const InventoryRecordTable = (props) => {
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
    props.data.forEach(element => {
      if (element.id == id) {
        let index = {
          ...element,
          "details": [
          ],
          "status": element.status,
          "note": element.note,
          "id": element.id,
          "date_created": element.date_created
        }
        element.details.forEach(elementt => {
          let ind = {
            "quantity": elementt.quantity,
            "note": elementt.note,
            "product": elementt.product.name,
            "quantity_after": elementt.quantity_after,
            "quantity_before": elementt.quantity_before
          }
          detail.push(ind);
        });
        index.details = detail;
        setDataIndex(index);
        setOpen(true);
      }
    });
  };

  const tagStatus = (status) => {
    if (status == 'pending') {
      return 'CHỜ XÁC NHẬN';
    } else if (status == 'complete') {
      return 'HOÀN THÀNH';
    } else if (status == 'cancel') {
      return 'HỦY';
    }
  };

  const tagStatusColor = (status) => {
    if (status == 'pending') {
      return 'processing';
    } else if (status == 'complete') {
      return 'success';
    } else {
      return 'warning';
    }
  };

  const onClose = () => {
    setOpen(false);
  };
  //////

  const setIdxBtn = (id) => {
    navigate(paths.inventory_record.change(id))
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
    if (column == "mã") {
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
      dataIndex: 'id',
      key: 'id',
      sorter: {
        compare: (a, b) => a.id > b.id,
        multiple: 1
      },
      defaultSortOrder: 'descend',
      filteredValue: props.searchInfo || null,
      onFilter: (value, record) => {
        return (record.id && record.id.toLowerCase().includes(value.toLowerCase()))
      },
      ...renderSearch(),
      ...getColumnSearchProps('mã')
    },
    {
      title: 'Ngày kiểm kê',
      dataIndex: 'date_created',
      key: 'date_created',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filters: [
        {
          text: 'HOÀN THÀNH',
          value: 'complete',
        },
        {
          text: 'CHỜ XÁC NHẬN',
          value: 'pending',
        },
        {
          text: 'HỦY',
          value: 'cancel',
        },
      ],
      filteredValue: props.filteredInfo.status || null,
      onFilter: (value, record) => record.status.includes(value),
      render: (status) => (
        <span>
          <Tag color={tagStatusColor(status)} key={status}>
            {tagStatus(status)}
          </Tag>
        </span>
      ),
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
    },
    {
      title: '',
      dataIndex: 'id',
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
      <InventoryRecordModal open={open} data={dataIndex} setOpen={setOpen} />
    </>

  );
};

export default InventoryRecordTable;