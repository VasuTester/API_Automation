import { test, expect, APIRequestContext } from '@playwright/test';

const baseUrl = 'https://dummyjson.com';

test('Get All Products', async ({ request }: { request: APIRequestContext }) => {
  // Fetch all products
  console.log('Fetching all products...');
  const productsResponse = await request.get(`${baseUrl}/products`);

  if (!productsResponse.ok()) {
    throw new Error(`Products fetch failed: ${productsResponse.status()}`);
  }

  const productsData = await productsResponse.json();
  console.log('Products Response:', productsData);
});