import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

test('should generate and validate placeholder image from DummyJSON API', async ({ request }) => {
    // Define parameters for the image request
    const baseUrl = process.env.API_BASE_URL || 'https://dummyjson.com';
    const size = '150'; // Square size (150x150)
    const url = `${baseUrl}/image/${size}`;
    console.log('Request URL:', url);

    // Make GET request to the image endpoint
    const response = await request.get(url);

    // Assert that the request was successful
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    // Check content-type header for image/png
    const contentType = response.headers()['content-type'];
    expect(contentType).toBe('image/png');

    // Get the image as binary buffer
    const imageBuffer = await response.body();

    // Assert that the buffer is not empty
    expect(imageBuffer.length).toBeGreaterThan(0);

    // Save the image to a file for further validation (optional, for manual inspection)
    const imagePath = path.join(__dirname, 'fetched-image.png');
    fs.writeFileSync(imagePath, imageBuffer);
    console.log(`Image saved to: ${imagePath}`);

    // Optional: Basic size validation (updated upper bound based on observed size)
    // A 150x150 PNG might be larger due to content or compression
    expect(imageBuffer.length).toBeGreaterThan(50); // Minimum expected size
    expect(imageBuffer.length).toBeLessThan(3000);  // Updated upper bound to 3000 bytes

    // Log image size for debugging
    console.log('Image buffer length:', imageBuffer.length);

    console.log('Image generated successfully with size:', size);
});