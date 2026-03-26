import { tscli } from '@nerdintheloop/tscli'
import { writeFile } from 'node:fs/promises'
import packageJSON from '../package.json' with { type: 'json' }

export default async () => {
  const { version } = packageJSON

  await tscli.$`
    log -tWyl build Building tscli-vscode version ${version}...
    log -Wyl build Converting YAML grammar files into JSON...
  `

  let { exitCode, stderr, stdout } = await tscli.$`js-yaml source/tscli.yaml`.captureOutput().concat().text()

  if (exitCode) {
    console.error(stderr)
    return 1
  }

  await tscli.$`
    rm -rf build dist
    mkdir build
  `

  await writeFile('build/tscli.json', stdout)

  await tscli.$`
    log -Wyl build Adding other assets...
    cp CHANGELOG.md LICENSE.txt README.md source/icon.png build
    touch build/.vscodeignore
  `

  delete packageJSON.devDependencies

  await writeFile('build/package.json', JSON.stringify(packageJSON, null, '  '))

  await tscli.$`log -Wyl build Packaging extension...`

  void ({ exitCode, stderr, stdout } = await tscli.$`
    cd build
    vsce package --no-dependencies
    cd ..
  `.captureOutput().concat().text())

  if (exitCode) {
    console.error(stderr)
    return 1
  }

  await tscli.$`
    log -Wyl build Cleaning up...
    mkdir dist
    cp build/tscli-vscode-${version}.vsix dist
    rm -rf build
    log -CgTl build Build completed
  `
}
