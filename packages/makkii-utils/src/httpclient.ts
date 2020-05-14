import axios, { AxiosRequestConfig, Method } from "axios";
import * as qs from "querystring";

const METHOD_GET = "get";
const METHOD_POST = "post";
const METHOD_PUT = "put";
const METHOD_DELETE = "delete";

function requestAPI(
    method: Method,
    url: string,
    _headers: any,
    _dataBody,
    isJSON = false
) {
    const headers = _headers;
    let dataBody = _dataBody;

    if (isJSON) {
        headers["Content-Type"] = "application/json";
    }

    if (isJSON && (method === METHOD_POST || method === METHOD_PUT)) {
        headers["Content-Type"] = "application/json";
    } else if (method === METHOD_POST || method === METHOD_PUT) {
        headers["Content-Type"] = "application/x-www-form-urlencoded";
        dataBody = qs.stringify(dataBody);
    }
    const config: AxiosRequestConfig = {
        url,
        headers,
        method,
        validateStatus: () => true
    };

    if (method === METHOD_GET) {
        config.params = dataBody;
        config.paramsSerializer = params => {
            return qs.stringify(params);
        };
    } else {
        config.data = dataBody;
    }

    return axios(config);
}

const HttpClient = {
    get(url: string, dataBody = {}, isJSON = false, headers = {}) {
        return requestAPI(METHOD_GET, url, headers, dataBody, isJSON);
    },

    post(url: string, dataBody = {}, isJSON = false, headers = {}) {
        return requestAPI(METHOD_POST, url, headers, dataBody, isJSON);
    },

    put(url: string, dataBody = {}, isJSON = false, headers = {}) {
        return requestAPI(METHOD_PUT, url, headers, dataBody, isJSON);
    },

    delete(url: string, dataBody = {}, isJSON = false, headers = {}) {
        return requestAPI(METHOD_DELETE, url, headers, dataBody, isJSON);
    }
};

export default HttpClient;
