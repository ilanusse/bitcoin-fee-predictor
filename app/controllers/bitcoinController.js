const transactionService = require('../services/transactionService');

exports.predictions = (req, res) => {
  transactionService.getBuckets().then((buckets) => {
    const avgBuckets = {};
    [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 'over'].forEach((bucket) => {
      avgBuckets[bucket] = buckets[bucket].totalBlocks / buckets[bucket].count;
    });
    res.status(200);

    res.send(avgBuckets);
  });

}
