import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

test('should handle authorization successfully with .env', async ({ request }) => {
    // Step 1: Login to get access token using .env variables
    const loginResponse = await request.post(`${process.env.API_BASE_URL}/auth/login`, {
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            username: process.env.API_USERNAME,
            password: process.env.API_PASSWORD
        }
    });

    const loginBody = await loginResponse.json();
    console.log('Login Status:', loginResponse.status());
    console.log('Login Response Body:', loginBody);
    expect(loginResponse.ok()).toBeTruthy();

    const accessToken = loginBody.accessToken;
    expect(accessToken).toBeDefined();

    // Step 2: Use token to access protected resource
    const meResponse = await request.get(`${process.env.API_BASE_URL}/auth/me`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    expect(meResponse.ok()).toBeTruthy();
    const meBody = await meResponse.json();
    console.log('Authenticated User Response:', meBody);
    expect(meBody.username).toBe(process.env.API_USERNAME);
});