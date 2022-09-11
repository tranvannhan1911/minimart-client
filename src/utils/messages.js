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

const getMessage = (object) => {
    return {
        SUCCESS_SAVE: (id) => getMessageSuccessSave(object, id),
        SUCCESS_DELETE: (id) => getMessageSuccessDelete(object, id),
        ERROR_DELETE: (id) => getMessageErrorDelete(object, id),
    }
}

const Messages = {
    ERROR: "Có lỗi xảy ra, vui lòng thử lại",
    ERROR_REFRESH: "Có lỗi xảy ra, vui lòng tải lại trang",
    SUCCESS_SAVE: (object, id) => getMessageSuccessSave(object, id),
    SUCCESS_DELETE: (object, id) => getMessageSuccessDelete(object, id),

    customer: getMessage("khách hàng"),
    customer_group: getMessage("nhóm khách hàng"),
    staff: getMessage("nhân viên"),
    supplier: getMessage("nhà cung cấp"),
    product_group: getMessage("nhóm sản phẩm"),
}

const messages = Messages;
export default messages;