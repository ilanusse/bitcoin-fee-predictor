const { Messages, Pool } = require('bitcore-p2p'),
  { Networks } = require('bitcore-lib'),
  WebSocket = require('ws'),
  transactionService = require('./transactionService'),
  blockService = require('./blockService');

exports.init = () => {
  console.log('Connected to blockchain for transactions...');
  let timestamp = new Date();
  const ws = new WebSocket('wss://ws.blockchain.info/inv');

  const checkForPing = () => {
    const newTimestamp = new Date();
    if (Math.floor((newTimestamp - timestamp) / 1000) > 20) {
      ws.send(JSON.stringify({ op: 'ping' }));
      console.log('ping');
      timestamp = newTimestamp;
    }
  }

  ws.on('open', () => {
    ws.send(JSON.stringify({ op: 'unconfirmed_sub' }));
  });

  ws.on('message', (data, flags) => {
    const op = JSON.parse(data);
    checkForPing();
    if (op.op === 'pong') {
      console.log('pong');
    }

    if (op.op === 'utx') {
      transactionService.handleTransaction(op.x);
    }
    // flags.binary will be set if a binary data is received.
    // flags.masked will be set if the data was masked.
  });

  const pool = new Pool({ network: Networks.livenet });
  pool.connect();
  console.log('Connected to bitcoin P2P network for blocks...');

  pool.on('peerinv', (peer, message) => {
    const peerMessage = new Messages().GetData(message.inventory);
    peer.sendMessage(peerMessage);
  });

  pool.on('peerblock', (peer, { network, block }) => {
    blockService.handleBlock(block);
  });
};
