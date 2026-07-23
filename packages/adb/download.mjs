import normalizePath from 'licia/normalizePath.js'
import path from 'path'

const pkgRoot = resolve(__dirname)
const tmpDir = resolve(__dirname, '../../.tmp-adb')

const platforms = [
  {
    google: 'darwin',
    pkgDir: 'adb-static-darwin',
    files: ['adb'],
  },
  {
    google: 'linux',
    pkgDir: 'adb-static-linux',
    files: ['adb'],
  },
  {
    google: 'windows',
    pkgDir: 'adb-static-win32',
    files: ['adb.exe', 'AdbWinApi.dll', 'AdbWinUsbApi.dll'],
  },
]

await fs.emptyDir(tmpDir)

for (const { google, pkgDir, files } of platforms) {
  const zipName = `platform-tools-latest-${google}.zip`
  const zipPath = resolve(tmpDir, zipName)
  const extractDir = resolve(tmpDir, google)
  const downloadUrl = `https://dl.google.com/android/repository/${zipName}`
  const destDir = resolve(pkgRoot, pkgDir)
  const platformToolsDir = resolve(extractDir, 'platform-tools')

  await fs.ensureDir(extractDir)
  await $`curl -Lk ${downloadUrl} > ${zipPath}`
  await $`unzip -o ${zipPath} -d ${extractDir}`
  await fs.remove(zipPath)

  await fs.ensureDir(destDir)
  for (const file of files) {
    await fs.copy(resolve(platformToolsDir, file), resolve(destDir, file))
    if (file === 'adb' || file === 'adb.exe') {
      await fs.chmod(resolve(destDir, file), 0o755)
    }
    echo`  → packages/adb/${pkgDir}/${file}`
  }

  await fs.remove(extractDir)
}

await fs.remove(tmpDir)
echo`Done.`

function resolve(...args) {
  return normalizePath(path.resolve(...args))
}
