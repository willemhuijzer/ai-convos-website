const { before, after, test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const screenshots = path.join(root, 'docs/registration/screenshots');
let browser, server, base;

before(async () => {
  server = http.createServer(async (request, response) => {
    const pathname = new URL(request.url, 'http://localhost').pathname;
    const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : decodeURIComponent(pathname)));
    if (!file.startsWith(root + path.sep)) { response.writeHead(403).end(); return; }
    try {
      const body = await fs.readFile(file);
      const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' }[path.extname(file)] || 'application/octet-stream';
      response.writeHead(200, { 'Content-Type': mime });
      response.end(body);
    } catch { response.writeHead(404).end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}) });
  if (process.env.CAPTURE_SCREENSHOTS) await fs.mkdir(screenshots, { recursive: true });
});

after(async () => {
  await browser?.close();
  await new Promise(resolve => server?.close(resolve));
});

async function pageFor(t, { configured = true, viewport = { width: 1440, height: 1040 }, overrides = {}, reducedMotion = 'reduce' } = {}) {
  const context = await browser.newContext({ viewport, reducedMotion });
  t.after(() => context.close());
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  t.after(() => assert.deepEqual(errors, [], 'no browser JavaScript errors'));
  if (configured) {
    // Only this test browser sees these fixtures. Production has empty links/endpoint.
    const fixture = {
      id: '04', title: 'ai convos #4', date: 'date to be announced', month: 'tba', day: '—', time: 'time to be announced',
      venue: 'address to be announced · Amsterdam', contribution: 'amount to be announced',
      registrationEndpoint: '/registrations', paymentUrl: 'https://example.com/payment',
      ...overrides,
    };
    await page.route('**/assets/edition.js', route => route.fulfill({
      contentType: 'text/javascript', body: `export const edition = ${JSON.stringify(fixture)};`,
    }));
  }
  return page;
}

async function fill(page) {
  await page.locator('#guest-name').fill('Ada Lovelace');
  await page.locator('#guest-email').fill('ada@example.com');
  await page.locator('#guest-notes').fill('Also paying for Sam; Sam will register separately.');
}

async function screenshot(page, name) {
  await page.evaluate(() => { document.activeElement?.blur(); window.scrollTo({ top: 0, behavior: 'instant' }); });
  await page.mouse.move(0, 0);
  // Check every visible element, not just the body's declared width.
  const overflow = await page.evaluate(() => [...document.querySelectorAll('body *')].filter(element => {
    const r = element.getBoundingClientRect();
    return r.width && (r.right > innerWidth + 1 || r.left < -1);
  }).map(element => element.tagName + '.' + element.className));
  assert.deepEqual(overflow, [], 'no horizontal overflow');
  const header = await page.evaluate(() => {
    const rect = selector => {
      const { top, bottom, left } = document.querySelector(selector).getBoundingClientRect();
      return { top, bottom, left };
    };
    return { month: rect('.edition-month'), label: rect('.edition-heading .eyebrow'), day: rect('.edition-day'), title: rect('.edition-heading h1'), location: rect('.edition-location') };
  });
  assert.ok(Math.abs(header.month.top - header.label.top) < 1, 'month aligns with the blue label');
  assert.ok(Math.abs(header.day.bottom - header.title.bottom) < 1, 'day aligns with the event title');
  assert.equal(header.location.left, header.title.left, 'address aligns under the event title');
  if (process.env.CAPTURE_SCREENSHOTS) await page.screenshot({ path: path.join(screenshots, name + '.png'), fullPage: true });
}

test('homepage links to the registration page; missing configuration never collects details', async t => {
  const page = await pageFor(t, { configured: false, reducedMotion: 'no-preference' });
  await page.goto(base + '/');
  await page.locator('.upcoming-edition').click();
  await page.waitForURL('**/registration.html');
  assert.equal(await page.locator('#guest-name').isDisabled(), true);
  assert.equal(await page.locator('#registration-unavailable').isVisible(), true);
  await screenshot(page, 'registration-not-open');
  await page.goto(base + '/registration.html#payment');
  assert.equal(await page.locator('[data-stage="details"]').isVisible(), true);
  await page.goto(base + '/registration.html#complete');
  assert.equal(await page.locator('[data-stage="details"]').isVisible(), true);
  assert.equal(await page.locator('[data-stage]').count(), 3);
  assert.doesNotMatch(await page.locator('body').textContent(), /questionnaire|First, a name|A small contribution helps|a question\? get in touch|Paying for someone else too/i);
});

