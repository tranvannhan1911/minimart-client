import { SearchOutlined } from '@ant-design/icons';
import {
  EyeOutlined, FormOutlined
} from '@ant-design/icons'
import { Button, Space, Table as AntdTable, Input, Tag, Pagination, Switch, message } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import Highlighter from 'react-highlight-words';
import { useNavigate } from 'react-router-dom';
import paths from '../../../utils/paths'
import { Col, Divider, Drawer, Row } from 'antd';
import api from '../../../api/apis'
import messages from '../../../utils/messages'
const { Search } = Input;
// const idstaff=0;

const DescriptionItem = ({ title, content }) => (
  <div className="site-description-item-profile-wrapper">
    <p className="site-description-item-profile-p-label">{title}:</p>
    {content}
  </div>
);

const StaffTable = (props) => {
  const navigate = useNavigate();
  const [data1, setData1] = useState();
  const [open, setOpen] = useState(false);
  // const [isStatus, setStatus] = useState(false);
  const [currentCountData, SetCurrentCountData] = useState(0);

  const handleChange = (pagination, filters, sorter, extras) => {
    console.log('Various parameters\n', pagination, filters, sorter);
    props.setFilteredInfo(filters);
    props.setSortedInfo(sorter);
    SetCurrentCountData(extras.currentDataSource.length)
  };

  ///////

  async function showDrawer(id) {
    // setOpen(true);
    // renderProfile()
    // console.log(props);
    props.data.forEach(element => {
      if(element.id==id){
        // if(element.is_superuser=="Nhân viên"){
        //   element.is_superuser=false;
        // }else{
        //   element.is_superuser=true;
        // }
        setData1(element);
        // renderProfile(element)
        console.log(element);
      }
    });

  };

  const tagStatus = (status) => {
    if(status==true){
      return 'HOẠT ĐỘNG';
    }else{
      return 'KHÓA';
    }
  };

  const tagStatusColor = (status) => {
    if(status==true){
      return 'geekblue';
    }else{
      return 'volcano';
    }
  };

  // const renderProfile = (dataa) => ({
  //   render: () =>
  //     <Profile
  //     data={dataa}
  //     ></Profile>
  // });

  const onOpen = (id) => {
    // setData1(showDrawer(id));
    showDrawer(id)
    setOpen(true)
  };

  const onClose = () => {
    setOpen(false);
  };
  //////

  const setIdxBtn = (id) => {
    navigate(paths.staff.change(id))
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
          || (record.phone && record.phone.toLowerCase().includes(value.toLowerCase()))
      },
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
    },
    {
      title: 'Vị trí',
      dataIndex: 'is_superuser',
      key: 'is_superuser',
      filters: [
        {
          text: 'Quản lý',
          value: 'Quản lý',
        },
        {
          text: 'Nhân viên',
          value: 'Nhân viên',
        },
      ],
      filteredValue: props.filteredInfo.is_superuser || null,
      onFilter: (value, record) => record.is_superuser.includes(value),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (is_active) => (
        <span>  
              <Tag color={tagStatusColor(is_active)} key={is_active}>
                {tagStatus(is_active)}
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
        loading={props.loading} />
      <Drawer width={640} placement="right" closable={false} onClose={onClose} visible={open}>
        <p
          className="site-description-item-profile-p"
          style={{
            marginBottom: 24,
            fontSize: 25
          }}
        >
          Thông tin nhân viên
        </p>
        <p className="site-description-item-profile-p">Thông tin cơ bản</p>
        <Row>
          <Col span={12}>
            <div className="site-description-item-profile-wrapper">
              <p className="site-description-item-profile-p-label">Họ tên:</p>
            </div>
          </Col>
          <Col span={12}>
          <div className="site-description-item-profile-wrapper">
              <p className="site-description-item-profile-p-label">Số điện thoại:</p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
          <div className="site-description-item-profile-wrapper">
              <p className="site-description-item-profile-p-label">Số điện thoại:</p>
            </div>
          </Col>
          <Col span={12}>
          <div className="site-description-item-profile-wrapper">
              <p className="site-description-item-profile-p-label">Số điện thoại:</p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem title="Birthday" content="February 2,1900" />
          </Col>
          <Col span={12}>
            <DescriptionItem title="Website" content="-" />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <DescriptionItem
              title="Message"
              content="Make things as simple as possible but no simpler."
            />
          </Col>
        </Row>
        <Divider />
        <p className="site-description-item-profile-p">Company</p>
        <Row>
          <Col span={12}>
            <DescriptionItem title="Position" content="Programmer" />
          </Col>
          <Col span={12}>
            <DescriptionItem title="Responsibilities" content="Coding" />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem title="Department" content="XTech" />
          </Col>
          <Col span={12}>
            <DescriptionItem title="Supervisor" content={<a>Lin</a>} />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <DescriptionItem
              title="Skills"
              content="C / C + +, data structures, software engineering, operating systems, computer networks, databases, compiler theory, computer architecture, Microcomputer Principle and Interface Technology, Computer English, Java, ASP, etc."
            />
          </Col>
        </Row>
        <Divider />
        <p className="site-description-item-profile-p">Contacts</p>
        <Row>
          <Col span={12}>
            <DescriptionItem title="Email" content="AntDesign@example.com" />
          </Col>
          <Col span={12}>
            <DescriptionItem title="Phone Number" content="+86 181 0000 0000" />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <DescriptionItem
              title="Github"
              content={
                <a href="http://github.com/ant-design/ant-design/">
                  github.com/ant-design/ant-design/
                </a>
              }
            />
          </Col>
        </Row>
      </Drawer>

    </>

  );
};

export default StaffTable;