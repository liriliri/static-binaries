import normalizePath from 'licia/normalizePath.js'
import path from 'path'

const version = '1.39.0'
const baseUrl = `https://github.com/Schniz/fnm/releases/download/v${version}`

const pkgRoot = resolve(__dirname)
const tmpDir = resolve(__dirname, '.tmp')

const platforms = [
  {
    pkgDir: 'fnm-static-darwin',
    archive: 'fnm-macos.zip',
    binary: 'fnm',
  },
  {
    pkgDir: 'fnm-static-linux',
    archive: 'fnm-linux.zip',
    binary: 'fnm',
  },
  {
    pkgDir: 'fnm-static-win32',
    archive: 'fnm-windows.zip',
    binary: 'fnm.exe',
  },
]

await fs.emptyDir(tmpDir)

for (const { pkgDir, archive, binary } of platforms) {
  const archivePath = resolve(tmpDir, archive)
  const extractDir = resolve(tmpDir, pkgDir)
  const destDir = resolve(pkgRoot, pkgDir)
  const destPath = resolve(destDir, binary)
  const downloadUrl = `${baseUrl}/${archive}`

  await fs.ensureDir(extractDir)
  await $`curl -Lk ${downloadUrl} > ${archivePath}`
  await $`unzip -o ${archivePath} -d ${extractDir}`

  await fs.ensureDir(destDir)
  await fs.copy(resolve(extractDir, binary), destPath)
  await fs.chmod(destPath, 0o755)

  echo`  → packages/fnm/${pkgDir}/${binary}`
  await fs.remove(extractDir)
  await fs.remove(archivePath)
}

await fs.remove(tmpDir)
echo`Done. (fnm v${version})`

function resolve(...args) {
  return normalizePath(path.resolve(...args))
}