for (const [size, viewport] of Object.entries({ desktop: { width: 1440, height: 1040 }, mobile: { width: 390, height: 844 } })) {
  test(`${size}: details → payment → completion; refresh and another attendee`, async t => {
    const page = await pageFor(t, { viewport });
    const requests = [];
    await page.route('**/registrations', async route => {
      requests.push(route.request().postData());
      await route.fulfill({ json: { ok: true } });
    });
    await page.goto(base + '/registration.html');
    await fill(page);
    await screenshot(page, `${size}-01-details`);
    await page.locator('#details-submit').click();
    await page.waitForURL('**/registration.html#payment');
    assert.equal(requests.length, 1);
    assert.match(requests[0], /Ada Lovelace/);
    assert.match(requests[0], /registration_id/);
    await page.locator('#payment-title').waitFor();
    assert.equal(await page.evaluate(() => document.activeElement.id), 'payment-title');
    await screenshot(page, `${size}-02-payment`);
    assert.equal(await page.locator('#payment-link').getAttribute('target'), '_blank');
    // No payment link click/verification is required to continue.
    await page.locator('[data-go="complete"]').click();
    await page.waitForURL('**/registration.html#complete');
    assert.equal(await page.locator('#complete-title').innerText(), 'Thanks, see you there.');
    assert.equal(await page.locator('[aria-current="step"]').getAttribute('data-progress'), 'complete');
    await screenshot(page, `${size}-03-completion`);
    assert.equal(await page.locator('iframe').count(), 0);
    const storage = await page.evaluate(() => JSON.stringify(sessionStorage));
    assert.doesNotMatch(storage, /Ada|ada@example|Sam/);
    assert.doesNotMatch(await page.locator('body').innerText(), /payment confirmed|spot confirmed/i);
    await page.reload();
    await page.locator('#complete-title').waitFor();
    assert.equal(requests.length, 1, 'refresh must not resubmit');
    await page.goBack();
    await page.locator('#payment-title').waitFor();
    await page.context().route('https://example.com/**', route => route.fulfill({ body: 'External payment fixture' }));
    const popupPromise = page.waitForEvent('popup');
    await page.locator('#payment-link').click();
    const popup = await popupPromise;
    await popup.waitForLoadState();
    assert.equal(popup.url(), 'https://example.com/payment');
    await popup.close();
    assert.equal(await page.locator('[data-stage="payment"]').isVisible(), true);
    await page.goForward();
    await page.locator('#complete-title').waitFor();
    const firstReceipt = await page.evaluate(() => sessionStorage.getItem('ai-convos:registration:04'));
    await page.locator('#register-another').click();
    assert.equal(await page.locator('#guest-name').inputValue(), '');
    await fill(page);
    await page.locator('#details-submit').click();
    await page.waitForURL('**/registration.html#payment');
    assert.equal(requests.length, 2);
    const secondReceipt = await page.evaluate(() => sessionStorage.getItem('ai-convos:registration:04'));
    assert.notEqual(JSON.parse(firstReceipt).id, JSON.parse(secondReceipt).id);
  });
}

test('validation, failed responses, retry and duplicate clicks do not advance without acknowledgment', async t => {
  const page = await pageFor(t);
  let attempts = 0;
  const ids = [];
  await page.route('**/registrations', async route => {
    attempts++;
    ids.push(route.request().postData().match(/name="registration_id"\r\n\r\n([^\r]+)/)[1]);
    await new Promise(resolve => setTimeout(resolve, 150));
    await route.fulfill(attempts === 1 ? { status: 503, json: { ok: false } } : { json: { ok: true } });
  });
  await page.goto(base + '/registration.html');
  await page.locator('#details-submit').click();
  assert.equal(attempts, 0);
  await fill(page);
  await page.locator('#guest-name').fill('   ');
  await page.locator('#details-submit').click();
  assert.equal(attempts, 0);
  await page.locator('#guest-name').fill('Ada Lovelace');
  await page.locator('#details-submit').click();
  await page.locator('#registration-error').waitFor();
  assert.equal(await page.locator('#guest-email').inputValue(), 'ada@example.com');
  await screenshot(page, 'submission-error');
  await page.locator('#details-submit').click();
  await page.evaluate(() => document.querySelector('#registration-form').dispatchEvent(new Event('submit', { cancelable: true })));
  await page.waitForURL('**/registration.html#payment');
  assert.equal(attempts, 2);
  assert.equal(ids[0], ids[1], 'retry uses the same deduplication key');
});

test('invalid payment links are not rendered; guests can still finish at 320px', async t => {
  const page = await pageFor(t, { viewport: { width: 320, height: 740 }, overrides: { paymentUrl: 'javascript:alert(1)' } });
  await page.route('**/registrations', route => route.fulfill({ json: { ok: true } }));
  await page.goto(base + '/registration.html');
  await fill(page);
  await page.locator('#details-submit').click();
  await page.waitForURL('**/registration.html#payment');
  assert.equal(await page.locator('#payment-unavailable').isVisible(), true);
  assert.equal(await page.locator('#payment-link').getAttribute('href'), null);
  await screenshot(page, 'payment-not-ready-mobile');
  await page.locator('[data-go="complete"]').click();
  await page.locator('#complete-title').waitFor();
});

test('confirmed date labels keep the shared header rows aligned', async t => {
  const page = await pageFor(t, { viewport: { width: 390, height: 844 }, overrides: { month: 'nov', day: '05', date: '5 November 2026' } });
  await page.goto(base + '/registration.html');
  assert.equal(await page.locator('.edition-month').innerText(), 'nov');
  assert.equal(await page.locator('.edition-day').innerText(), '05');
  // A synthetic date tests the layout without publishing an unconfirmed edition date.
  await screenshot(page, 'date-layout-fixture-mobile');
});

test('200 without a save acknowledgment does not claim success', async t => {
  const page = await pageFor(t);
  await page.route('**/registrations', route => route.fulfill({ json: {} }));
  await page.goto(base + '/registration.html');
  await fill(page);
  await page.locator('#details-submit').click();
  await page.locator('#registration-error').waitFor();
  assert.equal(await page.locator('[data-stage="details"]').isVisible(), true);
});
