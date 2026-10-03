import fs from 'node:fs/promises'
import { pathToFileURL } from 'node:url'

export function parseVersion(text) {
  const plain = text.trim()
  if (/^\d+\.\d+\.\d+$/.test(plain)) return plain
  const pre = text.match(/<pre\b[^>]*>([\s\S]*?)<\/pre>/i)?.[1]
  const firstLine = pre?.trim().split(/\r?\n/)[0].replace(/<[^>]+>/g, '')
  if (/\b\d+\.\d+\.\d+[-+]/.test(firstLine || '')) throw new Error('Not a stable release header')
  const version = firstLine?.match(/\bVersion\s+(\d+\.\d+\.\d+)\b/i)?.[1]
    || firstLine?.match(/\b(\d+\.\d+\.\d+)\b/)?.[1]
  if (!version) throw new Error('Official release response contains no stable version')
  return version
}

async function main() {
  let version
  for (const url of [
    'https://www.willuhn.de/products/hibiscus-server/releases/version',
    'https://www.willuhn.de/products/hibiscus-server/changelog.php'
  ]) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await fetch(url, { signal: AbortSignal.timeout(20000) })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        version = parseVersion(await response.text())
        break
      } catch (error) {
        console.error(`Release check failed (${new URL(url).pathname}): ${error.cause?.code || error.message}`)
      }
    }
    if (version) break
  }
  if (!version) throw new Error('Official release site unavailable; existing version left unchanged')
  const existing = (await fs.readFile('release-version', 'utf8')).trim()
  const parts = (value) => value.split('.').map(Number)
  const old = parts(existing), next = parts(version)
  const difference = next.map((n, i) => n - old[i]).find((n) => n !== 0) || 0
  if (difference < 0) throw new Error('Refusing to downgrade the recorded release')
  await fs.writeFile('release-version', version + '\n')
  console.log(`Official stable Hibiscus Server release: ${version}`)
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  main().catch((error) => { console.error(error.message); process.exitCode = 1 })
