
const getChangePath = (key, id) => {
    return `/quan-ly/${key}/${id}`
}

const getChangeLinePath = (key, id) => {
    return `/quan-ly/${key}/them-khuyen-mai/${id}`
}

const getPaths = (key, id) => {
    return {
        key: key,
        list: `/quan-ly/${key}`,
        rlist: key,
        add: `/quan-ly/${key}/them-moi`,
        radd: `${key}/them-moi`,
        change: (id) => getChangePath(key, id),
        rchange: `${key}/:${id}`,
        addline: (id) => getChangeLinePath(key, id),
        raddline: `${key}/them-khuyen-mai/:${id}`,
    }
}


const Paths = {
    management: "/quan-ly",
    customer: getPaths("khach-hang", "customer_id"),
    staff: getPaths("nhan-vien", "id"),
    customer_group: getPaths("nhom-khach-hang", "id"),
    supplier: getPaths("nha-cung-cap", "id"),
    product_group: getPaths("nhom-san-pham", "id"),
    unit: getPaths("don-vi-tinh", "id"),
    product: getPaths("san-pham", "id"),
    price: getPaths("bang-gia","id"),
    inventory_receiving: getPaths("phieu-nhap-hang","id"),
    inventory_record: getPaths("phieu-kiem-ke","id"),
    warehouse_transaction: getPaths("bien-dong-kho","id"),
    promotion: getPaths("khuyen-mai","id"),
    order: getPaths("don-ban-hang","id"),
    order_refund: getPaths("don-tra-hang","id"),
    sell: getPaths("ban-hang","id"),
    statistics_order_refund: getPaths("ban-hang-tra-hang","id"),
    statistics_profit_revenue: getPaths("loi-nhuan-doanh-thu","id"),
    statistics_received: getPaths("nhap-hang","id"),
    statistics_record: getPaths("kiem-ke","id"),

    
    s3: (filename) => `https://minimart-tvn1911.s3.ap-southeast-1.amazonaws.com/${filename}`,
}

const paths = Paths;
export default paths;