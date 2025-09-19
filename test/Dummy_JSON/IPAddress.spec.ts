import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

test('should retrieve client IP address', async ({ request }) => {
    // Make GET request to the /ip endpoint, using a default URL if API_BASE_URL is not set
    const baseUrl = process.env.API_BASE_URL || 'https://dummyjson.com';
    const url = `${baseUrl}/ip`;
    console.log('Request URL:', url); // Log the constructed URL for debugging
    const response = await request.get(url);

    // Assert that the request was successful
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    // Parse the response body as JSON
    const responseBody = await response.json();

    // Get the IP address from the 'ip' property of the JSON object
    const ipAddress = responseBody.ip;

    // Assert that the response is a valid IP address
    expect(ipAddress).toMatch(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/);

    // Additional validation: Ensure IP components are within valid range (0-255)
    const ipSegments = ipAddress.split('.');
    expect(ipSegments.length).toBe(4);
    ipSegments.forEach((segment: string) => { // Explicitly type 'segment' as string
        const num = parseInt(segment, 10);
        expect(num).toBeGreaterThanOrEqual(0);
        expect(num).toBeLessThanOrEqual(255);
    });

    // Log the IP address and additional response details for debugging
    console.log('Client IP Address:', ipAddress);
    console.log('Full Response Body:', responseBody);

    // Verify the response contains the userAgent property as per DummyJSON docs
    expect(responseBody).toHaveProperty('userAgent');
    expect(typeof responseBody.userAgent).toBe('string');
});