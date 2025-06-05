// services/queueManager.js
const { PRIORITY_WEIGHT } = require('../utils/enums');
const { v4: uuidv4 } = require('uuid');

const jobQueue = []; // [{ priority, timestamp, batch, ingestion_id, batch_id }]
const ingestionMap = {}; // { ingestion_id: { status, batches: [{ batch_id, ids, status }] } }

function enqueueIngestion(ids, priority) {
  const ingestion_id = uuidv4();
  const batches = [];
  const timestamp = Date.now();

  for (let i = 0; i < ids.length; i += 3) {
    const batch_ids = ids.slice(i, i + 3);
    const batch_id = uuidv4();

    const batch = {
      priority,
      weight: PRIORITY_WEIGHT[priority],
      timestamp,
      ingestion_id,
      batch_id,
      ids: batch_ids,
      status: 'yet_to_start'
    };

    jobQueue.push(batch);
    batches.push({ batch_id, ids: batch_ids, status: 'yet_to_start' });
  }

  ingestionMap[ingestion_id] = { ingestion_id, status: 'yet_to_start', batches };
  return ingestion_id;
}

function getStatus(ingestion_id) {
  const data = ingestionMap[ingestion_id];
  if (!data) return null;

  const all = data.batches.map(b => b.status);
  if (all.every(s => s === 'yet_to_start')) data.status = 'yet_to_start';
  else if (all.every(s => s === 'completed')) data.status = 'completed';
  else data.status = 'triggered';

  return data;
}

function getNextBatch() {
  if (jobQueue.length === 0) return null;

  jobQueue.sort((a, b) => {
    if (a.weight !== b.weight) return a.weight - b.weight;
    return a.timestamp - b.timestamp;
  });

  return jobQueue.shift();
}

function markBatchStatus(ingestion_id, batch_id, status) {
  const entry = ingestionMap[ingestion_id];
  const batch = entry?.batches?.find(b => b.batch_id === batch_id);
  if (batch) batch.status = status;
}

module.exports = {
  enqueueIngestion,
  getStatus,
  getNextBatch,
  markBatchStatus
};
