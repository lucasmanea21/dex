import { refreshAccount, sendTransactions } from '@elrondnetwork/dapp-core';
import {
  ApiNetworkProvider,
  ProxyNetworkProvider
} from '@elrondnetwork/erdjs-network-providers';
import {
  Account,
  Address,
  AddressValue,
  ContractFunction,
  BigUIntValue,
  BytesValue,
  List,
  ListType,
  ResultsParser,
  SmartContract,
  TransactionPayload,
  U32Type,
  Transaction
} from '@elrondnetwork/erdjs/out';
import { contractAddress } from 'config';

export default class DexContract {
  contract: SmartContract;
  userAddress: Address;
  userAccount: Account;
  provider: ApiNetworkProvider;

  constructor(
    account: any,
    contract: SmartContract,
    provider: ApiNetworkProvider
  ) {
    this.userAddress = new Address(account.address);
    this.userAccount = account;
    this.contract = contract;
    this.provider = provider;
  }

  getAllPairTokens = async () => {
    const query = this.contract.createQuery({
      func: new ContractFunction('getAllPairTokens'),
      caller: this.userAddress
    });

    const queryResponse = await this.provider.queryContract(query);
    const parser = new ResultsParser();
    const bundle = parser.parseUntypedQueryResponse(queryResponse);

    return bundle.values;
  };

  createPairTransaction = async (token1: string, token2: string) => {
    const args: any[] = [
      BytesValue.fromUTF8(token1),
      BytesValue.fromUTF8(token2)
    ];

    const payload = TransactionPayload.contractCall()
      .setFunction(new ContractFunction('createPair'))
      .setArgs(args)
      .build();

    const tx = new Transaction({
      receiver: new Address(contractAddress),
      gasLimit: 100000000,
      data: payload,
      chainID: 'D'
    });

    try {
      console.log(token1, token2);
      console.log('tx', tx);
      // tx.setNonce(this.userAccount.nonce);
      await refreshAccount();

      console.log(
        await sendTransactions({
          transactions: tx
        })
      );

      // return sessionId;
    } catch (error) {
      console.log(error);
    }
  };
}
