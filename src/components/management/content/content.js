import { HomeOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import React, { Component, useEffect, useState } from 'react';
import { Breadcrumb, Layout, Affix, Space, Col, Row, Button } from 'antd';
import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useMatch, useNavigate } from "react-router-dom";
import Loading from '../../basic/loading';
import paths from '../../../utils/paths'
import store from '../../../store/store';
const { Content } = Layout;

const ListForm = lazy(() => import("../templates/listform"));
const CustomerListForm = lazy(() => import("../customer/listform"));
const CustomerChangeForm = lazy(() => import("../customer/changeform"));
const StaffListForm = lazy(() => import("../staff/listform"));
const StaffChangeForm = lazy(() => import("../staff/changeform"));
const CustomerGroupListForm = lazy(() => import("../customer_group/listform"));
const CustomerGroupChangeForm = lazy(() => import("../customer_group/changeform"));
const SupplierListForm = lazy(() => import("../supplier/listform"));
const SupplierChangeForm = lazy(() => import("../supplier/changeform"));
const ProductGroupListForm = lazy(() => import("../product_group/listform"));
const ProductGroupChangeForm = lazy(() => import("../product_group/changeform"));
const UnitListForm = lazy(() => import("../unit/listform"));
const UnitChangeForm = lazy(() => import("../unit/changeform"));
const ProductListForm = lazy(() => import("../product/listform"));
const ProductChangeForm = lazy(() => import("../product/changeform"));
const PriceListForm = lazy(() => import("../price/listform"));
const PriceChangeForm = lazy(() => import("../price/changeform"));
const InventoryReceivingListForm = lazy(() => import("../inventory_receiving/listform"));
const InventoryReceivingChangeForm = lazy(() => import("../inventory_receiving/changeform"));
const InventoryRecordListForm = lazy(() => import("../inventory_record/listform"));
const InventoryRecordChangeForm = lazy(() => import("../inventory_record/changeform"));
const WarehouseTransactionListForm = lazy(() => import("../warehouse_transaction/listform"));
const PromotionListForm = lazy(() => import("../promotion/listform"));
const PromotionChangeForm = lazy(() => import("../promotion/changeform"));
const PromotionLineChangeForm = lazy(() => import("../promotion/promotion_line/changeform"));
const OrderListForm = lazy(() => import("../order_list/listform"));
const RefundListForm = lazy(() => import("../refund_list/listform"));
const SellPage = lazy(() => import("../sell/sell"));
const StatisticsSales = lazy(() => import("../statistics/sales"));
const StatisticsRefund = lazy(() => import("../statistics/refund"));
const StatisticsReceived = lazy(() => import("../statistics/received"));
const StatisticsPromotion = lazy(() => import("../statistics/promotion"));
const StatisticsInventory = lazy(() => import("../statistics/inventory"));

const CategoryListForm = lazy(() => import("../category/listform"));
const CategoryChangeForm = lazy(() => import("../category/changeform"));

const Dashboard = lazy(() => import("../dashboard/dashboard"));

