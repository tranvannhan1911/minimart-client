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
    unit: getMessage("đơn vị tính"),
    product: getMessage("sản phẩm"),
    price: getMessage("đơn giá"),
    inventory_receiving: getMessage("phiếu nhập hàng"),
    inventory_record: getMessage("phiếu kiểm kê"),
    warehouse_transaction: getMessage("biến động kho"),
    promotion: getMessage("chương trình khuyến mãi"),
    promotion_line: getMessage("khuyến mãi"),
    order: getMessage("đơn bán hàng"),
    order_refund: getMessage("đơn trả hàng"),
    category: getMessage("ngành hàng"),
}

const messages = Messages;
export default messages;