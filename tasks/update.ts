import { tscli } from '@nerdintheloop/tscli'
import { readdir, readFile, writeFile } from 'node:fs/promises'

export default async () => {
  await tscli.$`
    log -tWyl update Updating npm modules to their latest versions...
    bun update --latest
    log -Wyl update Auditing npm modules...
    bun audit
    log -Wyl update Modifying executable shebangs...
  `

  await Promise.all(((await readdir('node_modules/.bin')).map(async name => {
    const path = `node_modules/.bin/${name}`

    await writeFile(path, (await readFile(path, { encoding: 'utf8' })).replace('#!/usr/bin/env node', '#!/usr/bin/env bun'))
  })))

  await tscli.$`log -CgTl update Update completed`
}
