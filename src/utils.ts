import { exec } from '@actions/exec'
import * as github from '@actions/github'
import path from 'path'
import fs from 'fs-extra'
import globby from 'globby'
import difference from 'lodash.difference'
import intersection from 'lodash.intersection'
import ignores from '@aiou/eslint-ignore'
import * as core from '@actions/core'

import { SOURCE } from './constants'

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

export const rt = (pathname = '') => {
  const temp = core.getInput('debug') ? 'update-source' : ''
  return path.resolve(process.cwd(), temp, pathname)
}

export const rs = (pathname = '') => {
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
  if (!fs.existsSync(rs('package.json'))) {
    return 'v1'
  }
  const pkg = fs.readJSONSync(rs('package.json'))
  const major = pkg.version.split('.')[0]
  return `v${major}`
}

/**
 * @description validate input
 */
export const validate = () => {
  if (!core.getInput('repo') || !process.env.GITHUB_TOKEN) {
    console.log('Make sure below input correct')
    console.log('- [input]: `repo` is required')
    console.log('Make sure below env correct')
    console.log('- [env]: `GITHUB_TOKEN` is required')
    return false
  }
  return true
}

export const shouldUpdate = () => {
  if (core.getInput('repo') === `${github.context.repo.owner}/${github.context.repo.repo}`) {
    console.log('Skip: self update is not allowed')
    return false
  }
  if (!fs.existsSync(rt('package.json'))) {
    return true
  }
  const pkgOfSource = fs.readJSONSync(rs('package.json'))
  const pkgOfTarget = fs.readJSONSync(rt('package.json'))
  if (pkgOfSource.version === pkgOfTarget.version) {
    core.setOutput(
      'skip',
      `same version detected: current-${pkgOfTarget.version} vs source-${pkgOfSource.version}`,
    )
    return false
  }
  return true
}

/**
 * @todo support define ignore
 */
export const update = async () => {
  const defaultIgnores = ['.git', '.github'].concat(ignores).concat(core.getInput('ignores') || [])
  // copy from SOURCE
  const sources = await globby(['**'], {
    cwd: rs(),
    gitignore: true,
    dot: true,
    ignore: defaultIgnores,
  })
  const targets = await globby(['**'], {
    cwd: rt(),
    gitignore: true,
    dot: true,
    ignore: defaultIgnores.concat([SOURCE]),
  })
  const adds = difference(sources, targets)
  const dels = difference(targets, sources)
  const updates = intersection(sources, targets)
  for (const file of dels) {
    await fs.remove(rt(file))
  }
  for (const file of adds.concat(updates)) {
    await fs.copy(rs(file), rt(file))
  }
}
