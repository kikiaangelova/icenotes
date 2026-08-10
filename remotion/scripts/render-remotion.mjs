import { bundle } from '@remotion/bundler';
import { renderMedia, renderStill, selectComposition, openBrowser } from '@remotion/renderer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const stillFrames = process.argv.slice(2).filter((a) => a.startsWith('--still='));

const bundled = await bundle({
  entryPoint: path.resolve(__dirname, '../src/index.ts'),
  webpackOverride: (config) => config,
});

const browser = await openBrowser('chrome', {
  browserExecutable: process.env.PUPPETEER_EXECUTABLE_PATH ?? '/bin/chromium',
  chromiumOptions: { args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'] },
  chromeMode: 'chrome-for-testing',
});

const composition = await selectComposition({ serveUrl: bundled, id: 'main', puppeteerInstance: browser });
console.log('duration', composition.durationInFrames);

if (stillFrames.length) {
  for (const arg of stillFrames) {
    const frame = Number(arg.split('=')[1]);
    await renderStill({
      composition,
      serveUrl: bundled,
      frame,
      output: `/tmp/still-${frame}.png`,
      puppeteerInstance: browser,
    });
    console.log('still', frame);
  }
} else {
  await renderMedia({
    composition,
    serveUrl: bundled,
    codec: 'h264',
    crf: 18,
    outputLocation: '/mnt/documents/icenotes-coach-kiki.mp4',
    puppeteerInstance: browser,
    muted: true,
    concurrency: 1,
  });
}

await browser.close({ silent: false });
