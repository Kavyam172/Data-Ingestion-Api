// server.js
const express = require('express');
const app = express();
const { startWorker } = require('./services/worker');
const ingestRoutes = require('./routes/ingest');

app.use(express.json());
app.use('/', ingestRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  startWorker();
});
