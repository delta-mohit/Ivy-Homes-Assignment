# Extracting Names from Autocomplete API

## Getting Started

### Prerequisites
Ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/en/download/) (Latest LTS version recommended)
- [npm]() (comes with Node.js)
- [Axios]() (for making HTTP requests)


### Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/delta-mohit/Ivy-Homes-Assignment.git
   cd IVY-Homes-Assignment
   ```
2. Install dependencies (if any):
   ```sh
   npm install
   ```

## Approach

### API Overview
The autocomplete API has three versions:
- **V1:** Supports only alphabetic queries. Allows a maximum of 100 requests per minute. API Respose will be an result array of 0<=length<=10.
- **V2:** Supports alphanumeric queries with the first two characters as digits (0-9). Allows a maximum of 70 words per minute, with a reset time of 60 seconds. API Respose will be an result array of 0<=length<=12.
- **V3:** Supports alphanumeric queries along with special characters (" ", "+", ".", "-"). Allows a maximum of 50 words per minute, with a reset time of 60 seconds. API Respose will be an result array of 0<=length<=15.

### Recursive Data Extraction
- The script recursively fetches all possible words using depth-first search (DFS).
- Each API call increments `requestCount` to track the number of requests made.
- Responses with fewer than the maximum allowed words indicate the end of a branch.

### Rate Limiting Handling
- **V1:** Allows 100 requests per minute. A `600ms` delay is introduced to avoid rate limits.
- **V2:** Allows 70 words per minute. Implements a delay based on request count to manage rate limits.
- **V3:** Allows 50 words per minute. Implements stricter rate limit handling with a longer delay.
- If a `429` (Too Many Requests) error occurs, the script waits before retrying based on the API version constraints.
- Other errors trigger a retry with a delay to handle temporary failures.

### File Storage
- Extracted words are stored in `words.txt`.
- Each word is appended to the file to ensure progress is saved.

### Logging
- Logs provide insights into:
  - Number of API requests made.
  - Words found in the latest response.
  - The query that resulted in the response.
  - Total execution duration.

## Running the Script

To execute the script for a specific API version:
```sh
node V1-extractNames.js  # For V1 API
node V2-extractNames.js  # For V2 API
node V3-extractNames.js  # For V3 API
```

This will start fetching names recursively until all possible names are extracted.

## Important Findings and Results

### v1 results

Total No. of Requests: 31,019

Total Words Found: 18,632

Duration: 06 hours 03 seconds

### v2 results

Total No. of Requests: (To be updated)

Total Words Found: (To be updated)

Duration: (To be updated)

### v3 results

Total No. of Requests: (To be updated)

Total Words Found: (To be updated)

Duration: (To be updated)

## Example Output (Console Log)
```
No. of request : 10; wordCnt in response : 5; words found : 25; query : aag; last word: aagqg; Duration: 00:01:30;
No. of request : 15; wordCnt in response : 10; words found : 50; query : abc; last word: abclmm; Duration: 00:02:15;
...
Word collection completed!
```

## Notes
- Stopping execution midway will still preserve the collected words in `words.txt`.
- Execution time depends on the API response time and rate limits.
- If needed, modify `sleep()` delay to optimize request timing while staying within API constraints.

---

Thank You! 🚀