import normalizePath from 'licia/normalizePath.js'
import path from 'path'

const pduVersion = '0.24.0'
const baseUrl = `https://github.com/KSXGitHub/parallel-disk-usage/releases/download/${pduVersion}`

const pkgRoot = resolve(__dirname)

const platforms = [
  {
    pkgDir: 'pdu-static-darwin',
    remote: 'pdu-x86_64-apple-darwin',
    local: 'pdu',
  },
  {
    pkgDir: 'pdu-static-linux',
    remote: 'pdu-x86_64-unknown-linux-gnu',
    local: 'pdu',
  },
  {
    pkgDir: 'pdu-static-win32',
    remote: 'pdu-x86_64-pc-windows-msvc.exe',
    local: 'pdu.exe',
  },
]

for (const { pkgDir, remote, local } of platforms) {
  const destDir = resolve(pkgRoot, pkgDir)
  const destPath = resolve(destDir, local)
  const downloadUrl = `${baseUrl}/${remote}`

  await fs.ensureDir(destDir)
  await $`curl -Lk ${downloadUrl} > ${destPath}`
  await fs.chmod(destPath, 0o755)
  echo`  → packages/pdu/${pkgDir}/${local}`
}

echo`Done. (pdu ${pduVersion})`

function resolve(...args) {
  return normalizePath(path.resolve(...args))
}
