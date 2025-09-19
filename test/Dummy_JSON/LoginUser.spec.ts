// import { test, expect, APIRequestContext } from '@playwright/test';
// require('dotenv').config(); // Load environment variables from .env

// const baseUrl = process.env.API_BASE_URL || 'https://dummyjson.com';

// test('Auth Automation', async ({ request }: { request: APIRequestContext }) => {
//   // Step 1: Login and get tokens
//   console.log('Performing login...');
//   const loginResponse = await request.post(`${baseUrl}/auth/login`, {
//     headers: { 'Content-Type': 'application/json' },
//     data: {
//       username: process.env.API_USERNAME,
//       password: process.env.API_PASSWORD,
//       expiresInMins: 30,
//     },
//   });

//   if (!loginResponse.ok()) {
//     throw new Error(`Login failed: ${loginResponse.status()}`);
//   }

//   const loginData = await loginResponse.json();
//   console.log('Login Response:', loginData);

//   const accessToken = loginData.accessToken;
//   const refreshToken = loginData.refreshToken;

//   // Step 2: Get current authenticated user
//   console.log('Fetching current user...');
//   const meResponse = await request.get(`${baseUrl}/auth/me`, {
//     headers: { 'Authorization': `Bearer ${accessToken}` },
//   });

//   if (!meResponse.ok()) {
//     throw new Error(`Get /me failed: ${meResponse.status()}`);
//   }

//   const meData = await meResponse.json();
//   console.log('Current User Response:', meData);

//   // Step 3: Refresh auth session
//   console.log('Refreshing token...');
//   const refreshResponse = await request.post(`${baseUrl}/auth/refresh`, {
//     headers: { 'Content-Type': 'application/json' },
//     data: {
//       refreshToken: refreshToken,
//       expiresInMins: 30,
//     },
//   });

//   if (!refreshResponse.ok()) {
//     throw new Error(`Refresh failed: ${refreshResponse.status()}`);
//   }

//   const refreshData = await refreshResponse.json();
//   console.log('Refresh Response:', refreshData);
// });

import { test, expect, APIRequestContext } from '@playwright/test';
const fs = require('fs').promises; // Use promises version of fs for async operations
require('dotenv').config(); // Load environment variables from .env

const baseUrl = process.env.API_BASE_URL || 'https://dummyjson.com';
const tokenFilePath = './tokens.json'; // Path to new JSON file

test('Auth Automation', async ({ request }: { request: APIRequestContext }) => {
  // Step 1: Login and get tokens
  console.log('Performing login...');
  const loginResponse = await request.post(`${baseUrl}/auth/login`, {
    headers: { 'Content-Type': 'application/json' },
    data: {
      username: process.env.API_USERNAME,
      password: process.env.API_PASSWORD,
      expiresInMins: 30,
    },
  });

  if (!loginResponse.ok()) {
    throw new Error(`Login failed: ${loginResponse.status()}`);
  }

  const loginData = await loginResponse.json();
  console.log('Login Response:', loginData);

  const accessToken = loginData.accessToken;
  const refreshToken = loginData.refreshToken;

  // Store the tokens in a JSON file
  const tokens = { accessToken, refreshToken };
  await fs.writeFile(tokenFilePath, JSON.stringify(tokens, null, 2), 'utf8'); // Pretty print JSON
  console.log('Tokens stored in tokens.json file');

  // Step 2: Refresh auth session
  console.log('Refreshing token...');
  const refreshResponse = await request.post(`${baseUrl}/auth/refresh`, {
    headers: { 'Content-Type': 'application/json' },
    data: {
      refreshToken: refreshToken,
      expiresInMins: 30,
    },
  });

  if (!refreshResponse.ok()) {
    console.log('Refresh Response Status:', refreshResponse.status());
    console.log('Refresh Response Body:', await refreshResponse.text()); // Log full response
    throw new Error(`Refresh failed: ${refreshResponse.status()}`);
  }

  const refreshData = await refreshResponse.json();
  console.log('Refresh Response:', refreshData);
});