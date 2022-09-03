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

    add(params){
        const url = "/customer/add/"
        return axiosApi.post(url, params)
    }

    update(id, params){
        const url = "/customer/"+id+"/update/"
        return axiosApi.put(url, params)
    }
    
    get(id, params){
        const url = "/customer/"+id+"/"
        return axiosApi.get(url, params)
    }

    customer_group_list(params){
        const url = "/customer-group/"
        return axiosApi.get(url, params)
    }
}

export {AccountApi, CustomerApi};