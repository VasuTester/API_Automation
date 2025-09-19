import { test, expect, APIRequestContext } from '@playwright/test';
const fs = require('fs').promises; // Use promises version of fs for async operations

const baseUrl = 'https://dummyjson.com';
const tokenFilePath = './tokens.json'; // Path to JSON file with tokens

test('Get Current Auth User', async ({ request }: { request: APIRequestContext }) => {
  // Read tokens from JSON file
  const tokens = JSON.parse(await fs.readFile(tokenFilePath, 'utf8'));
  const accessToken = tokens.accessToken;

  // Fetch current authenticated user
  console.log('Fetching current user...');
  const meResponse = await request.get(`${baseUrl}/auth/me`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!meResponse.ok()) {
    console.log('Response Status:', meResponse.status());
    console.log('Response Body:', await meResponse.text()); // Log full response
    throw new Error(`Get /me failed: ${meResponse.status()}`);
  }

  const meData = await meResponse.json();
  console.log('Current User Response:', meData);
});