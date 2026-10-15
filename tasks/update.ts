import { tscli } from '@nerdintheloop/tscli'
import { file, write } from 'bun'
import { readdir } from 'node:fs/promises'

export default async () => {
  await tscli.$`
    log -tWyl update Updating npm modules to their latest versions...
    cd ${new URL('..', import.meta.url).pathname}
    bun update --latest
    log -Wyl update Auditing/fixing npm modules...
    bun audit fix --latest
    log -Wyl update Modifying executable shebangs...
  `.capture({ errors: 'all', output: false })

  await Promise.all(((await readdir('node_modules/.bin')).map(async (name: string) => {
    const path = `node_modules/.bin/${name}`

    await write(path, (await file(path).text()).replace('#!/usr/bin/env node', '#!/usr/bin/env bun'))
  })))

  await tscli.$`log -CgTl update Update completed`
}
