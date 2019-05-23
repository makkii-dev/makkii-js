import { NativeModules } from 'react-native';
import {CoinType} from './coinType';
const { RNMakkiiCore } = NativeModules;

export default {
    ...RNMakkiiCore,
    CoinType
};
