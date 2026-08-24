// scripts/load-test.js — High-concurrency performance validation script
const http = require('http');
const https = require('https');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const CONCURRENT_USERS = parseInt(process.env.CONCURRENT_USERS || '50', 10);
const TOTAL_REQUESTS = parseInt(process.env.TOTAL_REQUESTS || '250', 10);

const ENDPOINTS = [
  '/',
  '/subjects',
  '/videos',
  '/calculators',
  '/troubleshooter',
  '/materials',
  '/world',
  '/api/leaderboard'
];

async function measureRequest(url) {
  const start = Date.now();
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        const duration = Date.now() - start;
        resolve({
          url,
          status: res.statusCode,
          duration,
          success: res.statusCode >= 200 && res.statusCode < 400
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        url,
        status: 0,
        duration: Date.now() - start,
        success: false,
        error: err.message
      });
    });

    req.setTimeout(8000, () => {
      req.abort();
      resolve({
        url,
        status: 408,
        duration: Date.now() - start,
        success: false,
        error: 'Timeout'
      });
    });
  });
}

async function runLoadSimulation() {
  console.log(`⚡ Starting PolymerHub Load Simulation: ${CONCURRENT_USERS} concurrent simulated users across ${TOTAL_REQUESTS} requests...`);
  console.log(`🎯 Target Base URL: ${BASE_URL}\n`);

  const results = [];
  let inFlight = 0;
  let completed = 0;
  let index = 0;

  const runNext = async () => {
    if (index >= TOTAL_REQUESTS) return;
    const currentEndpoint = ENDPOINTS[index % ENDPOINTS.length];
    index++;
    inFlight++;

    const targetUrl = `${BASE_URL}${currentEndpoint}`;
    const result = await measureRequest(targetUrl);
    results.push(result);
    completed++;
    inFlight--;

    if (completed % 25 === 0 || completed === TOTAL_REQUESTS) {
      process.stdout.write(`Progress: ${completed}/${TOTAL_REQUESTS} requests completed...\r`);
    }

    if (index < TOTAL_REQUESTS) {
      return runNext();
    }
  };

  const pool = [];
  for (let i = 0; i < Math.min(CONCURRENT_USERS, TOTAL_REQUESTS); i++) {
    pool.push(runNext());
  }

  await Promise.all(pool);

  // Analyze metrics
  const successful = results.filter(r => r.success);
  const durations = results.map(r => r.duration).sort((a, b) => a - b);
  const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
  const p50 = durations[Math.floor(durations.length * 0.5)];
  const p95 = durations[Math.floor(durations.length * 0.95)];
  const p99 = durations[Math.floor(durations.length * 0.99)];

  console.log('\n\n================ LOAD TEST RESULTS ================');
  console.log(`✓ Total Requests:      ${results.length}`);
  console.log(`✓ Success Rate:        ${((successful.length / results.length) * 100).toFixed(2)}%`);
  console.log(`✓ Average Latency:     ${avg.toFixed(1)}ms`);
  console.log(`✓ P50 Median Latency:  ${p50}ms`);
  console.log(`✓ P95 Latency:         ${p95}ms`);
  console.log(`✓ P99 Peak Latency:    ${p99}ms`);
  console.log('====================================================\n');
}

if (require.main === module) {
  runLoadSimulation().catch(console.error);
}

module.exports = { runLoadSimulation };
