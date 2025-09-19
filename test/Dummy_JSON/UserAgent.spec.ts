import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

test('should retrieve client User Agent', async ({ request }) => {
    // Make GET request to the /ip endpoint (as /ip/ua returns 404), using a default URL if API_BASE_URL is not set
    const baseUrl = process.env.API_BASE_URL || 'https://dummyjson.com';
    const url = `${baseUrl}/ip`;
    console.log('Request URL:', url); // Log the constructed URL for debugging
    const response = await request.get(url);

    // Log the status code for debugging
    console.log('Response Status:', response.status());

    // Assert that the request was successful
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    // Parse the response body as JSON (since /ip returns JSON)
    const responseBody = await response.json();

    // Get the User Agent from the 'userAgent' property of the JSON object
    const userAgent = responseBody.userAgent;

    // Log the raw response for debugging
    console.log('Raw Response:', responseBody);

    // Assert that the User Agent is a non-empty string and matches a typical User Agent pattern
    expect(typeof userAgent).toBe('string'); // Check type
    expect(userAgent.length).toBeGreaterThan(0);
    expect(userAgent).toMatch(/Mozilla\/5\.0|AppleWebKit|Chrome|Safari|Edge|Firefox/); // Common User Agent keywords

    // Log the User Agent for debugging
    console.log('Client User Agent:', userAgent);
});