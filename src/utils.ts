import { exec } from '@actions/exec'
import path from 'path'
import fs from 'fs-extra'
import * as core from '@actions/core'

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
  return path.resolve(process.cwd(), temp, '.omcs/source', pathname)
}

export const readChangelog = () => {
  const changelogOfSource = fs.readFileSync(rs('CHANGELOG.md')).toString()
  if (!fs.existsSync(rt('CHANGELOG.md'))) {
    return changelogOfSource
  }
  const changelogOfTarget = fs.readFileSync(rt('CHANGELOG.md')).toString()
  return changelogOfSource.slice(0, changelogOfSource.length - changelogOfTarget.length)
}

export const shouldUpdate = () => {
  if (fs.existsSync(rt('package.json'))) {
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
  await fs.copy(rs(), rt())
}
