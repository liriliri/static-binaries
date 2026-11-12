'use strict'

const assert = require('assert')
const { spawnSync } = require('child_process')
const fs = require('fs')
const fnmPath = require('.')

assert.ok(fnmPath, 'expected fnm path for current platform')
assert.ok(fs.existsSync(fnmPath), `fnm binary missing at ${fnmPath}`)

const result = spawnSync(fnmPath, ['--version'], { encoding: 'utf8' })
assert.strictEqual(result.status, 0, result.stderr || result.error)
assert.match(result.stdout + result.stderr, /fnm\s+1\.39\.0/i)

console.info('ok:', fnmPath)
console.info((result.stdout || result.stderr).trim())
