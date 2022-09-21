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

const getApi = (resource) => {
    return {
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
        }
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

}

export {AccountApi};
export default api;