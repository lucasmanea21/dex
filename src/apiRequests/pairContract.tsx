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
  Interaction,
  TransactionPayload,
  U32Type,
  Transaction
} from '@elrondnetwork/erdjs/out';
import { pairContractAddress } from 'config';
import { constants } from 'zlib';

export default class PairContract {
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

  queryEndpoint = async (endpoint: string) => {
    const query = this.contract.createQuery({
      func: new ContractFunction(endpoint),
      caller: new Address(this.userAddress)
    });
    console.log('here');

    const parser = new ResultsParser();

    const queryResponse = await this.provider.queryContract(query);
    const endpointDefinition = this.contract.getEndpoint(endpoint);
    const { firstValue, secondValue, returnCode } = parser.parseQueryResponse(
      queryResponse,
      endpointDefinition
    );

    return { firstValue, secondValue, returnCode };
  };

  getEquivalent = async (token_in: string) => {
    const query = this.contract.createQuery({
      func: new ContractFunction('getEquivalent'),
      caller: new Address(this.userAddress),
      args: [token_in]
    });
    console.log('here');

    const parser = new ResultsParser();

    const queryResponse = await this.provider.queryContract(query);
    const endpointDefinition = this.contract.getEndpoint('getEquivalent');
    const { firstValue, secondValue, returnCode } = parser.parseQueryResponse(
      queryResponse,
      endpointDefinition
    );

    return { firstValue, secondValue, returnCode };
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
      receiver: new Address(pairContractAddress),
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
