# Data Ingestion API

A Node.js RESTful API system for asynchronously ingesting and processing data batches with priority-based scheduling and rate limiting.

---

## Features

- **POST /ingest** — Submit ingestion requests with a list of IDs and priority (HIGH, MEDIUM, LOW).  
- **GET /status/:ingestion_id** — Retrieve the processing status of submitted ingestion requests.  
- Processes batches of max 3 IDs asynchronously.  
- Respects a rate limit of **1 batch every 5 seconds**.  
- Prioritizes batches by request priority and submission time.  
- In-memory persistence for ingestion and batch statuses.  
- Simulates external API calls with mock delay and static response.

---

## Tech Stack

- Node.js  
- Express.js  
- UUID for unique identifiers  
- Axios (for test requests)  

---

## Installation & Setup

1. Clone the repo:  
   ```bash
   git clone <repo-url>
   cd data-ingestion-api



# Data Ingestion API

A Node.js RESTful API system to asynchronously ingest and process data in priority-based batches with rate limiting.

---

## Overview

This application exposes two RESTful endpoints:

- **POST /ingest**: Submit a data ingestion request with a list of IDs and a priority level.  
- **GET /status/:ingestion_id**: Check the processing status of a submitted ingestion request.

It processes batches of up to 3 IDs asynchronously, respecting a rate limit of **1 batch per 5 seconds**. Higher priority ingestion requests are processed before lower priority ones, maintaining FIFO order within the same priority.

---

## Features

- Priority-based job queue (HIGH, MEDIUM, LOW).  
- Batching of IDs in groups of 3.  
- Asynchronous batch processing with mock external API call simulation.  
- Rate limiting at 1 batch every 5 seconds.  
- Real-time status tracking for ingestion requests and their batches.  
- In-memory persistence (can be replaced with DB for production).

---

## Tech Stack

- Node.js  
- Express.js  
- UUID (for unique IDs)  
- Axios (for testing requests)  

---

## Setup and Running

1. **Clone repository**  
   ```bash
   git clone <repo-url>
   cd data-ingestion-api
``

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start server**

   ```bash
   node server.js
   ```

   Server will run on `http://localhost:5000`

---

## API Endpoints

### POST `/ingest`

Submit ingestion request.

* **Request Body:**

  ```json
  {
    "ids": [1, 2, 3, 4, 5],
    "priority": "HIGH"
  }
  ```

* **Response:**

  ```json
  {
    "ingestion_id": "uuid-string"
  }
  ```

---

### GET `/status/:ingestion_id`

Get the status of an ingestion request.

* **Response:**

  ```json
  {
    "ingestion_id": "uuid-string",
    "status": "triggered",
    "batches": [
      {
        "batch_id": "uuid-string",
        "ids": [1, 2, 3],
        "status": "completed"
      },
      {
        "batch_id": "uuid-string",
        "ids": [4, 5],
        "status": "triggered"
      }
    ]
  }
  ```

* **Possible Batch Status Values:**

  * `yet_to_start`
  * `triggered`
  * `completed`

* **Overall Status Logic:**

  * If all batches are `yet_to_start`, overall status is `yet_to_start`.
  * If all batches are `completed`, overall status is `completed`.
  * Otherwise, overall status is `triggered`.

---

## Rate Limiting and Priority Behavior

* Only **one batch (max 3 IDs)** is processed every 5 seconds.
* Batches are sorted by priority (HIGH → MEDIUM → LOW) and then by ingestion time.
* Higher priority batches are processed before lower priority ones, regardless of submission order.

Example:

* Request A (MEDIUM) with 5 IDs arrives first → split into 2 batches.
* Request B (HIGH) with 4 IDs arrives later → split into 2 batches.
* Processing order:

  * Batch 1 from Request A (ids 1,2,3) processed first (T0–T5 sec)
  * Batch 1 from Request B (ids 6,7,8) processed next (T5–T10 sec)
  * Batch 2 from Request B (id 9) processed (T10–T15 sec)
  * Batch 2 from Request A (ids 4,5) processed last (T15–T20 sec)

---

## Testing

Run the provided test suite to verify functionality:

```bash
node test/test.js
```

Tests verify:

* Correct batching of IDs.
* Priority-based processing order.
* Rate limiting of batch processing.
* Status API correctness.

---

## Design Choices

* **In-memory data structures** for quick prototyping and demonstration. Easily replaceable with databases.
* **Worker service** implemented using `setInterval` to enforce rate limiting and batch processing.
* **UUIDs** for unique ingestion and batch IDs ensure traceability.
* Clear **separation of concerns**: API routes, queue management, and worker logic modularized.

---

## Future Improvements

* Persist ingestion and batch data in a database (e.g., MongoDB).
* Add validation with Joi or similar schema validation library.
* Implement retries and error handling for simulated external API calls.
* Provide real-time updates via WebSockets or Server-Sent Events (SSE).
* Enhance testing with unit and integration tests (e.g., Jest, Mocha).

---

## Author

Kavyam Sachdeva 

---

Thank you for trying out this project!

