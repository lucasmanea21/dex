import React, { useState, useEffect } from 'react';
import {
  refreshAccount,
  sendTransactions,
  useGetAccountInfo
} from '@elrondnetwork/dapp-core';

import { Account } from '@elrondnetwork/erdjs/out';
import {
  Box,
  Button,
  Card,
  TextField,
  Typography,
  Container,
  Select,
  MenuItem,
  NativeSelect
} from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { contractAddress } from 'config';
import usePairContract from 'utils/usePairContract';
import data from './data.json';

const SwapCard = () => {
  const { account } = useGetAccountInfo();
  const { pairContract } = usePairContract();

  const [fromCurrency, setFromCurrency] = useState('LAND');
  const [toCurrency, setToCurrency] = useState('EGLD');
  const [amount, setAmount] = useState(0);
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);
  const [error, setError] = useState(false);
  const [isWhitelisted, setIsWhitelisted] = useState(false);
  const [landBalance, setLandBalance] = useState(0);
  const [isOver, setIsOver] = useState(false);
  // const { address, account, ...rest } = useGetAccountInfo();
  const [firstTokenId, setFirstTokenId] = useState('');
  const [secondTokenId, setSecondTokenId] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const counterDate = 1645550940000;
  const exchangeRate = 0.0002;
  let toAmount, fromAmount;

  const checkIfBigger = () => {
    if (!isWhitelisted) {
      setError(true);
    } else {
      if (amountInFromCurrency) {
        Number(amount) > 5000
          ? setError(true)
          : Number(amount) < 1000
          ? setError(true)
          : setError(false);
      } else {
        Number(amount) > 1 - landBalance / 1000
          ? setError(true)
          : Number(amount) < 0.2
          ? setError(true)
          : setError(false);
      }
    }
  };

  if (amountInFromCurrency) {
    fromAmount = amount;
    toAmount = amount * exchangeRate;
  } else {
    toAmount = amount;
    fromAmount = amount / exchangeRate;
  }

  interface Props {
    selectedCurrency: string;
    onChangeAmount: any;
    amount: number;
    type: string;
  }

  useEffect(() => {
    data?.data?.map((item: any) => {
      if (item.address === account.address) {
        setIsWhitelisted(true);
      }
    });
  }, []);

  // useEffect(() => {
  //   axios
  //     .get(`https://api.elrond.com/accounts/${account.address}/tokens`)
  //     .then((res) => {
  //       setLandBalance(
  //         res.data.filter((a: any) => a.identifier === 'LAND-40f26f')[0]
  //           .balance /
  //           10 ** 18
  //       );
  //     });
  // }, []);

  // useEffect(() => {
  //   checkIfBigger();
  // }, [amount]);

  useEffect(() => {
    const getPairs = async () => {
      await pairContract
        ?.queryEndpoint('getFirstTokenId')
        .then((res) => console.log(res));
      await pairContract
        ?.queryEndpoint('getSecondTokenId')
        .then((res) => console.log(res));
    };

    getPairs();
  }, []);

  useEffect(() => {
    isOver && setIsWhitelisted(true);
  }, [isOver]);

  // useEffect(() => {
  //   isWhitelisted && setError(false);
  // }, [isWhitelisted]);

  useEffect(() => {
    !isWhitelisted && setError(true);
  }, [isWhitelisted]);

  console.log(account.balance);

  const CurrencyRow: React.FC<Props> = ({ onChangeAmount, amount, type }) => {
    return (
      <div style={{ width: '100%', position: 'relative' }}>
        <TextField
          type='number'
          className='input'
          value={amount}
          onChange={onChangeAmount}
          style={{ width: '100%', padding: 10, borderRadius: 15 }}
          variant='outlined'
          disabled={type === 'LAND'}
        />
        <div style={{ position: 'absolute', right: '15%', top: '35%' }}>
          {type}
        </div>
      </div>
    );
  };

  const handleMaxAmount = () => {
    setAmount(5000 - landBalance * 5);
  };

  async function buyToken(e: any) {
    e.preventDefault();
    const tx = {
      value: account.balance,
      data: 'buy',
      receiver: contractAddress
    };
    await refreshAccount();
    await sendTransactions({
      transactions: tx
    });
  }

  function handleFromAmountChange(e: any) {
    e.preventDefault();
    setAmount(e.target.value);
    setAmountInFromCurrency(true);
  }

  function handleToAmountChange(e: any) {
    e.preventDefault();

    setAmount(e.target.value);
    setAmountInFromCurrency(false);
  }

  const tokens = ['EGLD', 'ETH', 'MEX', 'LAND'];
  return (
    <Card
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',

        padding: 50,
        width: '100%',
        maxWidth: 450
      }}
    >
      <Typography variant='h4' style={{ marginBottom: 15 }}>
        Elrond DEX
      </Typography>
      <Typography variant='body1' style={{ marginBottom: 15 }}>
        Swap {firstTokenId} for {secondTokenId}
      </Typography>
      <Box
        style={{
          width: '100%'
        }}
      >
        <NativeSelect
          defaultValue={tokens[0]}
          onChange={(e) => setToCurrency(e.target.value)}
        >
          {tokens.map((item, i) => (
            <option value={item} key={i}>
              {item}
            </option>
          ))}
        </NativeSelect>
        {CurrencyRow({
          selectedCurrency: toCurrency,
          onChangeAmount: handleToAmountChange,
          amount: toAmount,
          type: toCurrency
        })}

        <div style={{ textAlign: 'center' }}>=</div>
        <Select
          onChange={(event) => setFromCurrency(event.target.value as string)}
        >
          {tokens.map((item, i) => (
            <MenuItem value={item} key={i}>
              {item}
            </MenuItem>
          ))}
        </Select>
        {CurrencyRow({
          selectedCurrency: fromCurrency,
          onChangeAmount: handleFromAmountChange,
          amount: fromAmount,
          type: fromCurrency
        })}

        <Button
          variant='text'
          style={{ textTransform: 'none' }}
          onClick={handleMaxAmount}
        >
          Max
        </Button>

        <Typography variant='body1' style={{ marginTop: 10 }}>
          {' '}
          Balance:{' '}
          {parseFloat((Number(account.balance) / 10 ** 18).toString()).toFixed(
            5
          )}{' '}
          EGLD
        </Typography>

        <Typography variant='body1'>
          {' '}
          You own: {parseFloat(Number(landBalance * 5).toString()).toFixed(
            2
          )}{' '}
          LAND
        </Typography>
        <Typography>Min buy: 0.2 EGLD</Typography>
        <Typography>Max buy: 1 EGLD</Typography>
      </Box>
      <Button
        variant='contained'
        style={{
          width: '100%',
          marginTop: 20,
          marginBottom: 20,
          textTransform: 'none',
          fontSize: 18
        }}
        disabled
      >
        Sold out
      </Button>
      <Typography variant='body1'> 1 EGLD = 5000 LAND</Typography>
      {}
    </Card>
  );
};

export default SwapCard;
