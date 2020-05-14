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
exports.__esModule = true;
var axios_1 = __importDefault(require("axios"));
var qs = __importStar(require("querystring"));
var METHOD_GET = "get";
var METHOD_POST = "post";
var METHOD_PUT = "put";
var METHOD_DELETE = "delete";
function requestAPI(method, url, _headers, _dataBody, isJSON) {
    if (isJSON === void 0) { isJSON = false; }
    var headers = _headers;
    var dataBody = _dataBody;
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
    var config = {
        url: url,
        headers: headers,
        method: method,
        validateStatus: function () { return true; }
    };
    if (method === METHOD_GET) {
        config.params = dataBody;
        config.paramsSerializer = function (params) {
            return qs.stringify(params);
        };
    }
    else {
        config.data = dataBody;
    }
    return axios_1["default"](config);
}
var HttpClient = {
    get: function (url, dataBody, isJSON, headers) {
        if (dataBody === void 0) { dataBody = {}; }
        if (isJSON === void 0) { isJSON = false; }
        if (headers === void 0) { headers = {}; }
        return requestAPI(METHOD_GET, url, headers, dataBody, isJSON);
    },
    post: function (url, dataBody, isJSON, headers) {
        if (dataBody === void 0) { dataBody = {}; }
        if (isJSON === void 0) { isJSON = false; }
        if (headers === void 0) { headers = {}; }
        return requestAPI(METHOD_POST, url, headers, dataBody, isJSON);
    },
    put: function (url, dataBody, isJSON, headers) {
        if (dataBody === void 0) { dataBody = {}; }
        if (isJSON === void 0) { isJSON = false; }
        if (headers === void 0) { headers = {}; }
        return requestAPI(METHOD_PUT, url, headers, dataBody, isJSON);
    },
    "delete": function (url, dataBody, isJSON, headers) {
        if (dataBody === void 0) { dataBody = {}; }
        if (isJSON === void 0) { isJSON = false; }
        if (headers === void 0) { headers = {}; }
        return requestAPI(METHOD_DELETE, url, headers, dataBody, isJSON);
    }
};
exports["default"] = HttpClient;
