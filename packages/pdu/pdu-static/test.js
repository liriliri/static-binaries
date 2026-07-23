'use strict'

const assert = require('assert')
const { spawnSync } = require('child_process')
const fs = require('fs')
const pduPath = require('.')

assert.ok(pduPath, 'expected pdu path for current platform')
assert.ok(fs.existsSync(pduPath), `pdu binary missing at ${pduPath}`)

const result = spawnSync(pduPath, ['--version'], { encoding: 'utf8' })
assert.strictEqual(result.status, 0, result.stderr || result.error)
assert.match(result.stdout + result.stderr, /0\.24\.0|pdu/i)

console.info('ok:', pduPath)
console.info((result.stdout || result.stderr).trim())
