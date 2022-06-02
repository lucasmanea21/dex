import React from 'react';
import { Box, Grid } from '@mui/material';
import NextRound from './NextRound';
import SwapCard from './SwapCard';
import CreatePair from './CreatePair';
// import Upper from './Upper';

const Swap = () => {
  const cards = [
    // <Tokenomics key='tokenomics' />,
    <NextRound key='nRound' />
  ];
  return (
    <Box
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
      }}
    >
      {/* <Upper /> */}
      <section
        style={{
          width: '100%',
          marginBottom: 50,
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column'
        }}
      >
        <SwapCard />
        <CreatePair />
      </section>
      {/* <section
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 50
        }}
      >
         <Grid
          container
          spacing={3}
          style={{
            width: '90%',
            maxWidth: 1500,
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          {cards.map((card, i) => (
            <Grid
              item
              md={6}
              style={{ height: 350, marginBottom: 10 }}
              sm={6}
              xs={12}
              key={i}
            >
              {' '}
              {card}
            </Grid>
          ))}
        </Grid>
      </section> */}
    </Box>
  );
};

export default Swap;
