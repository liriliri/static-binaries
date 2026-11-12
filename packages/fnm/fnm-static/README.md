# fnm-static

Static **[fnm](https://github.com/Schniz/fnm)** (Fast Node Manager) binaries for macOS, Linux, and Windows.

Binaries come from the [fnm releases](https://github.com/Schniz/fnm/releases) and are shipped as platform-specific optional dependencies (same pattern as [esbuild](https://esbuild.github.io/getting-started/)).

## Install

```bash
npm install fnm-static
```

## Usage

```js
const fnmPath = require('fnm-static')
const { spawnSync } = require('child_process')

spawnSync(fnmPath, ['--version'], { stdio: 'inherit' })
```

## Packages

| Package | Platform |
| --- | --- |
| `fnm-static` | Main package (resolves binary path) |
| `fnm-static-darwin` | macOS (`x64`, `arm64`) |
| `fnm-static-linux` | Linux (`x64`) |
| `fnm-static-win32` | Windows (`x64`) |

Bundled binary version: **1.39.0**.

## Developing

```bash
npm run download:fnm   # fetch releases into packages/fnm/*
npm run test:fnm
```

Binaries are **not** committed (they are large). Run `download:fnm` before local tests or `npm publish`.
