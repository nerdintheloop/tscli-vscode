import { tscli } from '@nerdintheloop/tscli'
import packageJSON from '../package.json' with { type: 'json' }

type PublishTaskFunctionArguments = {
  'ovsx-token': string
  'vsce-token': string
}

export const publish = async ({ 'ovsx-token': ovsxToken, 'vsce-token': vsceToken }: PublishTaskFunctionArguments) => {
  if (!ovsxToken && !vsceToken) {
    await tscli.$`log -brnx Open VSX Registry or Visual Studio Marketplace access token required + echo + help`
    return 1
  }

  const { version } = packageJSON
  const filePath = `dist/tscli-vscode-${version}.vsix`

  await tscli.$`
    log -bitwl publish Publishing...
    rm -rf build dist
    build
    ${ovsxToken ? `log -iwl publish Publishing to Open VSX Registry... + ovsx publish -i ${filePath} -p ${ovsxToken}` : ''}
    ${vsceToken ? `log -iwl publish Publishing to Visual Studio Marketplace... + vsce publish -i ${filePath} -p ${vsceToken}` : ''}
    log -bcgsl publish
  `
}
