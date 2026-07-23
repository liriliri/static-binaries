'use strict'

const assert = require('assert')
const { spawnSync } = require('child_process')
const fs = require('fs')
const adbPath = require('.')

assert.ok(adbPath, 'expected adb path for current platform')
assert.ok(fs.existsSync(adbPath), `adb binary missing at ${adbPath}`)

const result = spawnSync(adbPath, ['version'], { encoding: 'utf8' })
assert.strictEqual(result.status, 0, result.stderr || result.error)
assert.match(result.stdout, /Android Debug Bridge/i)

console.info('ok:', adbPath)
console.info(result.stdout.trim())
