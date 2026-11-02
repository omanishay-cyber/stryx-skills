// Render every .art block of art.html to PNG, light and dark, at deviceScaleFactor 2, headless.
// Usage: node render.cjs <playwright-core path> <out folder>
const path = require('path');
const { pathToFileURL } = require('url');
const pw = require(process.argv[2] || 'playwright-core');
const out = process.argv[3] || path.join(__dirname, '..', 'png');

(async () => {
  const browser = await pw.chromium.launch({ channel: 'msedge', headless: true });
  const fs = require('fs'); fs.mkdirSync(out, { recursive: true });
  for (const theme of ['dark', 'light']) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
    await page.goto(pathToFileURL(path.join(__dirname, 'art.html')).href + '?theme=' + theme);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400);
    const ids = await page.$$eval('.art', els => els.map(e => e.id));
    for (const id of ids) {
      const file = path.join(out, `${id}-${theme}.png`);
      await page.locator('#' + id).screenshot({ path: file, omitBackground: true });
      console.log(file);
    }
    await page.close();
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
