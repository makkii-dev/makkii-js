const assert = require("assert");
const describe = require("mocha").describe;
import {config, customConfig} from "../coins/serverConfig";
import customConfig1 from './res/customConfig';

describe('common test', function () {
    it('test custom config server', function () {
        assert.strictEqual(config.coins.aion.networks.mainnet.jsonrpc, 'https://aion.api.nodesmith.io/v1/mainnet/jsonrpc?apiKey=c8b8ebb4f10f40358b635afae72c2780');
        customConfig(customConfig1);
        assert.strictEqual(config.coins.aion.networks.mainnet.jsonrpc, '123');
    })
});
