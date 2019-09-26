import server from './server';
import {deepMergeObject} from "../utils";

let config = {...server};

const customConfig  = (customServerConfig) => {
    config = deepMergeObject(config, customServerConfig)
};

export {
    config,
    customConfig
};
