# rclone-static

Static **[rclone](https://rclone.org/)** binaries for macOS, Linux, and Windows.

Binaries come from the [rclone releases](https://github.com/rclone/rclone/releases) and are shipped as platform-specific optional dependencies (same pattern as [esbuild](https://esbuild.github.io/getting-started/)).

## Install

```bash
npm install rclone-static
```

## Usage

```js
const rclonePath = require('rclone-static')
const { spawnSync } = require('child_process')

spawnSync(rclonePath, ['version'], { stdio: 'inherit' })
```

## Packages

| Package | Platform |
| --- | --- |
| `rclone-static` | Main package (resolves binary path) |
| `rclone-static-darwin` | macOS (`x64`) |
| `rclone-static-darwin-arm64` | macOS (`arm64`) |
| `rclone-static-linux` | Linux (`x64`) |
| `rclone-static-win32` | Windows (`x64`) |

Bundled binary version: **1.75.1**.

## Developing

```bash
npm run download:rclone   # fetch releases into packages/rclone/*
npm run test:rclone
```

Binaries are **not** committed (they are large). Run `download:rclone` before local tests or `npm publish`.
