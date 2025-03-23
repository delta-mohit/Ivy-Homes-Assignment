//Old code
// const axios = require('axios');

// const BASE_URL = "http://35.200.185.69:8000/v1/autocomplete?query=";
// const MAX_RESULTS = 10;
// const CHARSET = 'abcdefghijklmnopqrstuvwxyz';
// const foundNames = new Set();
// let requestCount = 0;

// async function fetchNames(prefix) {
//     try {
//         const response = await axios.get(`${BASE_URL}${prefix}`);
//         requestCount++;

//         if (response.data && response.data.results) {
//             response.data.results.forEach(name => foundNames.add(name));

//             // If we got max results, there might be more names beyond the first 10.
//             if (response.data.count === MAX_RESULTS) {
//                 for (let char of CHARSET) {
//                     await fetchNames(prefix + char);
//                 }
//             }
//         }
//     } catch (error) {
//         console.error(`Error fetching ${prefix}:`, error.message);
//     }
// }

// async function main() {
//     await fetchNames("");
//     console.log("Total Requests Made:", requestCount);
//     console.log("Total Unique Names Found:", foundNames.size);
//     console.log([...foundNames]); // Print collected names
// }

// main();

//====================================================================================================
// New code - Inefficinet code - which delete the letter from the end

// const axios = require("axios");

// const BASE_URL = "http://35.200.185.69:8000/v1/autocomplete?query=";
// const ALPHABET = "abcdefghijklmnopqrstuvwxyz";
// let collectedWords = new Set();
// let running = true;

// // Sleep function for delay
// const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// // Fetch words with API call and rate limit handling
// async function fetchWords(query) {
//   while (running) {
//     try {
//       const response = await axios.get(BASE_URL + encodeURIComponent(query));
//       return response.data.results || [];
//     } catch (error) {
//       if (error.response && error.response.status === 429) {
//         console.warn("Rate limit hit! Waiting for 60 seconds...");
//         await sleep(60000);
//       } else {
//         console.error(`Error fetching for query "${query}":`, error.message);
//         return [];
//       }
//     }
//   }
//   return [];
// }

// // Generate the next lexicographical word -
// function nextLexicographicalWord(word) {
//   let lastChar = word.slice(-1);
//   if (lastChar === "z") {
//     return nextLexicographicalWord(word.slice(0, -1)) || null;
//   }
//   return word.slice(0, -1) + String.fromCharCode(lastChar.charCodeAt(0) + 1);
// }

// async function getAllWords() {
//   let query = "";

//   while (running) {
//     let words = await fetchWords(query);

//     if (words.length === 0) {
//       let nextQuery = nextLexicographicalWord(query);
//       if (!nextQuery) {
//         running = false;
//         break; // Stop when no next word exists
//       }
//       query = nextQuery;
//     } else {
//       words.forEach((word) => collectedWords.add(word));
//       let lastWord = words[words.length - 1];

//       console.log("Last Word:", lastWord); // Print last received word

//       if (words.length === 1) {
//         let nextQuery = nextLexicographicalWord(lastWord);
//         if (!nextQuery) {
//           running = false;
//           break; // Stop when no next word exists
//         }
//         query = nextQuery;
//       } else {
//         query = lastWord;
//       }
//     }

//     await sleep(600); // Ensuring every request is at least 600ms apart
//   }
// }

// // Handle Ctrl+C termination and print all collected words
// process.on("SIGINT", () => {
//   running = false;
//   console.log("\nExecution terminated by user.");
//   console.log("Total words collected:", collectedWords.size);
//   console.log([...collectedWords]);
//   process.exit();
// });

// getAllWords();

//Recursive code ---

const fs = require("fs");
const axios = require("axios");

const BASE_URL = "http://35.200.185.69:8000/v1/autocomplete?query=";
const possibleLetters = "abcdefghijklmnopqrstuvwxyz";
let counter = 0;
let requestCount = 0;
let startTime = Date.now();

const sleep = (seconds) =>
  new Promise((resolve) => setTimeout(resolve, seconds * 1000));

async function getAutocomplete(query) {
  try {
    const response = await axios.get(BASE_URL + encodeURIComponent(query));

    if (response.status >= 200 && response.status < 300) {
      requestCount++;
    }
    // Check if response contains words
    const results = response.data.results || [];
    const numberOfWords = results.length;

    if (numberOfWords === 0) {
      console.log(
        `No. of request : ${requestCount}; wordCnt in response : ${numberOfWords}; words found : ${counter}; query : ${query}; Duration: ${
          new Date((Date.now() - startTime)).toUTCString().split("1970 ")[1]
        };`
      );
      return; // No words found, stop recursion
    }

    // Append results to file
    if (numberOfWords == 10 && query == results[0]) {
      fs.appendFileSync("words.txt", query + "\n");
      counter++;
    }

    // Stop recursion if less than 10 words (end of data)
    if (numberOfWords < 10) {
      counter += numberOfWords;
      console.log(
        `No. of request : ${requestCount}; wordCnt in response : ${numberOfWords}; words found : ${counter}; query : ${query}; last word: ${
          results[numberOfWords - 1]
        }; Duration: ${
          new Date(Date.now() - startTime).toUTCString().split("1970 ")[1]
        };`
      );
      results.forEach((word) => {
        fs.appendFileSync("words.txt", word + "\n");
      });
      return;
    } else {
      console.log(
        `No. of request : ${requestCount}; wordCnt in response : ${numberOfWords}; words found : ${counter}; query : ${query}; last word: ${
          results[numberOfWords - 1]
        }; Duration: ${
          new Date(Date.now() - startTime).toUTCString().split("1970 ")[1]
        };`
      );
    }

    // Recursively fetch the next batch of words
    for (let i = 0; i < possibleLetters.length; i++) {
      const letter = possibleLetters[i];
      const newQuery = query + letter;
      await sleep(0.6); // Ensure rate limit compliance (600ms delay)
      await getAutocomplete(newQuery);
    }
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.warn(
        `Rate limit hit for query "${query}". Waiting for 60 seconds...`
      );
      await sleep(62); // Wait before retrying
      return getAutocomplete(query);
    } else {
      console.error(`Error fetching query "${query}":`, error.message);
      await sleep(30); // Wait before retrying in case of temporary failure
      return getAutocomplete(query);
    }
  }
}

// Start fetching words
getAutocomplete("").then(() => console.log("Word collection completed!"));
