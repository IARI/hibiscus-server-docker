import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseVersion } from '../get-version-from-changelog.js'

test('accepts the official plain version response', () => assert.equal(parseVersion('2.12.4\n'), '2.12.4'))
test('takes the first release header instead of a version mentioned in older notes', () =>
  assert.equal(parseVersion('<pre>01.10.2026 - Version 2.12.4\nFix since 2.10.25</pre>'), '2.12.4'))
test('rejects error pages and nightly versions', () => {
  assert.throws(() => parseVersion('<html>Unavailable</html>'))
  assert.throws(() => parseVersion('2.13.0-nightly'))
})
