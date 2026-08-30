const base = (process.env.BILLING_API_BASE ?? 'https://api.sociobot.in').replace(/\/$/, '');
const slug = 'knowledge-boundary-map';
const checkout = `${base}/api/v1/products/${slug}/checkout`;

const catalogueResponse = await fetch(`${base}/api/v1/products`, { redirect: 'error' });
if (!catalogueResponse.ok) throw new Error(`Could not read the public product catalog: HTTP ${catalogueResponse.status}.`);
const catalogue = await catalogueResponse.json();
const product = catalogue.data?.find((entry) => entry.slug === slug);
if (!product) throw new Error(`Billing regression: ${slug} is absent from the public product catalog.`);
if (product.price_minor !== 1200 || product.currency !== 'USD') throw new Error(`Billing regression: expected ${slug} to cost $12 USD.`);
if (product.checkout_url !== checkout) throw new Error('Billing regression: the catalog checkout URL does not match the product checkout URL.');
if (product.product_url !== 'https://knowledge-boundary-map.sociobot.in/') throw new Error('Billing regression: the catalog product URL is not the production product origin.');

const checkoutResponse = await fetch(checkout, { redirect: 'manual' });
if (![301, 302, 303, 307, 308].includes(checkoutResponse.status)) {
  throw new Error(`Billing regression: checkout must redirect to hosted checkout, received HTTP ${checkoutResponse.status}.`);
}
const location = checkoutResponse.headers.get('location');
if (!location) throw new Error('Billing regression: checkout redirect has no Location header.');

console.log(JSON.stringify({ product, checkoutStatus: checkoutResponse.status, checkoutLocation: location }, null, 2));
