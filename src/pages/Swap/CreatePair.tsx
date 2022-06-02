import React, { useState, useEffect } from 'react';
import { decodeBase64 } from '@elrondnetwork/dapp-core';
import { Card, Select, MenuItem, Button, NativeSelect } from '@mui/material';
import useDexContract from 'utils/useDexContract';
import usePairContract from 'utils/usePairContract';

const CreatePair = () => {
  const { dexContract } = useDexContract();
  const { pairContract } = usePairContract();
  const [token1, setToken1] = useState('');
  const [token2, setToken2] = useState('');
  const [firstTokenId, setFirstTokenId] = useState('asd');
  const [secondTokenId, setSecondTokenId] = useState('asd');
  const [response, setResponse] = useState('');

  const handleCreatePair = async () => {
    await dexContract?.createPairTransaction(token1, token2);
  };
  const tokens = ['EGLD', 'ETH', 'MEX', 'LAND'];

  function _arrayBufferToBase64(buffer: any) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  const getPairs = async () => {
    await pairContract
      ?.queryEndpoint('getFirstTokenId')
      .then((res) => {
        // console.log(res.f);
        setFirstTokenId(res?.firstValue?.valueOf());
        // console.log('first', res?.firstValue?.valueOf());
      })
      .catch((err) => console.log('error', err));

    await pairContract
      ?.queryEndpoint('getSecondTokenId')
      .then((res) => {
        // console.log(res.f);
        setSecondTokenId(res?.firstValue?.valueOf());
        // console.log('first', res?.firstValue?.valueOf());
      })
      .catch((err) => console.log('error', err));
  };

  // console.log(response);
  useEffect(() => {
    getPairs();
  }, []);

  console.log(firstTokenId);

  return (
    <Card
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',

        padding: 50,
        width: '100%',
        maxWidth: 450,
        marginTop: 20
      }}
    >
      <h2>Add pairs</h2>
      <NativeSelect
        onChange={(event) => setToken1(event.target.value as string)}
      >
        {tokens.map((item, i) => (
          <option value={item} key={i}>
            {item}
          </option>
        ))}
      </NativeSelect>
      <NativeSelect
        defaultValue={'ETH'}
        onChange={(event) => setToken2(event.target.value as string)}
      >
        {tokens.map((item, i) => (
          <option value={item} key={i}>
            {item}
          </option>
        ))}
      </NativeSelect>
      <Button onClick={handleCreatePair}>Create pair</Button>
    </Card>
  );
};

export default CreatePair;
