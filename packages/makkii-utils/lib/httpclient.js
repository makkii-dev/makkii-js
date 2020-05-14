"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const qs = __importStar(require("querystring"));
const METHOD_GET = "get";
const METHOD_POST = "post";
const METHOD_PUT = "put";
const METHOD_DELETE = "delete";
function requestAPI(method, url, _headers, _dataBody, isJSON = false) {
    const headers = _headers;
    let dataBody = _dataBody;
    if (isJSON) {
        headers["Content-Type"] = "application/json";
    }
    if (isJSON && (method === METHOD_POST || method === METHOD_PUT)) {
        headers["Content-Type"] = "application/json";
    }
    else if (method === METHOD_POST || method === METHOD_PUT) {
        headers["Content-Type"] = "application/x-www-form-urlencoded";
        dataBody = qs.stringify(dataBody);
    }
    const config = {
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
    }
    else {
        config.data = dataBody;
    }
    return axios_1.default(config);
}
const HttpClient = {
    get(url, dataBody = {}, isJSON = false, headers = {}) {
        return requestAPI(METHOD_GET, url, headers, dataBody, isJSON);
    },
    post(url, dataBody = {}, isJSON = false, headers = {}) {
        return requestAPI(METHOD_POST, url, headers, dataBody, isJSON);
    },
    put(url, dataBody = {}, isJSON = false, headers = {}) {
        return requestAPI(METHOD_PUT, url, headers, dataBody, isJSON);
    },
    delete(url, dataBody = {}, isJSON = false, headers = {}) {
        return requestAPI(METHOD_DELETE, url, headers, dataBody, isJSON);
    }
};
exports.default = HttpClient;
//# sourceMappingURL=httpclient.js.map