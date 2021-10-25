import { exec } from '@actions/exec'
import path from 'path'
import fs from 'fs-extra'
import * as core from '@actions/core'

import { SOURCE } from './constants'
import { clone } from './gitUtils'

/**
 * @see {@link https://github.com/changesets/action/blob/master/src/utils.ts}
 */
export async function execWithOutput(
  command: string,
  args?: string[],
  options?: { ignoreReturnCode?: boolean; cwd?: string },
) {
  let myOutput = ''
  let myError = ''

  return {
    code: await exec(command, args, {
      listeners: {
        stdout: (data: Buffer) => {
          myOutput += data.toString()
        },
        stderr: (data: Buffer) => {
          myError += data.toString()
        },
      },

      ...options,
    }),
    stdout: myOutput,
    stderr: myError,
  }
}

const rt = (pathname = '') => {
  const temp = core.getInput('debug') ? 'update-source' : ''
  return path.resolve(process.cwd(), temp, pathname)
}

const rs = (pathname = '') => {
  const temp = core.getInput('debug') ? 'update-source' : ''
  return path.resolve(process.cwd(), temp, SOURCE, pathname)
}

export const readChangelog = () => {
  if (!fs.existsSync(rs('CHANGELOG.md'))) {
    return 'update cheatsheets template'
  }
  const changelogOfSource = fs.readFileSync(rs('CHANGELOG.md')).toString()
  if (!fs.existsSync(rt('CHANGELOG.md'))) {
    return changelogOfSource
  }
  const changelogOfTarget = fs.readFileSync(rt('CHANGELOG.md')).toString()
  return changelogOfSource.slice(0, changelogOfSource.length - changelogOfTarget.length)
}

export const readVersion = () => {
  if (!fs.existsSync(rt('package.json'))) {
    return 'v1'
  }
  const pkg = fs.readJSONSync(rt('package.json'))
  const major = pkg.version.split('.')[0]
  return `v${major}`
}

export const shouldUpdate = () => {
  if (!fs.existsSync(rt('package.json'))) {
    return true
  }
  const pkgOfSource = fs.readJSONSync(rs('package.json'))
  const pkgOfTarget = fs.readJSONSync(rt('package.json'))
  if (pkgOfSource.version === pkgOfTarget.version) {
    return false
  }
  return true
}

export const update = async () => {
  const version = readVersion()
  await clone(version, rs())
  // no git submodules
  fs.removeSync(rs('.git'))
  // copy from SOURCE
  await fs.copy(rs(), rt())
  // clean up SOURCE
  await fs.remove(rs())
}
