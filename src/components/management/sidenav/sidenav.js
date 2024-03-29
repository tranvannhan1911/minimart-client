import { 
  BarChartOutlined, 
  UserOutlined, 
  TagsOutlined,
  ShoppingCartOutlined,
  InboxOutlined,
  DashboardOutlined
} from '@ant-design/icons';
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom'
import { Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import store from '../../../store/store';
const { Title } = Typography;


// var items = [
//   getChildItem('Bán hàng', 'quan-ly-ban-hang', <ShoppingCartOutlined />, [
//     getChildItem('Bán hàng', 'ban-hang'),
//     getChildItem('Đơn bán hàng', 'don-ban-hang'),
//     getChildItem('Đơn trả hàng', 'don-tra-hang'),
//     getChildItem('Khuyến mãi', 'khuyen-mai'),
//   ]),
//   getChildItem('Sản phẩm', 'quan-ly-san-pham', <TagsOutlined />, [
//     getChildItem('Nhóm sản phẩm', 'nhom-san-pham'),
//     getChildItem('Sản phẩm', 'san-pham'),
//     getChildItem('Ngành hàng', 'nganh-hang'),
//     getChildItem('Bảng giá', 'bang-gia'),
//     getChildItem('Đơn vị tính', 'don-vi-tinh'),
//   ]),
// ];


// if(Cookies.get("is_manager") == "true"){
//   items.push(getChildItem('Quản lý kho', 'quan-ly-kho', <InboxOutlined />, [
//     getChildItem('Phiếu nhập hàng', 'phieu-nhap-hang'),
//     getChildItem('Phiếu kiểm kê', 'phieu-kiem-ke'),
//     getChildItem('Lịch sử biến động kho', 'bien-dong-kho'),
//   ]))
// }

// items.push(
//   getChildItem('Đối tác - Nhân viên', 'quan-ly-doi-tac', <UserOutlined />, [
//     getChildItem('Nhà cung cấp', 'nha-cung-cap'),
//     getChildItem('Nhóm khách hàng', 'nhom-khach-hang'),
//     getChildItem('Khách hàng', 'khach-hang'),
//     getChildItem('Nhân viên', 'nhan-vien'),
//   ]
// ))

// items.push(
//   getChildItem('Thống kê - Báo cáo', 'quan-ly-bao-cao', <BarChartOutlined />, [
//     getChildItem('Bán hàng - Trả hàng', 'ban-hang-tra-hang'),
//     getChildItem('Lợi nhuận - Doanh thu', 'loi-nhuan-doanh-thu'),
//     getChildItem('Kiểm kê', 'kiem-ke'),
//     getChildItem('Nhập hàng', 'nhap-hang'),
//   ])
// )

// const items = [
//   getChildItem('Bán hàng', 'quan-ly-ban-hang', <ShoppingCartOutlined />, [
//     getChildItem('Bán hàng', 'ban-hang'),
//     getChildItem('Đơn bán hàng', 'don-ban-hang'),
//     getChildItem('Đơn trả hàng', 'don-tra-hang'),
//     getChildItem('Khuyến mãi', 'khuyen-mai'),
//   ]),
//   getChildItem('Sản phẩm', 'quan-ly-san-pham', <TagsOutlined />, [
//     getChildItem('Nhóm sản phẩm', 'nhom-san-pham'),
//     getChildItem('Sản phẩm', 'san-pham'),
//     getChildItem('Ngành hàng', 'nganh-hang'),
//     getChildItem('Bảng giá', 'bang-gia'),
//     getChildItem('Đơn vị tính', 'don-vi-tinh'),
//   ]),
//   getChildItem('Quản lý kho', 'quan-ly-kho', <InboxOutlined />, [
//     getChildItem('Phiếu nhập hàng', 'phieu-nhap-hang'),
//     getChildItem('Phiếu kiểm kê', 'phieu-kiem-ke'),
//     getChildItem('Lịch sử biến động kho', 'bien-dong-kho'),
//   ]),
//   getChildItem('Đối tác - Nhân viên', 'quan-ly-doi-tac', <UserOutlined />, [
//     getChildItem('Nhà cung cấp', 'nha-cung-cap'),
//     getChildItem('Nhóm khách hàng', 'nhom-khach-hang'),
//     getChildItem('Khách hàng', 'khach-hang'),
//     getChildItem('Nhân viên', 'nhan-vien'),
//   ]),
//   getChildItem('Thống kê - Báo cáo', 'quan-ly-bao-cao', <BarChartOutlined />, [
//     getChildItem('Bán hàng - Trả hàng', 'ban-hang-tra-hang'),
//     getChildItem('Lợi nhuận - Doanh thu', 'loi-nhuan-doanh-thu'),
//     getChildItem('Kiểm kê', 'kiem-ke'),
//     getChildItem('Nhập hàng', 'nhap-hang'),
//   ]),
// ];

const rootSubmenuKeys = ['quan-ly-ban-hang', 'quan-ly-san-pham', 'quan-ly-kho',
  'quan-ly-doi-tac', 'quan-ly-bao-cao'];

const SideNav = (props) => {
  const [openKeys, setOpenKeys] = useState();
  const [items, setItems] = useState([])
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({})

  useEffect(() => {
    store.subscribe(() => {
      setUserInfo(store.getState().user.info)
    })
  }, [])

  
  useEffect(() => {
    console.log("change props.userInfo in sidenav", props.userInfo)
    setUserInfo(props.userInfo)
  }, [props.userInfo])
  
  const getItem = (label, key, icon, children, required_perm, type) => {
    
    if(!userInfo || (required_perm && userInfo.is_manager == false)){
      return null;
    }
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }
  
  const getChildItem = (label, key, required_perm) => {
    
    if(required_perm && userInfo && userInfo.is_manager == false){
      return null;
    }
    return {
      key,
      label,
    };
  }

  useEffect(() => {
    var _items = [
      getItem('Dashboard', '', <DashboardOutlined />,),
      getItem('Bán hàng', 'quan-ly-ban-hang', <ShoppingCartOutlined />, [
        getChildItem('Bán hàng', 'ban-hang'),
        getChildItem('Hóa đơn bán hàng', 'don-ban-hang'),
        getChildItem('Hóa đơn trả hàng', 'don-tra-hang'),
        getChildItem('Chương trình khuyến mãi', 'khuyen-mai'),
      ]),
      getItem('Sản phẩm', 'quan-ly-san-pham', <TagsOutlined />, [
        getChildItem('Nhóm sản phẩm', 'nhom-san-pham'),
        getChildItem('Sản phẩm', 'san-pham'),
        getChildItem('Ngành hàng', 'nganh-hang'),
        getChildItem('Bảng giá', 'bang-gia'),
        getChildItem('Đơn vị tính', 'don-vi-tinh'),
      ]),
      getItem('Quản lý kho', 'quan-ly-kho', <InboxOutlined />, [
        getChildItem('Phiếu nhập hàng', 'phieu-nhap-hang'),
        getChildItem('Phiếu kiểm kê', 'phieu-kiem-ke'),
        getChildItem('Lịch sử biến động kho', 'bien-dong-kho'),
      ], true),
      getItem('Đối tác - Nhân viên', 'quan-ly-doi-tac', <UserOutlined />, [
        getChildItem('Nhà cung cấp', 'nha-cung-cap', true),
        getChildItem('Nhóm khách hàng', 'nhom-khach-hang'),
        getChildItem('Khách hàng', 'khach-hang'),
        getChildItem('Nhân viên', 'nhan-vien', true),
      ]),
      getItem('Thống kê - Báo cáo', 'quan-ly-bao-cao', <BarChartOutlined />, [
        getChildItem('Doanh số bán hàng', 'thong-ke-doanh-so-ban-hang'),
        getChildItem('Trả hàng', 'thong-ke-tra-hang'),
        getChildItem('Khuyến mãi', 'thong-ke-khuyen-mai'),
        getChildItem('Nhập hàng', 'thong-ke-nhap-hang'),
        getChildItem('Tồn kho', 'thong-ke-ton-kho'),
      ], true),
    ];
    setItems(_items)
  }, [userInfo])

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys?.indexOf(key) === -1);

    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const onSelect = (selected) => {
    navigate(`/quan-ly/${selected.key}`)
  }

  const onClick = (selected) => {
    navigate(`/quan-ly/${selected.key}`)
  }

  return (
    <div 
    >
      <div className="logo">
        <Title level={5}>Hệ thống quản lý <br></br> siêu thị</Title>
      </div>
      <Menu
        mode="inline"
        theme="dark"
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        items={items}
        onSelect={onSelect}
        onClick={onClick}
      />
    </div>
  );
};

export default SideNav;