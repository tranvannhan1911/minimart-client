
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
}

const paths = Paths;
export default paths;