// refs: changeset/actions
import { exec } from '@actions/exec'

import { execWithOutput } from './utils'

export const setupUser = async () => {
  await exec('git', ['config', '--global', 'user.name', `"github-actions[bot]"`])
  await exec('git', [
    'config',
    '--global',
    'user.email',
    `"github-actions[bot]@users.noreply.github.com"`,
  ])
}

export const pullBranch = async (branch: string) => {
  await exec('git', ['pull', 'origin', branch])
}

export const push = async (branch: string, { force }: { force?: boolean } = {}) => {
  await exec(
    'git',
    ['push', 'origin', `HEAD:${branch}`, force && '--force'].filter<string>(Boolean as any),
  )
}

export const pushTags = async () => {
  await exec('git', ['push', 'origin', '--tags'])
}

export const switchToMaybeExistingBranch = async (branch: string) => {
  const { stderr } = await execWithOutput('git', ['checkout', branch], {
    ignoreReturnCode: true,
  })
  const isCreatingBranch = !stderr.toString().includes(`Switched to a new branch '${branch}'`)
  if (isCreatingBranch) {
    await exec('git', ['checkout', '-b', branch])
  }
}

export const reset = async (pathSpec: string, mode: 'hard' | 'soft' | 'mixed' = 'hard') => {
  await exec('git', ['reset', `--${mode}`, pathSpec])
}

export const commitAll = async (message: string) => {
  await exec('git', ['add', '.'])
  await exec('git', ['commit', '-m', message])
}

export const checkIfClean = async (): Promise<boolean> => {
  const { stdout } = await execWithOutput('git', ['status', '--porcelain'])
  return !stdout.length
}

export const clone = async ({
  repo,
  branch,
  folder,
}: {
  branch: string
  folder: string
  repo: string
}) => {
  const { stdout } = await execWithOutput('git', [
    'clone',
    '-b',
    branch,
    '--single-branch',
    '--depth',
    '1',
    `https://github.com/${repo}.git`,
    folder,
  ])
  return !stdout.length
}
