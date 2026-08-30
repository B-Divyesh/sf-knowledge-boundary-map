const base = (process.env.VERIFY_URL ?? 'https://knowledge-boundary-map.sociobot.in').replace(/\/$/, '');
const response = await fetch(`${base}/assets/boundary-diorama.avif`, { redirect: 'error' });
const type = response.headers.get('content-type')?.split(';')[0];
if (type !== 'image/avif') throw new Error(`AVIF response policy regression: expected image/avif, received ${type ?? 'no Content-Type'}.`);
if (!response.ok) throw new Error(`AVIF response policy regression: received HTTP ${response.status}.`);
console.log(JSON.stringify({ url: response.url, status: response.status, contentType: type }, null, 2));
