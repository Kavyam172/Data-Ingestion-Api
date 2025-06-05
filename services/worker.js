// services/worker.js
const { getNextBatch, markBatchStatus } = require('./queueManager');

function simulateExternalAPI(id) {
  return new Promise(resolve => {
    setTimeout(() => resolve({ id, data: 'processed' }), 5000);
  });
}

async function processBatch(batch) {
  markBatchStatus(batch.ingestion_id, batch.batch_id, 'triggered');

  await Promise.all(batch.ids.map(simulateExternalAPI));

  markBatchStatus(batch.ingestion_id, batch.batch_id, 'completed');
}

function startWorker() {
  setInterval(async () => {
    const batch = getNextBatch();
    console.log("new batch:",batch);
    if (batch) await processBatch(batch);
  }, 5000);
}

module.exports = { startWorker };
