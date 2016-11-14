const db = require('./../orm').models,
  transactionService = require('./transactionService');

const storeBlock = (params) => {
  const hash = params.hash;
  return db.models.block.oneAsync({ hash }).then((tx) => {
    if (tx) {
      return tx;
    } else {
      return db.models.block.createAsync(params);
    }
  });
};

exports.findBlock = (hash) => {
  return db.models.block.oneAsync({ hash });
};

const processBlockTransactions = (block) => {
  block.transactions.forEach((transaction) => {
    transactionService.confirm(transaction.hash, block.header.time);
  });
};

exports.handleBlock = (block) => {
  const hash = block.header.hash;
  const timestamp = block.header.time;
  console.log('storing block');
  console.log({ hash, timestamp });
  storeBlock({ hash, timestamp }).then(() => {
    processBlockTransactions(block);
  });
};

exports.blockCountBetween = (txTimestamp, blockTimestamp) => {
  return db.models.block.findAsync().then((blocks) => { // querying not working well in this ORM...
    const filteredBlocks = blocks.filter((block) => {
      return block.timestamp >= txTimestamp && block.timestamp < blockTimestamp;
    });
    return filteredBlocks.length;
  })
};
