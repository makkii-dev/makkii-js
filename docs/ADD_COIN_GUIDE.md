1. Create new coin package
```bash
$ lerna create @makkii/app-<coin symbol>
```
2. add makkii-core dependency
```bash
$ lerna add @makkii/makkii-core --scope @makkii/app-<coin symbol>
```
3. implement [IsingleApiClient]() or [IsingleApiFullClient]() interfaces

Example: 
```typescript
import { IsingleApiClient } from '@makkii/makkii-core/src/interfaces/api_client';

class ExampleApiClient implements IsingleApiClient {
    symbol: string = "ExampleCoinSymbol";

    getNetwork = () => this.config.network;
    ...
}
```
4. implement [IsingleKeystoreClient]() interface

Example:
```typescript
import { IsingleKeystoreClient } from '@makkii/makkii-core/src/interfaces/keystore_client';

class ExampleKeystoreClient implements IsingleKeystoreClient {
    signTransaction =(tx: UnsignedTx, signer: IkeystoreSigner, singerParams: any) => {
        return signer.signTransaction(tx, signerParams);
    }
    ...
}
```
5. implement [IkeystoreSigner]() interface

Example:
```typescript
import { IkeystoreSigner } from '@makkii/makkii-core/src/interfaces/keystore_client';

class ExampleSigner implements IkeystoreSigner {
    signTransaction = async (
        tx: AionUnsignedTx,
        params: { private_key: string }
    ): Promise<string> => {
        ...
    }
}
```
6. (Optional) if you support hardware wallet on your coin, implement [IHardware]() interface
```typescript
import { IHardware } from '@makkii/makkii-core/src/interfaces/hardware';

class ExampleLedger implements IHardware {
    getAccount = async(index: number) => {
        ...
    }
    ...
}
```