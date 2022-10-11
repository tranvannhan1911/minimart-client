import axiosApi from "./axios"
import Cookies from "js-cookie"

class AccountApi{
    login(params){
        const url = "/account/login/"
        return axiosApi.post(url, params)
    }

    forgot_password(params){
        const url = "/account/forgot_password/"
        return axiosApi.post(url, params)
    }

    forgot_password_verify(params){
        const url = "/account/forgot_password/verify/"
        return axiosApi.post(url, params)
    }

    change_password(params){
        const url = "/account/change_password/"
        return axiosApi.post(url, params)
    }

    get_info(params){
        const url = "/account/get_info/"
        return axiosApi.get(url, params)
    }

    save_token(response){
        Cookies.set(
            "access",
            response.data.data.access
        );
        Cookies.set(
            "refresh",
            response.data.data.refresh
        );
    }

    remove_token(response){
        Cookies.remove("access")
        Cookies.remove("refresh")
    }

    get_token(){
        return {
            access: Cookies.get("access"),
            refresh: Cookies.get("refresh"),
        }
    }
}

const getApi = (resource, extras) => {
    return {
        listBuy: (params) => {
            const url = `/${resource}/?sellable=true`
            return axiosApi.get(url, params)
        },
        listPromotionByOrder: (params) => {
            const url = `/${resource}/by_order/`
            return axiosApi.get(url, params)
        },
        listPromotionByProduct: (params) => {
            const url = `/${resource}/by_product/`
            return axiosApi.get(url, params)
        },
        list: (params) => {
            const url = `/${resource}/`
            return axiosApi.get(url, params)
        },
        get: (id, params) => {
            const url = `/${resource}/${id}/`
            return axiosApi.get(url, params)
        },
        add: (params) => {
            const url = `/${resource}/`
            return axiosApi.post(url, params)
        },
        update: (id, params) => {
            const url = `/${resource}/${id}/`
            return axiosApi.put(url, params)
        },
        delete: (id, params) => {
            const url = `/${resource}/${id}/`
            return axiosApi.delete(url, params)
        },
        ...extras
    }
}

const promotion_line_extras = {
    by_product: (params) => {
        console.log("by_product", params)
        const url = `/promotion-line/by_product/`
        return axiosApi.get(url, params)
    },
    by_order: (params) => {
        const url = `/promotion-line/by_order/`
        return axiosApi.get(url, params)
    },
    by_type: (params) => {
        const url = `/promotion-line/by_type/`
        return axiosApi.get(url, params)
    }
}


const category_extras = {
    to_select: (params) => {
        const url = `/category/to_select/`
        return axiosApi.get(url, params)
    },
    get_parent: (id, params) => {
        const url = `/category/get_parent/${id}`
        return axiosApi.get(url, params)
    }
}

const address_extras = {
    to_select: (params) => {
        const url = `/address/tree/`
        return axiosApi.get(url, params)
    },
    get_parent: (id, params) => {
        const url = `/address/path/${id}`
        return axiosApi.get(url, params)
    }
}

const api = {
    customer: getApi("customer"),
    customer_group: getApi("customer-group"),
    staff: getApi("staff"),
    supplier: getApi("supplier"),
    product_group: getApi("product-group"),
    unit: getApi("calculation-unit"),
    product: getApi("product"),
    price: getApi("price-list"),
    inventory_receiving: getApi("inventory-receiving"),
    inventory_record: getApi("inventory-record"),
    warehouse_transaction: getApi("warehouse-transaction"),
    promotion: getApi("promotion"),
    promotion_line: getApi("promotion-line", promotion_line_extras),
    order: getApi("order"),
    order_refund: getApi("refund"),
    category: getApi("category", category_extras),
    address: getApi("address", address_extras),
}

export {AccountApi};
export default api;