const getMessageSuccessSave = (object, id) => {
    if(id) return `Lưu ${object} có mã ${id} thành công`
    return `Lưu ${object} thành công`
}

const getMessageSuccessDelete = (object, id) => {
    if(id) return `Xóa thành công ${object} có mã là ${id}`
    return `Xóa ${object} này thành công`
}

const getMessageErrorDelete = (object, id) => {
    if(id) return `Không thể xóa ${object} có mã là ${id}!`
    return `Không thể xóa ${object} này!`
}

const Messages = {
    ERROR: "Có lỗi xảy ra, vui lòng thử lại",
    ERROR_REFRESH: "Có lỗi xảy ra, vui lòng tải lại trang",
    SUCCESS_SAVE: (object, id) => getMessageSuccessSave(object, id),
    SUCCESS_DELETE: (object, id) => getMessageSuccessDelete(object, id),

    SUCCESS_SAVE_CUSTOMER: (id) => getMessageSuccessSave("khách hàng", id),
    SUCCESS_DELETE_CUSTOMER: (id) => getMessageSuccessDelete("khách hàng", id),
    ERROR_DELETE_CUSTOMER: (id) => getMessageErrorDelete("khách hàng", id),

    SUCCESS_SAVE_CUSTOMER_GROUP: (id) => getMessageSuccessSave("nhóm khách hàng", id),
    SUCCESS_DELETE_CUSTOMER_GROUP: (id) => getMessageSuccessDelete("nhóm khách hàng", id),
    ERROR_DELETE_CUSTOMER_GROUP: (id) => getMessageErrorDelete("nhóm khách hàng", id),

    SUCCESS_SAVE_STAFF: (id) => getMessageSuccessSave("nhân viên", id),
    SUCCESS_DELETE_STAFF: (id) => getMessageSuccessDelete("nhân viên", id),
    ERROR_DELETE_STAFF: (id) => getMessageErrorDelete("nhân viên", id),
}

const messages = Messages;
export default messages;