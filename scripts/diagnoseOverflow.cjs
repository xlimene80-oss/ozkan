const puppeteer = require('puppeteer-core');
const { spawn, execSync } = require('child_process');
const http = require('http');
const path = require('path');

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
      args: ['--no-sandbox', '--disable-gpu', '--window-size=1920,1080'],
    });

    const page = await browser.newPage();
    const testWidths = [320, 360, 390, 768, 1280, 1920];
    const results = [];

    for (const w of testWidths) {
      await page.setViewport({
        width: w,
        height: 800,
        isMobile: w <= 768,
        hasTouch: w <= 768,
        deviceScaleFactor: 1,
      });

      await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle0' });

      const metrics = await page.evaluate((width) => {
        const doc = document.documentElement;
        const body = document.body;
        const clientWidth = doc.clientWidth;
        const scrollWidth = Math.max(doc.scrollWidth, body.scrollWidth);
        const innerWidth = window.innerWidth;
        const hasOverflow = scrollWidth > clientWidth || scrollWidth > width;

        const overflowing = [];
        const all = document.querySelectorAll('*');
        for (const el of all) {
          const rect = el.getBoundingClientRect();
          if (rect.right > width + 0.5) {
            overflowing.push({
              tag: el.tagName.toLowerCase(),
              id: el.id || '',
              classSnippet: typeof el.className === 'string' ? el.className.substring(0, 100) : '',
              textSnippet: (el.textContent || '').trim().substring(0, 40),
              right: Math.round(rect.right),
              width: Math.round(rect.width),
              overflowPx: Math.round(rect.right - width),
            });
          }
        }

        return {
          viewportWidth: width,
          clientWidth,
          scrollWidth,
          hasOverflow,
          overflowingCount: overflowing.length,
          topOverflowElements: overflowing,
        };
      }, w);

      results.push(metrics);
    }

    console.log('\n================== DETAILED OVERFLOW TEST REPORT ==================');
    console.table(
      results.map((r) => ({
        'Genişlik (px)': r.viewportWidth,
        'clientWidth': r.clientWidth,
        'scrollWidth': r.scrollWidth,
        'Taşma Var mı?': r.hasOverflow ? 'EVET (HATA)' : 'HAYIR (BAŞARILI)',
        'Taşan Element Sayısı': r.overflowingCount,
      }))
    );

    for (const r of results) {
      if (r.hasOverflow || r.overflowingCount > 0) {
        console.log(`\n❌ ${r.viewportWidth}px genişliğinde taşan elementler (${r.overflowingCount} adet):`);
        r.topOverflowElements.forEach((el, i) => {
          console.log(`  ${i + 1}. <${el.tag} id="${el.id}" class="${el.classSnippet}">`);
          console.log(`     Metin: "${el.textSnippet}"`);
          console.log(`     Genişlik: ${el.width}px, Sağ Kenar: ${el.right}px, Taşma: +${el.overflowPx}px\n`);
        });
      }
    }
    console.log('===================================================================\n');
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
  console.error('[Diagnostic] Kritik Hata:', err);
  process.exit(1);
});
