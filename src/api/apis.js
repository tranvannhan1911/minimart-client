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

class CustomerApi{
    list(params){
        const url = "/customer/"
        return axiosApi.get(url, params)
    }

    get(id, params){
        const url = "/customer/"+id+"/"
        return axiosApi.get(url, params)
    }

    add(params){
        const url = "/customer/"
        return axiosApi.post(url, params)
    }

    update(id, params){
        const url = "/customer/"+id+"/"
        return axiosApi.put(url, params)
    }

    delete(id, params){
        const url = "/customer/"+id+"/"
        return axiosApi.delete(url, params)
    }
    

    customer_group_list(params){
        const url = "/customer-group/"
        return axiosApi.get(url, params)
    }

    customer_group_get(id, params){
        const url = "/customer-group/"+id+"/"
        return axiosApi.get(url, params)
    }

    customer_group_add(params){
        const url = "/customer-group/"
        return axiosApi.post(url, params)
    }

    customer_group_update(id, params){
        const url = "/customer-group/"+id+"/"
        return axiosApi.put(url, params)
    }

    customer_group_delete(id, params){
        const url = "/customer-group/"+id+"/"
        return axiosApi.delete(url, params)
    }
}

class StaffApi{
    list(params){
        const url = "/staff/"
        return axiosApi.get(url, params)
    }

    get(id, params){
        const url = "/staff/"+id+"/"
        return axiosApi.get(url, params)
    }

    add(params){
        const url = "/staff/"
        return axiosApi.post(url, params)
    }

    update(id, params){
        const url = "/staff/"+id+"/"
        return axiosApi.put(url, params)
    }

    delete(id, params){
        const url = "/staff/"+id+"/"
        return axiosApi.delete(url, params)
    }
}

class SupplierApi{
    list(params){
        const url = "/supplier/"
        return axiosApi.get(url, params)
    }

    get(id, params){
        const url = "/supplier/"+id+"/"
        return axiosApi.get(url, params)
    }

    add(params){
        const url = "/supplier/"
        return axiosApi.post(url, params)
    }

    update(id, params){
        const url = "/supplier/"+id+"/"
        return axiosApi.put(url, params)
    }

    delete(id, params){
        const url = "/supplier/"+id+"/"
        return axiosApi.delete(url, params)
    }
}
export {AccountApi, CustomerApi, StaffApi, SupplierApi};