# 🚀 Extracting All Names from Autocomplete API

## 📋 Overview
This project extracts all possible names available through an autocomplete API at `http://35.200.185.69:8000`. The solution uses a recursive depth-first search approach to efficiently discover and collect all names while respecting the API's rate limits and constraints across three different endpoints.

## 🛠️ Getting Started

### Prerequisites
Ensure you have the following installed on your system:
- **Node.js** (Latest LTS version recommended)
- **npm** (comes with Node.js)

### Setup
Clone the repository:
```sh
git clone https://github.com/delta-mohit/Ivy-Homes-Assignment.git
cd Ivy-Homes-Assignment
```

Install dependencies:
```sh
npm install axios
```

## 🔍 API Discovery & Analysis

### Base URL and Endpoints
- **Base URL:** `http://35.200.185.69:8000`
- **Three endpoints:**
  - `/v1/autocomplete?query=<string>`
  - `/v2/autocomplete?query=<string>`
  - `/v3/autocomplete?query=<string>`

### Response Format
All endpoints return JSON with the following structure:
```json
{
  "version": "[v1|v2|v3]",
  "count": <number>,
  "results": [<array of strings>]
}
```

### Endpoint Characteristics

#### 🔤 V1 Endpoint
- **Character Support:** Only lowercase alphabetic characters (`a-z`)
- **Response Size:** Returns up to 10 results per query
- **Rate Limit:** 100 requests per minute (blocks for 41 seconds after exceeding)

**Example Response:**
```json
{
  "version": "v1",
  "count": 10,
  "results": ["aa", "aabdknlvkc", "aabrkcd", "aadgdqrwdy", "aagqg", "aaiha", "aainmxg", "aajfebume", "aajwv", "aakfubvxv"]
}
```

#### 🔢 V2 Endpoint
- **Character Support:** Alphanumeric characters (`a-z, 0-9`)
- **Response Size:** Returns up to 12 results per query
- **Rate Limit:** 50 requests per minute (blocks for 51 seconds after exceeding)

**Example Response:**
```json
{
  "version": "v2",
  "count": 12,
  "results": [
    "00981o7oyy", "00muuu8", "00o1z8b2t5", "00tfan4",
    "00us291vs", "00vhuwj9", "01", "010uj5","013a6",
    "01485vptaz", "01iq", "01s0hi6"]
}

```

#### 🔣 V3 Endpoint
- **Character Support:** Alphanumeric + special characters (space, `+`, `-`, `.`)
- **Response Size:** Returns up to 15 results per query
- **Rate Limit:** 80 requests per minute (blocks for 45 seconds after exceeding)
- **Special Character Handling:** Requires careful handling of URL encoding

**Example Response:**
```json
{
  "version": "v3",
  "count": 15,
  "results": [
    "0", "0 .r m1", "0 3", "0 4", "0 c.xcr+",
    "0 u", "0 v-v8gq", "0+22l2p8", "0+d","0+e3ldrq",
    "0+h6i48r1j","0+k94tv048","0+qcv-mazy","0+qy", 
    "0+yg39.ujr"]
}

```

## 💡 Solution Approach

### Recursive DFS Algorithm
1. **Starting Point:**
   - **V1:** Start with single lowercase letters (`a-z`)
   - **V2:** Start with digits (`0-9`)
   - **V3:** Start with alphanumeric and special characters
2. **Exploration Logic:**
   - For each prefix, make an API call to the relevant endpoint
   - Process all returned results:
     - Save each result to the output file
     - For each result, generate new queries by appending allowed characters
   - **Stopping condition:** When the response contains fewer than the maximum possible results
3. **Backtracking:**
   - When a prefix returns fewer than the maximum allowed words, the algorithm backtracks and tries new combinations

### Rate Limiting Strategy
- **Calculated Delays:**
  - **V1:** 600ms delay between requests (60 ÷ 100 × 1000 ms)
  - **V2:** 1200ms delay between requests (60 ÷ 50 × 1000 ms)
  - **V3:** 750ms delay between requests (60 ÷ 80 × 1000 ms)
- **Error Handling:**
  - `429 Too Many Requests`: Wait 62 seconds before retrying
  - Other errors: Wait 30 seconds before retrying

### Special Character Handling (V3)
- `+` must be encoded as `%2B`
- API sometimes ignores trailing spaces, requiring manual filtering
- All special characters are properly encoded

## 📊 Implementation Details

### Data Storage
- Extracted words are saved to `.txt` files
- Words are appended incrementally to preserve progress in case of interruption

### Logging and Monitoring
- Tracks request count, words found, execution duration, etc.

Example log output:
```sh
No. of request: 10; wordCnt in response: 5; words found: 25; query: aag; last word: aagqg; Duration: 00:01:30
```

## 🏆 Results Summary

### V1 Endpoint
✅ **Total Requests:** 31,019
✅ **Total Words Found:** 18,632
⏱️ **Duration:** 6 hours 3 seconds

### V2 Endpoint
✅ **Total Requests:** 7,417
✅ **Total Words Found:** 13,730
⏱️ **Duration:** 2 hours 35 minutes 21 seconds

### V3 Endpoint
✅ **Total Requests:** 3,231
✅ **Total Words Found:** 11,500
⏱️ **Duration:** 50 minutes 20 seconds

## 🖥️ Running the Scripts
To execute the script for a specific API version:
```sh
node V1-extractNames.js  # For /v1 API
node V2-extractNames.js  # For /v2 API
node V3-extractNames.js  # For /v3 API

Note : Words resposes are saved into .txt file uploaded on github for each end point.
```

## 📝 Endpoint-Specific Findings

### V1 Endpoint Findings
- Only lowercase alphabets (`a-z`)
- Results are lexicographically sorted
- Consistently returns up to 10 results

### V2 Endpoint Findings
- Supports alphanumeric characters
- Returns up to 12 results per query
- Names start with letters or numbers

### V3 Endpoint Findings
- Supports lowercase letters, numbers, and special characters
- Returns up to 15 results per query
- Special character handling required (`+`, `-`, `.`, space)

## ⚠️ Notes and Cautions
- Stopping execution midway will still preserve the collected words in words.txt
- Execution time depends on API response and rate limits
- If needed, modify sleep() delay to optimize request timing while staying within API constraints.
- Scripts automatically handle rate limiting

## 🎯 Conclusion
This project successfully extracts all available names across all API versions. The solution efficiently handles rate limiting, character encoding issues, and systematically explores the name space using a depth-first search approach. The different characteristics of each endpoint required specific optimizations, resulting in the collection of over **43,000 unique names**.

Thank you for exploring this solution! 🚀