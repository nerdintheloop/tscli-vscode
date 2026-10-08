import { tscli } from '@nerdintheloop/tscli'
import { cp as _cp, mkdir as _mkdir, rm } from 'node:fs/promises'
import { parse, resolve } from 'node:path'
import { blue, green, LogMessageIcon, red, yellow } from './log'

type FileSystemFunctionArguments = {
  paths?: string[]
}

const PROJECT_DIRECTORY_PATH = new URL('..', import.meta.url).pathname

const cp = async ({ paths }: FileSystemFunctionArguments) => {
  if (paths && paths.length > 1) {
    const destinationPath = resolve(PROJECT_DIRECTORY_PATH, paths.pop()!)
    const destinationIsDirectory = await isDirectory(destinationPath)

    await Promise.all(paths.map(async path => {
      const sourcePath = resolve(PROJECT_DIRECTORY_PATH, path)
      const destinationFilePath = destinationIsDirectory ? resolve(destinationPath, parse(sourcePath).base) : destinationPath

      await _cp(sourcePath, destinationFilePath, { force: true, recursive: true })
    }))
  }
}

const isDirectory = async (path: string): Promise<boolean> => {
  try {
    return (await Bun.file(path).stat()).isDirectory()
  } catch {
    return false
  }
}

const mkdir = async ({ paths }: FileSystemFunctionArguments) => {
  if (paths) await Promise.all(paths.map(path => _mkdir(resolve(PROJECT_DIRECTORY_PATH, path))))
}

const rmdir = async ({ paths }: FileSystemFunctionArguments) => {
  if (paths) await Promise.all(paths.map(path => rm(resolve(PROJECT_DIRECTORY_PATH, path), { force: true, recursive: true })))
}

tscli`

Main:

  build Builds extension

  publish Publishes extension to the Open VSX Registry or the Visual Studio Marketplace
    --ovsx-token -o string Open VSX Registry access token
    --vsce-token -v string Visual Studio Marketplace access token

Utilities:

  cp Copies files in project
    ...paths The source path(s) and destination path

  log Logs a message with a timestamp, icon and/or label
    --error -e Writes to stderr and uses the error icon: ${red(LogMessageIcon.Error)}
    --info -i Uses the info icon: ${blue(LogMessageIcon.Info)}
    --label -l string The log label
    --start-timer -t Starts a timer
    --stop-timer -T Stops timer and outputs elapsed time
    --success -s Uses the success icon: ${green(LogMessageIcon.Success)}
    --wait -w Uses the wait icon: ${yellow(LogMessageIcon.Wait)}
    ...message string The log message

  mkdir Makes directories in project
    ...paths The directory paths

  rmdir Removes directories from project
    ...paths The directory paths

  update Updates dependencies to their latest versions

`({
  alias: 'tscli-vscode',
  functions: { cp, mkdir, rmdir },
  runtime: 'bun'
})
