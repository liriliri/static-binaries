'use strict'

const assert = require('assert')
const { spawnSync } = require('child_process')
const fs = require('fs')
const rclonePath = require('.')

assert.ok(rclonePath, 'expected rclone path for current platform')
assert.ok(fs.existsSync(rclonePath), `rclone binary missing at ${rclonePath}`)

const result = spawnSync(rclonePath, ['version'], { encoding: 'utf8' })
assert.strictEqual(result.status, 0, result.stderr || result.error)
assert.match(result.stdout + result.stderr, /rclone\s+v1\.75\.1/i)

console.info('ok:', rclonePath)
console.info((result.stdout || result.stderr).trim())
