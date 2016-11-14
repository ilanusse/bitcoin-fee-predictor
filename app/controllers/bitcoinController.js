const transactionService = require('../services/transactionService');

exports.predictions = (req, res) => {
  transactionService.getBuckets().then((buckets) => {
    const avgBuckets = {};
    let recommended = null;
    [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 'over'].forEach((bucket) => {
      avgBuckets[bucket] = buckets[bucket].totalBlocks / buckets[bucket].count;
      if (recommended === null && avgBuckets[bucket] < 0.1) {
        recommended = bucket;
      }
    });
    res.status(200);

    res.send({ avgBuckets, recommended });
  });
}
