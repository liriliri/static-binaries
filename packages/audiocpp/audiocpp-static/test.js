'use strict'

const assert = require('assert')
const { spawnSync } = require('child_process')
const fs = require('fs')
const audiocppPath = require('.')

assert.ok(audiocppPath, 'expected audiocpp_server path for current platform')
assert.ok(fs.existsSync(audiocppPath), `audiocpp_server binary missing at ${audiocppPath}`)

const result = spawnSync(audiocppPath, ['--version'], { encoding: 'utf8' })
assert.strictEqual(result.status, 0, result.stderr || result.error)
assert.match(result.stdout + result.stderr, /audio\.cpp\s+0\.7\.4/i)

console.info('ok:', audiocppPath)
console.info((result.stdout || result.stderr).trim())
