# audiocpp-static

Static **[audiocpp_server](https://github.com/0xShug0/audio.cpp)** binaries for macOS (Apple Silicon), Linux, and Windows.

Binaries come from the [audio.cpp releases](https://github.com/0xShug0/audio.cpp/releases) and are shipped as platform-specific optional dependencies (same pattern as [esbuild](https://esbuild.github.io/getting-started/)).

Default backends: Metal on macOS arm64, CPU portable on Linux/Windows x64.

## Install

```bash
npm install audiocpp-static
```

## Usage

```js
const audiocppPath = require('audiocpp-static')
const modelSpecs = require('audiocpp-static/model-specs')
const { spawnSync } = require('child_process')

spawnSync(audiocppPath, ['--version'], { stdio: 'inherit' })
// Pass model specs when starting the server:
// spawnSync(audiocppPath, ['--model-spec-override', modelSpecs, '--config', 'server.json'])
```

`model_specs` lives in the main package (same across platforms). Shared libraries (`.so` / `.dll`) live next to the binary in the platform package.

## Packages

| Package | Platform | Backend |
| --- | --- | --- |
| `audiocpp-static` | Main package (resolves binary path) | — |
| `audiocpp-static-darwin-arm64` | macOS (`arm64`) | Metal |
| `audiocpp-static-linux` | Linux (`x64`) | CPU portable |
| `audiocpp-static-win32` | Windows (`x64`) | CPU portable |

Bundled binary version: **0.7.4**.

## Developing

```bash
npm run download:audiocpp   # fetch releases into packages/audiocpp/*
npm run test:audiocpp
```

Binaries are **not** committed (they are large). Run `download:audiocpp` before local tests or `npm publish`.
