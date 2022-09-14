
const getChangePath = (key, id) => {
    return `/quan-ly/${key}/${id}`
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
    s3: (filename) => `https://minimart-tvn1911.s3.ap-southeast-1.amazonaws.com/${filename}`,
}

const paths = Paths;
export default paths;