const MyContent = (props) => {
    const [container, setContainer] = useState(null);
    const [breadcrumb, setBreadcrumb] = useState(false);
    const [breadcrumb_extras, setBreadcrumbExtras] = useState(null);
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({})

    useEffect(() => {
        store.subscribe(() => {
            setUserInfo(store.getState().user.info)
        })
    }, [])

    const breadcrumbComponent = () => {
        console.log(paths.customer.list);
        if (!breadcrumb)
            return null

        let items = [];
        breadcrumb.forEach(bc => {
            items.push(
                <Breadcrumb.Item
                    style={{
                        cursor: 'pointer'
                    }}
                    onClick={() => { if (bc.href) navigate(bc.href) }}
                >
                    {bc.title}
                </Breadcrumb.Item>
            )
        })


        return (
            <Affix target={() => container} style={{
                margin: '5px 16px 0px',
                padding: '20px 0px 0px',
            }}>

                <Row wrap={false} className="action">
                    <Col flex="auto">
                        <Breadcrumb>
                            <Breadcrumb.Item href="/quan-ly">
                                <HomeOutlined />
                            </Breadcrumb.Item>
                            {items}
                        </Breadcrumb>
                    </Col>
                    <Col flex="null">
                        <Space direction="horizontal" style={{ width: '100%', justifyContent: 'end' }}>
                            {breadcrumb_extras}
                        </Space>
                    </Col>
                </Row>
            </Affix>
        )
    }

    // const getRoutes = () => {

    // }

    return (
        <div ref={setContainer}>
            {breadcrumbComponent()}
            <Content
                className="site-layout-background"
                style={{
                    margin: '25px 16px',
                    padding: 24,
                    minHeight: 280,
                }}
            >
                {/* <ListForm></ListForm> */}
                <Suspense fallback={<Loading />}>
                    <Routes >

                        <Route path="" key="" element={<Dashboard title="Chung" />} />

                        <Route path={paths.customer.rlist} key={paths.customer.key}
                            element={<CustomerListForm setBreadcrumb={setBreadcrumb}  {...props} />} />
                        <Route path={paths.customer.radd} key={paths.customer.key}
                            element={<CustomerChangeForm
                                breadcrumb_extras={breadcrumb_extras} setBreadcrumbExtras={setBreadcrumbExtras}
                                setBreadcrumb={setBreadcrumb} is_create={true}  {...props} />} />
                        <Route path={paths.customer.rchange} key={paths.customer.key}
                            element={<CustomerChangeForm
                                breadcrumb_extras={breadcrumb_extras} setBreadcrumbExtras={setBreadcrumbExtras}
                                setBreadcrumb={setBreadcrumb} is_create={false}  {...props} />} />

                        <Route path={paths.staff.rlist} key={paths.staff.key}
                            element={userInfo && userInfo.is_manager == false ? <Navigate to="/dang-nhap" /> : <StaffListForm setBreadcrumb={setBreadcrumb}  {...props} />} />
                        <Route path={paths.staff.radd} key={paths.staff.key}
                            element={userInfo && userInfo.is_manager == false ? <Navigate to="/dang-nhap" /> : <StaffChangeForm
                                breadcrumb_extras={breadcrumb_extras} setBreadcrumbExtras={setBreadcrumbExtras}
                                setBreadcrumb={setBreadcrumb} is_create={true}  {...props} />} />
                        <Route path={paths.staff.rchange} key={paths.staff.key}
                            element={userInfo && userInfo.is_manager == false ? <Navigate to="/dang-nhap" /> : <StaffChangeForm
                                breadcrumb_extras={breadcrumb_extras} setBreadcrumbExtras={setBreadcrumbExtras}
                                setBreadcrumb={setBreadcrumb} is_create={false}  {...props} />} />


                        <Route path={paths.customer_group.rlist} key={paths.customer_group.key}
                            element={<CustomerGroupListForm setBreadcrumb={setBreadcrumb}  {...props} />} />
                        <Route path={paths.customer_group.radd} key={paths.customer_group.key}
                            element={<CustomerGroupChangeForm
                                breadcrumb_extras={breadcrumb_extras} setBreadcrumbExtras={setBreadcrumbExtras}
                                setBreadcrumb={setBreadcrumb} is_create={true}  {...props} />} />
                        <Route path={paths.customer_group.rchange} key={paths.customer_group.key}
                            element={<CustomerGroupChangeForm
                                breadcrumb_extras={breadcrumb_extras} setBreadcrumbExtras={setBreadcrumbExtras}
                                setBreadcrumb={setBreadcrumb} is_create={false}  {...props} />} />

                        <Route path={paths.supplier.rlist} key={paths.supplier.key}
                            element={userInfo && userInfo.is_manager == false ? <Navigate to="/dang-nhap" /> : <SupplierListForm setBreadcrumb={setBreadcrumb}  {...props} />} />
                        <Route path={paths.supplier.radd} key={paths.supplier.key}
                            element={userInfo && userInfo.is_manager == false ? <Navigate to="/dang-nhap" /> : <SupplierChangeForm
                                breadcrumb_extras={breadcrumb_extras} setBreadcrumbExtras={setBreadcrumbExtras}
                                setBreadcrumb={setBreadcrumb} is_create={true}  {...props} />} />
                        <Route path={paths.supplier.rchange} key={paths.supplier.key}
                            element={userInfo && userInfo.is_manager == false ? <Navigate to="/dang-nhap" /> : <SupplierChangeForm
                                breadcrumb_extras={breadcrumb_extras} setBreadcrumbExtras={setBreadcrumbExtras}
                                setBreadcrumb={setBreadcrumb} is_create={false}  {...props} />} />

                        <Route path={paths.product_group.rlist} key={paths.product_group.key}
                            element={<ProductGroupListForm setBreadcrumb={setBreadcrumb}  {...props} />} />
                        <Route path={paths.product_group.radd} key={paths.product_group.key}
                            element={<ProductGroupChangeForm
                                breadcrumb_extras={breadcrumb_extras} setBreadcrumbExtras={setBreadcrumbExtras}
                                setBreadcrumb={setBreadcrumb} is_create={true}  {...props} />} />
                        <Route path={paths.product_group.rchange} key={paths.product_group.key}
                            element={<ProductGroupChangeForm
                                breadcrumb_extras={breadcrumb_extras} setBreadcrumbExtras={setBreadcrumbExtras}
                                setBreadcrumb={setBreadcrumb} is_create={false}  {...props} />} />

                        <Route path={paths.unit.rlist} key={paths.unit.key}
                            element={<UnitListForm setBreadcrumb={setBreadcrumb}  {...props} />} />
                        <Route path={paths.unit.radd} key={paths.unit.key}
                            element={userInfo && userInfo.is_manager == false ? <Navigate to="/dang-nhap" /> : <UnitChangeForm
                                breadcrumb_extras={breadcrumb_extras} setBreadcrumbExtras={setBreadcrumbExtras}
                                setBreadcrumb={setBreadcrumb} is_create={true}  {...props} />} />
                        <Route path={paths.unit.rchange} key={paths.unit.key}
                            element={userInfo && userInfo.is_manager == false ? <Navigate to="/dang-nhap" /> : <UnitChangeForm
                                breadcrumb_extras={breadcrumb_extras} setBreadcrumbExtras={setBreadcrumbExtras}
                                setBreadcrumb={setBreadcrumb} is_create={false}  {...props} />} />

                        <Route path={paths.product.rlist} key={paths.product.key}
                            element={<ProductListForm setBreadcrumb={setBreadcrumb}  {...props} />} />
                        <Route path={paths.product.radd} key={paths.product.key}
                            element={userInfo && userInfo.is_manager == false ? <Navigate to="/dang-nhap" /> : <ProductChangeForm
                                breadcrumb_extras={breadcrumb_extras} setBreadcrumbExtras={setBreadcrumbExtras}
                                setBreadcrumb={setBreadcrumb} is_create={true}  {...props} />} />
                        <Route path={paths.product.rchange} key={paths.product.key}
                            element={userInfo && userInfo.is_manager == false ? <Navigate to="/dang-nhap" /> : <ProductChangeForm
                                breadcrumb_extras={breadcrumb_extras} setBreadcrumbExtras={setBreadcrumbExtras}
                                setBreadcrumb={setBreadcrumb} is_create={false}  {...props} />} />

                        <Route path={paths.price.rlist} key={paths.price.key}
                            element={<PriceListForm setBreadcrumb={setBreadcrumb}  {...props} />} />
                        <Route path={paths.price.radd} key={paths.price.key}
                            element={userInfo && userInfo.is_manager == false ? <Navigate to="/dang-nhap" /> : <PriceChangeForm
                                breadcrumb_extras={breadcrumb_extras} setBreadcrumbExtras={setBreadcrumbExtras}
                                setBreadcrumb={setBreadcrumb} is_create={true}  {...props} />} />
                        <Route path={paths.price.rchange} key={paths.price.key}
                            element={userInfo && userInfo.is_manager == false ? <Navigate to="/dang-nhap" /> : <PriceChangeForm
                                breadcrumb_extras={breadcrumb_extras} setBreadcrumbExtras={setBreadcrumbExtras}
                                setBreadcrumb={setBreadcrumb} is_create={false}  {...props} />} />

                        <Route path={paths.inventory_receiving.rlist} key={paths.inventory_receiving.key}
                            element={userInfo && userInfo.is_manager == false ? <Navigate to="/dang-nhap" /> : <InventoryReceivingListForm setBreadcrumb={setBreadcrumb}  {...props} />} />
                        <Route path={paths.inventory_receiving.radd} key={paths.inventory_receiving.key}
                            element={userInfo && userInfo.is_manager == false ? <Navigate to="/dang-nhap" /> : <InventoryReceivingChangeForm
                                breadcrumb_extras={breadcrumb_extras} setBreadcrumbExtras={setBreadcrumbExtras}
                                setBreadcrumb={setBreadcrumb} is_create={true}  {...props} />} />
                        <Route path={paths.inventory_receiving.rchange} key={paths.inventory_receiving.key}
                            element={userInfo && userInfo.is_manager == false ? <Navigate to="/dang-nhap" /> : <InventoryReceivingChangeForm
                                breadcrumb_extras={breadcrumb_extras} setBreadcrumbExtras={setBreadcrumbExtras}
                                setBreadcrumb={setBreadcrumb} is_create={false}  {...props} />} />

                        <Route path={paths.inventory_record.rlist} key={paths.inventory_record.key}
                            element={userInfo && userInfo.is_manager == false ? <Navigate to="/dang-nhap" /> : <InventoryRecordListForm setBreadcrumb={setBreadcrumb}  {...props} />} />
                        <Route path={paths.inventory_record.radd} key={paths.inventory_record.key}
                            element={userInfo && userInfo.is_manager == false ? <Navigate to="/dang-nhap" /> : <InventoryRecordChangeForm
                                breadcrumb_extras={breadcrumb_extras} setBreadcrumbExtras={setBreadcrumbExtras}
                                setBreadcrumb={setBreadcrumb} is_create={true}  {...props} />} />
                        <Route path={paths.inventory_record.rchange} key={paths.inventory_record.key}
                            element={userInfo && userInfo.is_manager == false ? <Navigate to="/dang-nhap" /> : <InventoryRecordChangeForm
                                breadcrumb_extras={breadcrumb_extras} setBreadcrumbExtras={setBreadcrumbExtras}
                                setBreadcrumb={setBreadcrumb} is_create={false}  {...props} />} />

                        <Route path={paths.warehouse_transaction.rlist} key={paths.warehouse_transaction.key}
                            element={userInfo && userInfo.is_manager == false ? <Navigate to="/dang-nhap" /> : <WarehouseTransactionListForm setBreadcrumb={setBreadcrumb}  {...props} />} />

                        <Route path={paths.promotion.rlist} key={paths.promotion.key}
                            element={<PromotionListForm setBreadcrumb={setBreadcrumb}  {...props} />} />
                        <Route path={paths.promotion.radd} key={paths.promotion.key}
                            element={userInfo && userInfo.is_manager == false ? <Navigate to="/dang-nhap" /> : <PromotionChangeForm
                                breadcrumb_extras={breadcrumb_extras} setBreadcrumbExtras={setBreadcrumbExtras}
                                setBreadcrumb={setBreadcrumb} is_create={true}  {...props} />} />
                        <Route path={paths.promotion.rchange} key={paths.promotion.key}
                            element={userInfo && userInfo.is_manager == false ? <Navigate to="/dang-nhap" /> : <PromotionChangeForm
                                breadcrumb_extras={breadcrumb_extras} setBreadcrumbExtras={setBreadcrumbExtras}
                                setBreadcrumb={setBreadcrumb} is_create={false}  {...props} />} />

                        <Route path={paths.promotion.raddline} key={paths.promotion.key}
                            element={userInfo && userInfo.is_manager == false ? <Navigate to="/dang-nhap" /> : <PromotionLineChangeForm
                                breadcrumb_extras={breadcrumb_extras} setBreadcrumbExtras={setBreadcrumbExtras}
                                setBreadcrumb={setBreadcrumb} is_create={true}  {...props} />} />

                        <Route path={paths.category.rlist} key={paths.category.key}
                            element={<CategoryListForm setBreadcrumb={setBreadcrumb}  {...props} />} />
                        <Route path={paths.category.radd} key={paths.category.key}
                            element={userInfo && userInfo.is_manager == false ? <Navigate to="/dang-nhap" /> : <CategoryChangeForm
                                breadcrumb_extras={breadcrumb_extras} setBreadcrumbExtras={setBreadcrumbExtras}
                                setBreadcrumb={setBreadcrumb} is_create={true} {...props} />} />
                        <Route path={paths.category.rchange} key={paths.category.key}
                            element={userInfo && userInfo.is_manager == false ? <Navigate to="/dang-nhap" /> : <CategoryChangeForm
                                breadcrumb_extras={breadcrumb_extras} setBreadcrumbExtras={setBreadcrumbExtras}
                                setBreadcrumb={setBreadcrumb} is_create={false} {...props} />} />

                        <Route path={paths.order.rlist} key={paths.order.key}
                            element={<OrderListForm setBreadcrumb={setBreadcrumb} {...props} />} />

                        <Route path={paths.order_refund.rlist} key={paths.order_refund.key}
                            element={<RefundListForm setBreadcrumb={setBreadcrumb} {...props} />} />

                        <Route path={paths.sell.rlist} key={paths.sell.key}
                            element={<SellPage setBreadcrumb={setBreadcrumb} {...props} />} />

                        <Route path={paths.statistics_sales.rlist} key={paths.statistics_sales.key}
                            element={userInfo && userInfo.is_manager == false ? <Navigate to="/dang-nhap" /> : <StatisticsSales setBreadcrumb={setBreadcrumb} {...props} />} />

                        <Route path={paths.statistics_refund.rlist} key={paths.statistics_refund.key}
                            element={userInfo && userInfo.is_manager == false ? <Navigate to="/dang-nhap" /> : <StatisticsRefund setBreadcrumb={setBreadcrumb} {...props} />} />

                        <Route path={paths.statistics_promotion.rlist} key={paths.statistics_promotion.key}
                            element={userInfo && userInfo.is_manager == false ? <Navigate to="/dang-nhap" /> : <StatisticsPromotion setBreadcrumb={setBreadcrumb} {...props} />} />

                        <Route path={paths.statistics_receiving.rlist} key={paths.statistics_receiving.key}
                            element={userInfo && userInfo.is_manager == false ? <Navigate to="/dang-nhap" /> : <StatisticsReceived setBreadcrumb={setBreadcrumb} {...props} />} />

                        <Route path={paths.statistics_inventory.rlist} key={paths.statistics_inventory.key}
                            element={userInfo && userInfo.is_manager == false ? <Navigate to="/dang-nhap" /> : <StatisticsInventory setBreadcrumb={setBreadcrumb} {...props} />} />
                    </Routes >
                </Suspense>
            </Content>
        </div>
    )

}


export default MyContent;