import { tscli } from '@nerdintheloop/tscli'
import { write } from 'bun'
import packageJSON from '../package.json'
import tscliJSON from '../source/tscli.yaml'

export const build = async () => {
  const projectDirectoryPath = new URL('..', import.meta.url).pathname
  const { version } = packageJSON

  await tscli.$`
    log -wtl build Building tscli-vscode version ${version}...
    cd ${projectDirectoryPath}
    rmdir build dist
    mkdir build
    cp CHANGELOG.md LICENSE.txt README.md source/icon.png build
  `

  delete packageJSON.devDependencies

  await Promise.all([
    write('build/.vscodeignore', ''),
    write('build/package.json', JSON.stringify(packageJSON, null, '  ')),
    write('build/tscli.json', JSON.stringify(tscliJSON, null, '  ')),
  ])

  await tscli.$`
    log -wl build Packaging extension...
    cd build
  `

  const { exitCode } = await tscli.$`vsce package --no-dependencies`.capture()

  if (exitCode) return exitCode

  await tscli.$`
    log -wl build Cleaning up...
    cd ..
    mkdir dist
    cp build/tscli-vscode-${version}.vsix dist
    rmdir build
    log -sTl build Build completed
  `
}
