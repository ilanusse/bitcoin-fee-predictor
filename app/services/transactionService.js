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
    0: {
      count: 0,
      totalBlocks: 0
    },
    10: {
      count: 0,
      totalBlocks: 0
    },
    20: {
      count: 0,
      totalBlocks: 0
    },
    30: {
      count: 0,
      totalBlocks: 0
    },
    40: {
      count: 0,
      totalBlocks: 0
    },
    50: {
      count: 0,
      totalBlocks: 0
    },
    60: {
      count: 0,
      totalBlocks: 0
    },
    70: {
      count: 0,
      totalBlocks: 0
    },
    80: {
      count: 0,
      totalBlocks: 0
    },
    90: {
      count: 0,
      totalBlocks: 0
    },
    100: {
      count: 0,
      totalBlocks: 0
    },
    over: {
      count: 0,
      totalBlocks: 0
    }
  };
  return db.models.transaction.findAsync().then((transactions) => { // queries not working properly
    transactions.forEach((transaction) => {
      if (transaction.block_count === -1 || transaction.timestamp < (+new Date() / 1000).toFixed(0) - SIX_HOURS) {
        return;
      }
      if (transaction.spb === 0) {
        buckets[0].count += 1;
        buckets[0].totalBlocks += transaction.block_count;
        return;
      }

      if (transaction.spb <= 10) {
        buckets[10].count += 1;
        buckets[10].totalBlocks += transaction.block_count;
        return;
      }

      if (transaction.spb <= 20) {
        buckets[20].count += 1;
        buckets[20].totalBlocks += transaction.block_count;
        return;
      }

      if (transaction.spb <= 30) {
        buckets[30].count += 1;
        buckets[30].totalBlocks += transaction.block_count;
        return;
      }

      if (transaction.spb <= 40) {
        buckets[40].count += 1;
        buckets[40].totalBlocks += transaction.block_count;
        return;
      }

      if (transaction.spb <= 50) {
        buckets[50].count += 1;
        buckets[50].totalBlocks += transaction.block_count;
        return;
      }

      if (transaction.spb <= 60) {
        buckets[60].count += 1;
        buckets[60].totalBlocks += transaction.block_count;
        return;
      }

      if (transaction.spb <= 70) {
        buckets[70].count += 1;
        buckets[70].totalBlocks += transaction.block_count;
        return;
      }

      if (transaction.spb <= 80) {
        buckets[80].count += 1;
        buckets[80].totalBlocks += transaction.block_count;
        return;
      }

      if (transaction.spb <= 90) {
        buckets[90].count += 1;
        buckets[90].totalBlocks += transaction.block_count;
        return;
      }

      if (transaction.spb <= 100) {
        buckets[100].count += 1;
        buckets[100].totalBlocks += transaction.block_count;
        return;
      }
      buckets.over.count += 1;
      buckets.over.totalBlocks += transaction.block_count;
    });
    return buckets;
  });
};
