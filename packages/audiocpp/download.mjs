import normalizePath from 'licia/normalizePath.js'
import path from 'path'

const engineVersion = 'v0.7.4'
const baseUrl = `https://github.com/0xShug0/audio.cpp/releases/download/${engineVersion}`

const pkgRoot = resolve(__dirname)
const tmpDir = resolve(__dirname, '.tmp')
const mainPkgDir = resolve(pkgRoot, 'audiocpp-static')

// Shared across platforms — ship once in the main package.
const sharedExtras = ['model_specs']

const platforms = [
  {
    pkgDir: 'audiocpp-static-darwin-arm64',
    archive: 'audio-v0.7.4-bin-macos-arm64-metal.tar.gz',
    hash: '639926715b1cb537f82aa31656aabbae5d9a85ac36568c402026968f3072e2b3',
    format: 'tar',
    binary: 'audiocpp_server',
  },
  {
    pkgDir: 'audiocpp-static-linux',
    archive: 'audio-v0.7.4-bin-ubuntu-x64-cpu-portable.tar.gz',
    hash: '8a93751b832c533e3261e760b4fd24af2397af3a193c862315653afd0dccc6ad',
    format: 'tar',
    binary: 'audiocpp_server',
    sharedLibs: true,
  },
  {
    pkgDir: 'audiocpp-static-win32',
    archive: 'audio-v0.7.4-bin-windows-x64-cpu-portable.zip',
    hash: 'd241c56ba78fd3c1b28bf289792fb8ec258d36586b4e0c8d667080ec248c0d2f',
    format: 'zip',
    binary: 'audiocpp_server.exe',
    sharedLibs: true,
  },
]

await fs.emptyDir(tmpDir)

let sharedCopied = false

for (const platform of platforms) {
  const { pkgDir, archive, hash, format, binary, sharedLibs } = platform
  const archivePath = resolve(tmpDir, archive)
  const extractDir = resolve(tmpDir, pkgDir)
  const destDir = resolve(pkgRoot, pkgDir)
  const downloadUrl = `${baseUrl}/${archive}`

  await fs.ensureDir(extractDir)
  await $`curl -Lk ${downloadUrl} > ${archivePath}`

  const actual = (
    await $`shasum -a 256 ${archivePath}`
  ).stdout
    .trim()
    .split(/\s+/)[0]
  if (actual !== hash) {
    throw new Error(`SHA-256 mismatch for ${archive}: expected ${hash}, got ${actual}`)
  }

  if (format === 'tar') {
    await $`tar -xzf ${archivePath} -C ${extractDir}`
  } else {
    await $`unzip -o ${archivePath} -d ${extractDir}`
  }

  // Archives may nest files at ./ or in a single top-level folder.
  const sourceRoot = await findSourceRoot(extractDir, binary)

  await cleanPackageDir(destDir)

  await fs.copy(resolve(sourceRoot, binary), resolve(destDir, binary))
  await fs.chmod(resolve(destDir, binary), 0o755)

  if (sharedLibs) {
    const entries = await fs.readdir(sourceRoot)
    for (const name of entries) {
      if (!isSharedLib(name)) continue
      await fs.copy(resolve(sourceRoot, name), resolve(destDir, name))
    }
  }

  if (!sharedCopied) {
    await cleanSharedExtras(mainPkgDir)
    for (const extra of sharedExtras) {
      const from = resolve(sourceRoot, extra)
      if (!(await fs.pathExists(from))) {
        throw new Error(`Missing ${extra} in ${archive}`)
      }
      await fs.copy(from, resolve(mainPkgDir, extra))
    }
    sharedCopied = true
    echo`  → packages/audiocpp/audiocpp-static/{${sharedExtras.join(', ')}}`
  }

  echo`  → packages/audiocpp/${pkgDir}/${binary}`
  await fs.remove(extractDir)
  await fs.remove(archivePath)
}

await fs.remove(tmpDir)
echo`Done. (audio.cpp ${engineVersion})`

function isSharedLib(name) {
  return (
    name.endsWith('.dll') ||
    name.endsWith('.so') ||
    /\.so\.\d/.test(name)
  )
}

async function cleanPackageDir(destDir) {
  await fs.ensureDir(destDir)
  for (const name of await fs.readdir(destDir)) {
    if (name === 'package.json' || name === 'README.md') continue
    await fs.remove(resolve(destDir, name))
  }
}

async function cleanSharedExtras(mainDir) {
  for (const extra of sharedExtras) {
    await fs.remove(resolve(mainDir, extra))
  }
}

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
