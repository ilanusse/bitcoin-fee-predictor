const db = require('./../orm').models,
  blockService = require('./blockService'),
  SIX_HOURS = 60 * 60 * 1000;

const calculateFee = (tx) => {
  let fee = 0;
  tx.inputs.forEach((input) => {
    fee += input.prev_out.value;
  });
  tx.out.forEach((output) => {
    fee -= output.value;
  });
  return fee;
}

const storeTransaction = (params) => {
  const hash = params.hash;
  return db.models.transaction.oneAsync({ hash }).then((tx) => {
    if (tx) {
      return tx;
    } else {
      return db.models.transaction.createAsync(params);
    }
  });
};

exports.findTransaction = (hash) => {
  return db.models.transaction.oneAsync({ hash });
};

exports.handleTransaction = (tx) => {
  const spb = calculateFee(tx) / tx.size;
  const hash = tx.hash;
  const timestamp = tx.time;
  const params = { spb, hash, timestamp, block_count: -1 };
  storeTransaction(params);
};

exports.confirm = (hash, blockTimestamp) => {
  exports.findTransaction(hash).then((transaction) => {
    if (!transaction) {
      return;
    }
    console.log('found transaction in the block');
    blockService.blockCountBetween(transaction.timestamp, blockTimestamp).then((blockCount) => {
      transaction.block_count = blockCount;
      transaction.save();
    });
  });
};


exports.getBuckets = () => {
  const buckets = {
  };
  [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 'over'].forEach((bucket) => {
    buckets[bucket] = {
      count: 0,
      totalBlocks: 0
    };
  });
  return db.models.transaction.findAsync().then((transactions) => { // queries not working properly
    transactions.forEach((transaction) => {
      if (transaction.block_count === -1 || transaction.timestamp < (+new Date() / 1000).toFixed(0) - SIX_HOURS) {
        return;
      }
      let selected = false;
      [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 'over'].forEach((bucket) => {
        if (selected) {
          return false;
        }
        if (bucket === 0) {
          if (transaction.spb === 0) {
            buckets[bucket].count += 1;
            buckets[bucket].totalBlocks += transaction.block_count;
            selected = true;
            return;
          }
        } else if (bucket === 'over') {
          buckets[bucket].count += 1;
          buckets[bucket].totalBlocks += transaction.block_count;
        } else {
          if (transaction.spb <= bucket) {
            buckets[bucket].count += 1;
            buckets[bucket].totalBlocks += transaction.block_count;
            selected = true;
          }
        }
      });
    });
    return buckets;
  });
};
