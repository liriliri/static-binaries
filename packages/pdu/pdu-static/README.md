# pdu-static

Static **[pdu](https://github.com/KSXGitHub/parallel-disk-usage)** (parallel-disk-usage) binaries for macOS, Linux, and Windows.

Binaries come from the [GitHub releases](https://github.com/KSXGitHub/parallel-disk-usage/releases) and are shipped as platform-specific optional dependencies (same pattern as [esbuild](https://esbuild.github.io/getting-started/)).

## Install

```bash
npm install pdu-static
```

## Usage

```js
const pduPath = require('pdu-static')
const { spawnSync } = require('child_process')

spawnSync(pduPath, ['.'], { stdio: 'inherit' })
```

## Packages

| Package | Platform |
| --- | --- |
| `pdu-static` | Main package (resolves binary path) |
| `pdu-static-darwin` | macOS (`x64`) |
| `pdu-static-darwin-arm64` | macOS (`arm64`) |
| `pdu-static-linux` | Linux (`x64`) |
| `pdu-static-win32` | Windows (`x64`) |

Bundled binary version: **0.24.0**.

## Developing

```bash
npm run download:pdu   # fetch binaries into packages/pdu/*
npm run test:pdu
```

Binaries are committed under `packages/pdu/pdu-static-*` so installs do not need a postinstall download.
