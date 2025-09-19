import { test, expect, APIRequestContext } from '@playwright/test';

const baseUrl = 'https://dummyjson.com';

test('Get Single Product', async ({ request }: { request: APIRequestContext }) => {
  // Fetch single product with ID 1
  console.log('Fetching single product...');
  const productResponse = await request.get(`${baseUrl}/products/1`);

  if (!productResponse.ok()) {
    throw new Error(`Product fetch failed: ${productResponse.status()}`);
  }

  const productData = await productResponse.json();
  console.log('Product Response:', productData);
});