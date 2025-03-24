const axios = require("axios");

// Configuration
const API_URL = "http://35.200.185.69:8000/v3/autocomplete?query=";
const SAMPLE_QUERY = "a"; // Basic query string for testing
const MAX_ATTEMPTS = 200; // Maximum number of API calls to try
const DELAY_BETWEEN_CALLS_MS = 100; // Delay between each request in milliseconds

// Function to pause execution for a given number of seconds
const pause = (sec) =>
  new Promise((resolve) => setTimeout(resolve, sec * 1000));

// Function to determine the API's rate limit and block duration
async function evaluateRateLimit() {
  let totalCalls = 0;
  let rateLimited = false;
  let blockStart = null;
  let blockEnd = null;

  console.log("Initiating rate limit test...");

  try {
    // Send requests until we reach MAX_ATTEMPTS or the API returns a rate-limit error
    while (totalCalls < MAX_ATTEMPTS && !rateLimited) {
      const callStart = Date.now();

      try {
        const res = await axios.get(
          `${API_URL}${encodeURIComponent(SAMPLE_QUERY)}`
        );
        totalCalls++;
        console.log(`Call ${totalCalls}: Success (Status: ${res.status})`);
        await pause(DELAY_BETWEEN_CALLS_MS / 1000); // Delay in seconds
      } catch (err) {
        if (err.response && err.response.status === 429) {
          rateLimited = true;
          blockStart = Date.now();
          console.warn(
            `Call ${totalCalls + 1}: Rate limit encountered (Status: 429)`
          );
          console.warn(`Requests allowed per minute: ${totalCalls}`);
        } else {
          console.error(`Call ${totalCalls + 1}: Error - ${err.message}`);
          break;
        }
      }

      // If more than 60 seconds elapsed for this request iteration and no rate limit was hit,
      // then assume the limit hasn't been reached.
      if (Date.now() - callStart > 60000 && !rateLimited) {
        console.log("One minute elapsed with no rate limit hit.");
        console.log(`Minimum requests per minute: ${totalCalls}`);
        break;
      }
    }

    // If the API rate-limited us, check how long the block lasts
    if (rateLimited) {
      console.log("Measuring block duration...");
      while (true) {
        try {
          const res = await axios.get(
            `${API_URL}${encodeURIComponent(SAMPLE_QUERY)}`
          );
          blockEnd = Date.now();
          console.log("Rate limit lifted! API is responding.");
          break;
        } catch (err) {
          if (err.response && err.response.status === 429) {
            console.log("API is still rate-limited... waiting 1 second.");
            await pause(1);
          } else {
            console.error(`Unexpected error during block test: ${err.message}`);
            break;
          }
        }
      }

      const durationMs = blockEnd - blockStart;
      const durationSec = Math.round(durationMs / 1000);
      console.log(`Block duration: ${durationSec} seconds (${durationMs} ms)`);
    }
  } catch (error) {
    console.error("Rate limit test failed:", error.message);
  }
}

// Execute the rate limit test
evaluateRateLimit()
  .then(() => console.log("Rate limit evaluation complete."))
  .catch((err) => console.error("Error during rate limit evaluation:", err));
