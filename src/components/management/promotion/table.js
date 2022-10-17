
import {
  EyeOutlined, FormOutlined, 
} from '@ant-design/icons'
import { Table as AntdTable, Input, Tag } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import Highlighter from 'react-highlight-words';
import { useNavigate } from 'react-router-dom';
import paths from '../../../utils/paths'

const DescriptionItem = ({ title, content }) => (
  <div className="site-description-item-profile-wrapper">
    <p className="site-description-item-profile-p-label">{title}:</p>
    {content}
  </div>
);

const PromotionTable = (props) => {
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
    navigate(paths.promotion.addline(id))
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
    navigate(paths.promotion.change(id))
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

  const columns = [
    {
      title: 'Mã',
      dataIndex: 'id',
      key: 'id',
      width: "5%",
      sorter: {
        compare: (a, b) => a.id > b.id,
        multiple: 1
      },
      defaultSortOrder: 'descend',
      filteredValue: props.searchInfo || null,
      onFilter: (value, record) => {
        return (record.title && record.title.toLowerCase().includes(value.toLowerCase()))
          || (record.id && record.id.toString().toLowerCase().includes(value.toLowerCase()))
      },
      ...renderSearch(),
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (image) => (
        <span>
          <img src={image} style={{width:'50px', height:'50px'}}></img>
        </span>
      ),
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      width: "15%",
      sorter: {
        compare: (a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()),
        multiple: 2
      },
      ...renderSearch(),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      width: "35%",
      sorter: {
        compare: (a, b) => a.description.toLowerCase().localeCompare(b.description.toLowerCase()),
        multiple: 2
      },
      ...renderSearch(),
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'start_date',
      key: 'start_date',
      width: "12%",
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'end_date',
      key: 'end_date',
      width: "12%",
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: "10%",
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
      dataIndex: 'id',
      key: 'id',
      width: "11%",
      render: (id) => (
        <span>
          <a onClick={() => onOpen(id)} key={id}><EyeOutlined title='Xem chi tiết' className="site-form-item-icon" style={{ fontSize: '20px' }} /></a>
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
      {/* <PromotionModal open={open} data={dataIndex} setOpen={setOpen} /> */}
    </>

  );
};

export default PromotionTable;