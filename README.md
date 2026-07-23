# static-binaries

Monorepo of npm packages that ship static CLI binaries via platform-specific optional dependencies.

Each tool has its own directory under `packages/`, with a main package plus optional platform packages that contain the binaries.

## Packages

| Package | Description |
| --- | --- |
| [`adb-static`](packages/adb/adb-static) | Android `adb` |

## Layout

```text
packages/
  <tool>/
    download.mjs              # fetch binaries into platform packages
    <tool>-static/            # main package (resolves binary path)
    <tool>-static-<platform>/ # optional dependency with the binary
```

Example for adb:

```text
packages/adb/
  download.mjs
  adb-static/
  adb-static-darwin/
  adb-static-linux/
  adb-static-win32/
```

## Develop

```bash
npm install
npm run download:<tool>   # e.g. download:adb
npm run test:<tool>       # e.g. test:adb
```

## Publish

For each tool, publish platform packages first, then the main package (same version):

```bash
npm publish --access public ./packages/<tool>/<tool>-static-<platform>
npm publish --access public ./packages/<tool>/<tool>-static
```
