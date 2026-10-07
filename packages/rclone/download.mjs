import normalizePath from 'licia/normalizePath.js'
import path from 'path'

const version = '1.75.1'
const baseUrl = `https://github.com/rclone/rclone/releases/download/v${version}`

const pkgRoot = resolve(__dirname)
const tmpDir = resolve(__dirname, '.tmp')

const platforms = [
  {
    pkgDir: 'rclone-static-darwin',
    archive: `rclone-v${version}-osx-amd64.zip`,
    binary: 'rclone',
  },
  {
    pkgDir: 'rclone-static-darwin-arm64',
    archive: `rclone-v${version}-osx-arm64.zip`,
    binary: 'rclone',
  },
  {
    pkgDir: 'rclone-static-linux',
    archive: `rclone-v${version}-linux-amd64.zip`,
    binary: 'rclone',
  },
  {
    pkgDir: 'rclone-static-win32',
    archive: `rclone-v${version}-windows-amd64.zip`,
    binary: 'rclone.exe',
  },
]

await fs.emptyDir(tmpDir)

for (const { pkgDir, archive, binary } of platforms) {
  const archivePath = resolve(tmpDir, archive)
  const extractDir = resolve(tmpDir, pkgDir)
  const destDir = resolve(pkgRoot, pkgDir)
  const downloadUrl = `${baseUrl}/${archive}`

  await fs.ensureDir(extractDir)
  await $`curl -Lk ${downloadUrl} > ${archivePath}`
  await $`unzip -o ${archivePath} -d ${extractDir}`

  const sourceRoot = await findSourceRoot(extractDir, binary)
  const destPath = resolve(destDir, binary)

  await fs.ensureDir(destDir)
  await fs.copy(resolve(sourceRoot, binary), destPath)
  await fs.chmod(destPath, 0o755)

  echo`  → packages/rclone/${pkgDir}/${binary}`
  await fs.remove(extractDir)
  await fs.remove(archivePath)
}

await fs.remove(tmpDir)
echo`Done. (rclone v${version})`

async function findSourceRoot(extractDir, binary) {
  if (await fs.pathExists(resolve(extractDir, binary))) {
    return extractDir
  }
  const entries = await fs.readdir(extractDir)
  for (const name of entries) {
    const candidate = resolve(extractDir, name)
    const stat = await fs.stat(candidate)
    if (stat.isDirectory() && (await fs.pathExists(resolve(candidate, binary)))) {
      return candidate
    }
  }
  throw new Error(`Could not find ${binary} under ${extractDir}`)
}

function resolve(...args) {
  return normalizePath(path.resolve(...args))
}
