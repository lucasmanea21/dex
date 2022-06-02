import { useEffect, useState } from 'react';
import {
  useGetAccountInfo,
  useGetNetworkConfig
} from '@elrondnetwork/dapp-core';
import { ApiNetworkProvider } from '@elrondnetwork/erdjs-network-providers';
import { Address, SmartContract } from '@elrondnetwork/erdjs/out';
import DexContract from '../apiRequests/routerContract';
import { contractAddress, TIMEOUT } from '../config';

const useDexContract = () => {
  const [dexContract, setDexContract] = useState<DexContract | null>(null);
  const { account } = useGetAccountInfo();
  const { network } = useGetNetworkConfig();

  const loadContract = async () => {
    if (account.address) {
      const contract = new SmartContract({
        address: new Address(contractAddress)
      });
      const provider = new ApiNetworkProvider(network.apiAddress, {
        timeout: TIMEOUT
      });
      provider
        .getNetworkConfig()
        .then(() =>
          setDexContract(new DexContract(account, contract, provider))
        );
    }
  };

  console.log(network, account);
  useEffect(() => {
    loadContract();
  }, [network, account]);

  return {
    dexContract
  };
};

export default useDexContract;
