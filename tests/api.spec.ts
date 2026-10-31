
import { test, expect } from '@playwright/test';

const toolId = 4643;
const randomNumber = Math.random().toString().slice(2, 7);

let authToken: string;
let newOrderId: string;

// Tests share the token and order ID, so run them sequentially.
test.describe('API testing - test suite', () => {

  test.describe.configure({ mode: 'serial' });

  test('Get API server status', async ({ request }) => {
    const response = await request.get('/status');
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(response.statusText()).toBe('OK');
    expect(body.status).toBe('UP');
  });

  test('Get all tools', async ({ request }) => {
    const response = await request.get('/tools');
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(response.statusText()).toBe('OK');
    expect(body.length).toBe(20);
  });

  test('Get single tool', async ({ request }) => {
    const response = await request.get(`/tools/${toolId}`);
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(response.statusText()).toBe('OK');

    expect(body.id).toBe(toolId);
    expect(body.category).toBe('plumbing');
    expect(body.name).toBe('PEX Clamp Tool');
    expect(body.manufacturer).toBe('JWGJW');
    expect(body.price).toBe(3.45);
    expect(body['current-stock']).toBe(14);
    expect(body.inStock).toBe(true);
    expect(body).not.toHaveProperty('user-manual');
  });

  test('Get single tool with user manual', async ({ request }) => {
    const response = await request.get(`/tools/${toolId}`, {
      params: { 'user-manual': 'true' },
    });
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(response.statusText()).toBe('OK');

    expect(body.id).toBe(toolId);
    expect(body.category).toBe('plumbing');
    expect(body.name).toBe('PEX Clamp Tool');
    expect(body.manufacturer).toBe('JWGJW');
    expect(body.price).toBe(3.45);
    expect(body['current-stock']).toBe(14);
    expect(body.inStock).toBe(true);
    expect(body['user-manual']).toBeTruthy();
  });

  test('Register API client', async ({ request }) => {
    const clientData = {
      clientName: 'Playwright API Testing',
      clientEmail: `playwright${Date.now()}${randomNumber}@example.com`,
    };

    const response = await request.post('/api-clients', {
      data: clientData,
    });
    const body = await response.json();

    expect(response.status()).toBe(201);
    expect(response.statusText()).toBe('Created');

    authToken = body.accessToken;
    expect(authToken).toBeTruthy();
  });

  test('Create order', async ({ request }) => {
    const headers = {
      Authorization: `Bearer ${authToken}`,
    };

    // Get initial orders count
    const initialResponse = await request.get('/orders', { headers });
    const initialOrders = await initialResponse.json();

    expect(initialResponse.status()).toBe(200);

    const initialCount = initialOrders.length;

    // Create new order
    const response = await request.post('/orders', {
      headers,
      data: {
        toolId,
        customerName: 'Test customer',
      },
    });

    expect(response.status()).toBe(201);

    const body = await response.json();
    newOrderId = body.orderId;

    expect(newOrderId).toBeTruthy();

    // Verify orders count after creation
    const finalResponse = await request.get('/orders', { headers });
    const finalOrders = await finalResponse.json();

    expect(finalResponse.status()).toBe(200);
    expect(finalOrders.length).toBe(initialCount + 1);

    // Verify newly created order exists
    expect(finalOrders.some((order: { orderId: string }) =>
      order.orderId === newOrderId
    )).toBe(true);
  });

  test('Validate order details', async ({ request }) => {
    const response = await request.get(`/orders/${newOrderId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const body = await response.json();

    expect(response.status()).toBe(200);

    expect(body.orderId).toBe(newOrderId);
    expect(body.toolId).toBe(toolId);
    expect(body.customerName).toBe('Test customer');
    expect(body.quantity).toBe(1);
    expect(body).toHaveProperty('created');
    expect(body.comment).toBe('');
  });

  test('Update order', async ({ request }) => {
    const response = await request.patch(`/orders/${newOrderId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
      data: {
        customerName: 'Test customer updated',
        comment: 'Updated comment',
      },
    });

    expect(response.status()).toBe(204);

    // Verify updated order
    const verifyResponse = await request.get(`/orders/${newOrderId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const body = await verifyResponse.json();

    expect(verifyResponse.status()).toBe(200);
    expect(body.orderId).toBe(newOrderId);
    expect(body.customerName).toBe('Test customer updated');
    expect(body.comment).toBe('Updated comment');
  });

  test('Delete order', async ({ request }) => {
    const response = await request.delete(`/orders/${newOrderId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    expect(response.status()).toBe(204);

    // Verify order deletion
    const verifyResponse = await request.get(`/orders/${newOrderId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
      failOnStatusCode: false,
    });

    expect(verifyResponse.status()).toBe(404);
  });

});
