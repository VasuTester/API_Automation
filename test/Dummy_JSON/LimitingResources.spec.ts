import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

test('All the resources can be used with query params to achieve pagination and get limited data', async ({ request }) => {
    const testRoute = await request.get(`${process.env.API_BASE_URL}/users?limit=10&skip=5&select=id,firstName,email`);
    expect(testRoute.ok()).toBeTruthy();
    expect(testRoute.status()).toBe(200);

    const testRouteBody = await testRoute.json();
    console.log('Response Body:', testRouteBody);

    // Verify the structure and content of the response
    expect(testRouteBody).toHaveProperty('users');
    expect(testRouteBody.users).toBeInstanceOf(Array);
    expect(testRouteBody.users.length).toBeLessThanOrEqual(10); // Ensure limit is respected
    expect(testRouteBody.skip).toBe(5); // Verify skip parameter
    expect(testRouteBody.limit).toBe(10); // Verify limit parameter

    // Define the interface for the user object based on the API response
    interface User {
        id: number;
        firstName: string;
        email: string;
    }

    // Check that only selected fields (id, firstName, email) are present
    testRouteBody.users.forEach((user: User) => { // Explicitly type 'user' as User
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('firstName');
        expect(user).toHaveProperty('email');
        expect(user).not.toHaveProperty('lastName'); // Ensure unselected fields are excluded
        expect(user).not.toHaveProperty('password'); // Ensure sensitive data is excluded
    });
});