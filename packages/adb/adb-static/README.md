# adb-static

Static **[adb](https://developer.android.com/tools/adb)** binaries for macOS, Linux, and Windows.

Binaries come from Google's [Android platform-tools](https://developer.android.com/tools/releases/platform-tools) and are shipped as platform-specific optional dependencies (same pattern as [esbuild](https://esbuild.github.io/getting-started/)).

## Install

```bash
npm install adb-static
```

## Usage

```js
const adbPath = require('adb-static')
const { spawnSync } = require('child_process')

spawnSync(adbPath, ['devices'], { stdio: 'inherit' })
```

## Packages

| Package | Platform |
| --- | --- |
| `adb-static` | Main package (resolves binary path) |
| `adb-static-darwin` | macOS (`x64`, `arm64`) |
| `adb-static-linux` | Linux (`x64`) |
| `adb-static-win32` | Windows (`x64`, `ia32`, `arm64`) |

On Windows the package also includes `AdbWinApi.dll` and `AdbWinUsbApi.dll` next to `adb.exe`.

## Developing

```bash
npm run download:adb   # fetch platform-tools into packages/adb/*
npm run test:adb
```

Binaries are committed under `packages/adb/adb-static-*` so installs do not need a postinstall download.
