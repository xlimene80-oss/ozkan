const puppeteer = require('puppeteer-core');
const { spawn, execSync } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = path.resolve('C:/Users/CASPER/.gemini/antigravity/brain/9218f77e-819a-4204-a950-5c9628eb2aab');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const VITE_BIN = path.resolve(__dirname, '../node_modules/vite/bin/vite.js');

async function waitForServer(url, timeoutMs = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(url, (res) => {
          if (res.statusCode === 200) resolve();
          else reject(new Error('Status: ' + res.statusCode));
        });
        req.on('error', reject);
        req.setTimeout(1000, () => req.abort());
      });
      return true;
    } catch (e) {
      await new Promise((r) => setTimeout(r, 400));
    }
  }
  throw new Error('Server timeout on ' + url);
}

async function run() {
  const preview = spawn(process.execPath, [VITE_BIN, 'preview', '--host', '127.0.0.1', '--port', '4173'], {
    cwd: path.resolve(__dirname, '..'),
    stdio: 'ignore',
  });

  let browser;
  try {
    await waitForServer('http://127.0.0.1:4173');
    browser = await puppeteer.launch({
      executablePath: EDGE_PATH,
      headless: 'new',
      args: ['--no-sandbox', '--disable-gpu'],
    });

    const page = await browser.newPage();
    const configs = [
      { name: 'screenshot_360px.png', width: 360, height: 800, isMobile: true },
      { name: 'screenshot_768px.png', width: 768, height: 1024, isMobile: true },
      { name: 'screenshot_1280px.png', width: 1280, height: 900, isMobile: false },
    ];

    for (const c of configs) {
      await page.setViewport({
        width: c.width,
        height: c.height,
        isMobile: c.isMobile,
        hasTouch: c.isMobile,
        deviceScaleFactor: 1,
      });

      await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle0' });

      // Detaylı ölçüm
      const dims = await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll('.product-card-hover'));
        const cardWidths = cards.map((el) => Math.round(el.getBoundingClientRect().width));
        return {
          windowInnerWidth: window.innerWidth,
          docScrollWidth: document.documentElement.scrollWidth,
          bodyScrollWidth: document.body.scrollWidth,
          cardWidths: cardWidths.slice(0, 3),
        };
      });

      console.log(`[Viewport ${c.width}px]: innerWidth=${dims.windowInnerWidth}, scrollWidth=${dims.docScrollWidth}, cardWidths=${dims.cardWidths.join(', ')}px`);

      const outPath = path.join(ARTIFACT_DIR, c.name);
      await page.screenshot({ path: outPath, fullPage: false });
      console.log(`[Screenshot saved]: ${outPath}`);
    }
  } finally {
    if (browser) await browser.close();
    if (process.platform === 'win32') {
      try {
        execSync(`taskkill /pid ${preview.pid} /T /F`, { stdio: 'ignore' });
      } catch (e) {}
    } else {
      preview.kill('SIGTERM');
    }
  }
}

run().catch((err) => {
  console.error('[Error]:', err);
  process.exit(1);
});
