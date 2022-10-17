
import {
  EyeOutlined, FormOutlined
} from '@ant-design/icons'
import { Table as AntdTable, Tag, } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import Highlighter from 'react-highlight-words';
import { useNavigate } from 'react-router-dom';
import paths from '../../../utils/paths'
import InventoryReceivingModal from './modal';
// const idstaff=0;

const InventoryReceivingTable = (props) => {
  const navigate = useNavigate();
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


  const onOpen = (id) => {
    
    let detail = [];
    props.data.forEach(element => {
      if (element.id == id) {
        let index={
          ...element,
          "details": [
          ],
          "status": element.status,
          "note": element.note,
          "total": element.total,
          "supplier": element.supplier,
          "id": element.id,
          "date_created": element.date_created
        }
        element.details.forEach(elementt => {
          let ind = {
            "quantity": elementt.quantity,
            "price": elementt.price,
            "note": elementt.note,
            "product": elementt.product.name
          }
          detail.push(ind);
        });
        index.details=detail;
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
    // if(status==true){
    //   return 'geekblue';
    // }else{
    //   return 'volcano';
    // }
  };

  const onClose = () => {
    setOpen(false);
  };
  //////

  const setIdxBtn = (id) => {
    navigate(paths.inventory_receiving.change(id))
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
      title: 'Mã phiếu nhập hàng',
      dataIndex: 'id',
      key: 'id',
      sorter: {
        compare: (a, b) => a.id > b.id,
        multiple: 1
      },
      defaultSortOrder: 'descend',
      filteredValue: props.searchInfo || null,
      onFilter: (value, record) => {
        return (record.supplier && record.supplier.toLowerCase().includes(value.toLowerCase()))
          || (record.id && record.id.toString().toLowerCase().includes(value.toLowerCase()))
      },
      ...renderSearch(),
    },
    {
      title: 'Nhà cung cấp',
      dataIndex: 'supplier',
      key: 'name',
      sorter: {
        compare: (a, b) => a.supplier.toLowerCase().localeCompare(b.supplier.toLowerCase()),
        multiple: 2
      },
      ...renderSearch(),
    },
    {
      title: 'Ngày nhập',
      dataIndex: 'date_created',
      key: 'date_created',
      ...renderSearch(),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      key: 'total',
      // sorter: {
      //   compare: (a, b) => Number(a.total) > Number(b.total),
      //   multiple: 1
      // },
      // ...renderSearch(),
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
      title: '',
      dataIndex: 'id',
      key: 'id',
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
      <InventoryReceivingModal open={open} data={dataIndex} setOpen={setOpen} />
    </>

  );
};

export default InventoryReceivingTable;