const { spawn, execSync } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');
const os = require('os');

const ARTIFACT_DIR = path.resolve('C:/Users/CASPER/.gemini/antigravity/brain/9218f77e-819a-4204-a950-5c9628eb2aab');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const VITE_BIN = path.resolve(__dirname, '../node_modules/vite/bin/vite.js');

if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

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
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  throw new Error('Server timeout on ' + url);
}

async function main() {
  console.log('[Capture] Vite preview sunucusu başlatılıyor...');
  const preview = spawn(process.execPath, [VITE_BIN, 'preview', '--host', '127.0.0.1', '--port', '4173'], {
    cwd: path.resolve(__dirname, '..'),
    stdio: 'ignore',
  });

  try {
    await waitForServer('http://127.0.0.1:4173');
    console.log('[Capture] Sunucu hazır. Ekran görüntüleri alınıyor...');

    const viewports = [
      { name: 'screenshot_360px.png', width: 360, height: 800 },
      { name: 'screenshot_768px.png', width: 768, height: 1024 },
      { name: 'screenshot_1280px.png', width: 1280, height: 900 },
    ];

    for (const vp of viewports) {
      const outPath = path.join(ARTIFACT_DIR, vp.name);
      const tempProfile = path.join(os.tmpdir(), `edge_prof_${Date.now()}_${vp.width}`);
      console.log(`[Capture] ${vp.width}x${vp.height} -> ${outPath}`);
      const cmd = `"${EDGE_PATH}" --headless --disable-gpu --no-first-run --no-default-browser-check --user-data-dir="${tempProfile}" --window-size=${vp.width},${vp.height} --screenshot="${outPath}" "http://127.0.0.1:4173"`;
      try {
        execSync(cmd, { stdio: 'ignore' });
      } catch (err) {
        console.warn(`[Capture] Viewport ${vp.width} uyarısı:`, err.message);
      }
    }

    console.log('[Capture] Ekran görüntüleri başarıyla tamamlandı.');
  } finally {
    console.log('[Capture] Sunucu kapatılıyor...');
    if (process.platform === 'win32') {
      try {
        execSync(`taskkill /pid ${preview.pid} /T /F`, { stdio: 'ignore' });
      } catch (e) {}
    } else {
      preview.kill('SIGTERM');
    }
  }
}

main().catch((err) => {
  console.error('[Capture] Hata:', err);
  process.exit(1);
});
