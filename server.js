const express = require('express');
const serverless = require('serverless-http');
const path = require('path');
const shopifyAPI = require('@shopify/shopify-api');

// Initialize Shopify API client
const shopifyClient = new shopifyAPI.clients.Rest({
  session: new shopifyAPI.session.CustomSessionStorage(['shopUrl', 'accessToken']),
});

// Create an Express app
const app = express();

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Parse incoming requests with JSON payloads
app.use(express.json());

// Endpoint to check order status
app.post('/check-order-status', async (req, res) => {
  const { phoneNumber, emailAddress } = req.body;

  try {
    // Set your shop URL and access token
    shopifyClient.session.shop = 'your-shop.myshopify.com';
    shopifyClient.session.accessToken = 'your-access-token';

    // Fetch orders from Shopify
    const orders = await shopifyClient.get({
      path: 'orders',
      query: {
        status: 'any',
        fields: 'id,name,total_price,created_at,status,shipping_address,email,phone',
      },
    });

    // Find the order matching the provided phone number or email address
    const order = orders.find((o) =>
      o.phone === phoneNumber || o.email === emailAddress
    );

    res.json({ order });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error checking order status');
  }
});

// Wrap the Express app with serverless-http
module.exports.handler = serverless(app);
