import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('PWAの起動・スコープ・アイコンはPagesのサブパス内に収まる', async () => {
  const manifest = JSON.parse(await readFile(new URL('../manifest.webmanifest', import.meta.url), 'utf8'));
  assert.ok(manifest.name);
  assert.equal(manifest.display, 'standalone');
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /rel="manifest" href="\.\/manifest\.webmanifest"/);
  for (const base of ['https://example.com/', 'https://example.com/software-cookbook/']) {
    const url = new URL('manifest.webmanifest', base);
    assert.equal(new URL(manifest.id, url).href, base);
    assert.equal(new URL(manifest.scope, url).href, base);
    assert.equal(new URL(manifest.start_url, url).href, `${base}index.html`);
    for (const size of [192, 512]) {
      const icon = manifest.icons.find(value => value.sizes === `${size}x${size}`);
      assert.equal(icon.type, 'image/png');
      assert.ok(new URL(icon.src, url).href.startsWith(base));
      const bytes = await readFile(new URL(`../${icon.src}`, import.meta.url));
      assert.deepEqual([...bytes.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
      assert.equal(bytes.readUInt32BE(16), size);
      assert.equal(bytes.readUInt32BE(20), size);
    }
  }
});
