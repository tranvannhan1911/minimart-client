export const formater = (date) => {
    return (new Date(Date.parse(date))).toLocaleString("vi-VI")
}

export const tagStatusColor = (status) => {
    if (status == 'pending') {
        return 'processing';
    } else if (status == 'complete') {
        return 'success';
    } else {
        return 'warning';
    }
};

export const tagStatus = (status) => {
    if (status == "complete")
        return "Hoàn thành"
    else if(status == "refund")
        return "Đã trả hàng"
    else
        return "Đã hủy"
}