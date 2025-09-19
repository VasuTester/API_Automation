// import { test, expect, APIRequestContext } from '@playwright/test';
// const fs = require('fs').promises; // Use promises version of fs for async operations

// const baseUrl = 'https://dummyjson.com';
// const tokenFilePath = './tokens.json'; // Path to JSON file with tokens

// test('Refresh Auth Session', async ({ request }: { request: APIRequestContext }) => {
//   // Read tokens from JSON file
//   const tokens = JSON.parse(await fs.readFile(tokenFilePath, 'utf8'));
//   const refreshToken = tokens.refreshToken;

//   // Refresh auth session
//   console.log('Refreshing auth session...');
//   const refreshResponse = await request.post(`${baseUrl}/auth/refresh`, {
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     data: {
//       refreshToken: refreshToken, // Optional; use from JSON or cookie if not provided
//       expiresInMins: 30, // Optional; defaults to 60 if not provided
//     },
//   });

//   if (!refreshResponse.ok()) {
//     console.log('Response Status:', refreshResponse.status());
//     console.log('Response Body:', await refreshResponse.text()); // Log full response
//     throw new Error(`Refresh failed: ${refreshResponse.status()}`);
//   }

//   const refreshData = await refreshResponse.json();
//   console.log('Refresh Response:', refreshData);
// });

import { test, expect, APIRequestContext } from '@playwright/test';
const fs = require('fs').promises; // Use promises version of fs for async operations

const baseUrl = 'https://dummyjson.com';
const tokenFilePath = './tokens.json'; // Path to JSON file with tokens

test('Refresh Auth Session', async ({ request }: { request: APIRequestContext }) => {
  // Read tokens from JSON file
  const tokens = JSON.parse(await fs.readFile(tokenFilePath, 'utf8'));
  const refreshToken = tokens.refreshToken;

  // Refresh auth session
  console.log('Refreshing auth session...');
  const refreshResponse = await request.post(`${baseUrl}/auth/refresh`, {
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      refreshToken: refreshToken, // Optional; use from JSON or cookie if not provided
      expiresInMins: 30, // Optional; defaults to 60 if not provided
    },
  });

  if (!refreshResponse.ok()) {
    console.log('Response Status:', refreshResponse.status());
    console.log('Response Body:', await refreshResponse.text()); // Log full response
    throw new Error(`Refresh failed: ${refreshResponse.status()}`);
  }

  const refreshData = await refreshResponse.json();
  console.log('Refresh Response:', refreshData);

  // Update tokens.json with the new accessToken and refreshToken
  const updatedTokens = {
    accessToken: refreshData.accessToken,
    refreshToken: refreshData.refreshToken, // Use the new refreshToken from the response
  };
  await fs.writeFile(tokenFilePath, JSON.stringify(updatedTokens, null, 2), 'utf8'); // Pretty print JSON
  console.log('New accessToken and refreshToken stored in tokens.json file');
});