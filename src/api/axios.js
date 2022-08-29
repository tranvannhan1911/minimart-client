import axios from "axios";
import queryString from "query-string";
// import Cookies from "js-cookie";

const base_usl = "http://localhost:8000/api"
// const base_usl = "http://34.87.181.95:8000/api"

const axiosApi = axios.create({
    baseURL: base_usl,
    headers: {
        "Content-Type": "application/json",
    },
    paramsSerializer: (params) => queryString.stringify(params),
});

export default axiosApi;