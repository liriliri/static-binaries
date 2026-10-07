'use strict'

const fs = require('fs')
const os = require('os')
const path = require('path')

const PLATFORM_PACKAGES = {
  darwin: {
    x64: 'rclone-static-darwin',
    arm64: 'rclone-static-darwin-arm64',
  },
  linux: 'rclone-static-linux',
  win32: 'rclone-static-win32',
}

const BINARY_NAME = {
  darwin: 'rclone',
  linux: 'rclone',
  win32: 'rclone.exe',
}

function resolveBinaryPath() {
  const platform = process.env.npm_config_platform || os.platform()
  const arch = process.env.npm_config_arch || process.arch
  const platformPackages = PLATFORM_PACKAGES[platform]
  const pkg =
    typeof platformPackages === 'string'
      ? platformPackages
      : platformPackages?.[arch]
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
