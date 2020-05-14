declare const HttpClient: {
    get(url: string, dataBody?: {}, isJSON?: boolean, headers?: {}): import("axios").AxiosPromise<any>;
    post(url: string, dataBody?: {}, isJSON?: boolean, headers?: {}): import("axios").AxiosPromise<any>;
    put(url: string, dataBody?: {}, isJSON?: boolean, headers?: {}): import("axios").AxiosPromise<any>;
    delete(url: string, dataBody?: {}, isJSON?: boolean, headers?: {}): import("axios").AxiosPromise<any>;
};
export default HttpClient;
