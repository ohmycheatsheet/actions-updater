import * as github from '@actions/github'
import * as core from '@actions/core'
import fs from 'fs-extra'

import * as gitUtils from './gitUtils'
import { readChangelog, readVersion, rs, shouldUpdate, update } from './utils'

const octokit = github.getOctokit(process.env.GITHUB_TOKEN!)

export const createPR = async (owner: string, name: string) => {
  // repo info
  const branch = github.context.ref.replace('refs/heads/', '')
  const head = 'omcs/latest'
  await gitUtils.switchToMaybeExistingBranch(head)
  await gitUtils.reset(github.context.sha)

  const searchQuery = `repo:${owner}/${name}+state:open+head:${head}+base:${branch}`
  const searchResult = await octokit.rest.search.issuesAndPullRequests({
    q: searchQuery,
  })

  // update from SOURCE
  const version = readVersion()
  await gitUtils.clone({
    branch: version,
    folder: rs(),
    repo: core.getInput('repo'),
  })
  if (!shouldUpdate()) {
    await fs.remove(rs())
    return
  }
  const body = readChangelog()
  await update()
  await fs.remove(rs())

  // create pr
  const commitMessage = 'chore: update template'
  // project with `commit: true` setting could have already committed files
  if (!(await gitUtils.checkIfClean())) {
    const finalCommitMessage = `${commitMessage}`
    await gitUtils.commitAll(finalCommitMessage)
  }
  await gitUtils.push(head, { force: true })
  // create pr

  if (searchResult.data.items.length === 0) {
    await octokit.rest.pulls.create({
      base: branch,
      head,
      title: 'feat: update template',
      body,
      ...github.context.repo,
    })
  } else {
    await octokit.rest.pulls.update({
      pull_number: searchResult.data.items[0].number,
      title: 'feat: update template',
      body,
      ...github.context.repo,
    })
    console.log('pull request found')
  }
}
