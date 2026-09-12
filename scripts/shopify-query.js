const https = require('https');
require('dotenv').config({ path: '.env.local' });
const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_TOKEN;

const data = JSON.stringify({
  query: `{
    products(first: 50) {
      edges {
        node {
          id
          title
          variants(first: 10) { edges { node { id price { amount currencyCode } } } }
        }
      }
    }
  }`
});

const options = {
  hostname: domain,
  port: 443,
  path: '/api/2024-01/graphql.json',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': token,
    'Content-Length': data.length
  }
};

const req = https.request(options, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log(JSON.stringify(JSON.parse(body), null, 2)));
});
req.write(data);
req.end();
