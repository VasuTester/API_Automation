import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

test('should handle delayed response from API', async ({ request }) => {
    // Record start time
    const startTime = Date.now();

    // Make GET request with delay parameter, using a default URL if API_BASE_URL is not set
    const baseUrl = process.env.API_BASE_URL || 'https://dummyjson.com';
    const url = `${baseUrl}/users?delay=1000`;
    console.log('Request URL:', url); // Log the constructed URL for debugging
    const testRoute = await request.get(url);

    // Record end time and calculate duration
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // Assert that the request was successful
    expect(testRoute.ok()).toBeTruthy();
    expect(testRoute.status()).toBe(200);

    // Assert that the response time is within an acceptable range of the delay (1000ms)
    // Increase buffer to ±900ms to account for higher network latency
    const minExpectedTime = 300;  // Minimum reasonable delay (allowing for some overhead)
    const maxExpectedTime = 1900; // Maximum expected delay (1000ms + 900ms buffer)
    expect(responseTime).toBeGreaterThanOrEqual(minExpectedTime);
    expect(responseTime).toBeLessThanOrEqual(maxExpectedTime);

    // Log the response body and duration for debugging
    const testRouteBody = await testRoute.json();
    console.log(`Response time: ${responseTime}ms`);
    console.log('Response Body:', testRouteBody);

    // Verify the response structure
    expect(testRouteBody).toHaveProperty('users');
    expect(testRouteBody.users).toBeInstanceOf(Array);
    expect(testRouteBody.limit).toBeGreaterThan(0); // Ensure some data is returned
    expect(testRouteBody.skip).toBeDefined();       // Ensure pagination info is present
});