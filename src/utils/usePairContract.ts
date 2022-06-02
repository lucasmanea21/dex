import { useEffect, useState } from 'react';
import {
  useGetAccountInfo,
  useGetNetworkConfig
} from '@elrondnetwork/dapp-core';
import { ApiNetworkProvider } from '@elrondnetwork/erdjs-network-providers';
import {
  AbiRegistry,
  Address,
  SmartContract,
  SmartContractAbi
} from '@elrondnetwork/erdjs/out';
import jsonContent from '../abis/pair.abi.json';
import PairContract from '../apiRequests/pairContract';
import { pairContractAddress, TIMEOUT } from '../config';

const usePairContract = () => {
  const [pairContract, setPairContract] = useState<PairContract | null>(null);
  const { account } = useGetAccountInfo();
  const { network } = useGetNetworkConfig();

  const loadContract = async () => {
    if (account.address) {
      try {
        const json = JSON.parse(JSON.stringify(jsonContent));
        const abiRegistry = AbiRegistry.create(json);
        const abi = new SmartContractAbi(abiRegistry, ['PairContract']);

        const contract = new SmartContract({
          address: new Address(pairContractAddress),
          abi: abi
        });
        const provider = new ApiNetworkProvider(network.apiAddress, {
          timeout: TIMEOUT
        });

        provider
          .getNetworkConfig()
          .then(() =>
            setPairContract(new PairContract(account, contract, provider))
          );
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    loadContract();
  }, [network, account]);

  return {
    pairContract
  };
};

export default usePairContract;
