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
}

export default AccountApi;