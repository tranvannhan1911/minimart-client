import { 
  BarChartOutlined, 
  UserOutlined, 
  TagsOutlined,
  ShoppingCartOutlined,
  InboxOutlined
} from '@ant-design/icons';
import { Menu } from 'antd';
import Sider from 'antd/lib/layout/Sider';
import { useNavigate } from 'react-router-dom'
import { Typography } from 'antd';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const { Title } = Typography;

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const items = [
  getItem('Bán hàng', 'quan-ly-ban-hang', <ShoppingCartOutlined />, [
    getItem('Bán hàng', 'ban-hang'),
    getItem('Đơn bán hàng', 'don-ban-hang'),
    getItem('Đơn trả hàng', 'don-tra-hang'),
    getItem('Khuyến mãi', 'khuyen-mai'),
  ]),
  getItem('Sản phẩm', 'quan-ly-san-pham', <TagsOutlined />, [
    getItem('Nhóm sản phẩm', 'nhom-san-pham'),
    getItem('Sản phẩm', 'san-pham'),
    getItem('Ngành hàng', 'nganh-hang'),
    getItem('Bảng giá', 'bang-gia'),
    getItem('Đơn vị tính', 'don-vi-tinh'),
  ]),
  getItem('Quản lý kho', 'quan-ly-kho', <InboxOutlined />, [
    getItem('Phiếu nhập hàng', 'phieu-nhap-hang'),
    getItem('Phiếu kiểm kê', 'phieu-kiem-ke'),
    getItem('Lịch sử biến động kho', 'bien-dong-kho'),
  ]),
  getItem('Đối tác - Nhân viên', 'quan-ly-doi-tac', <UserOutlined />, [
    getItem('Nhà cung cấp', 'nha-cung-cap'),
    getItem('Nhóm khách hàng', 'nhom-khach-hang'),
    getItem('Khách hàng', 'khach-hang'),
    getItem('Nhân viên', 'nhan-vien'),
  ]),
  getItem('Thống kê - Báo cáo', 'quan-ly-bao-cao', <BarChartOutlined />, [
    getItem('Bán hàng - Trả hàng', 'ban-hang-tra-hang'),
    getItem('Lợi nhuận - Doanh thu', 'loi-nhuan-doanh-thu'),
    getItem('Kiểm kê', 'kiem-ke'),
    getItem('Nhập hàng', 'nhap-hang'),
  ]),
];

const rootSubmenuKeys = ['quan-ly-ban-hang', 'quan-ly-san-pham', 'quan-ly-kho',
  'quan-ly-doi-tac', 'quan-ly-bao-cao'];

const SideNav = (props) => {
  const [openKeys, setOpenKeys] = useState();
  const navigate = useNavigate();

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);

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
        <Title level={5}>Quản lý siêu thị mini</Title>
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