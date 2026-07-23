'use strict'

const fs = require('fs')
const os = require('os')
const path = require('path')

const PLATFORM_PACKAGES = {
  darwin: 'pdu-static-darwin',
  linux: 'pdu-static-linux',
  win32: 'pdu-static-win32',
}

const BINARY_NAME = {
  darwin: 'pdu',
  linux: 'pdu',
  win32: 'pdu.exe',
}

function resolveBinaryPath() {
  const platform = process.env.npm_config_platform || os.platform()
  const pkg = PLATFORM_PACKAGES[platform]
  const binary = BINARY_NAME[platform]

  if (!pkg || !binary) {
    return null
  }

  try {
    return require.resolve(`${pkg}/${binary}`)
  } catch {
    // Optional dependency may be missing (--no-optional / unsupported platform).
  }

  // Workspace / local monorepo fallback: binary next to the sibling package.
  const localPath = path.join(__dirname, '..', pkg, binary)
  if (fs.existsSync(localPath)) {
    return localPath
  }

  return null
}

module.exports = resolveBinaryPath()
