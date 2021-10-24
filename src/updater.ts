import * as github from '@actions/github'

import * as gitUtils from './gitUtils'
import { readChangelog, update } from './utils'

const octokit = github.getOctokit(process.env.GITHUB_TOKEN!)
const gql = String.raw

export const createPR = async (owner: string, name: string) => {
  const info: any = await octokit.graphql(
    gql`
      query GetRepoID($owner: String!, $name: String!) {
        repository(owner: $owner, name: $name) {
          id
        }
      }
    `,
    {
      owner,
      name,
    },
  )
  console.log(info)
  const branch = github.context.ref.replace('refs/heads/', '')
  const head = 'omcs/latest'
  await gitUtils.switchToMaybeExistingBranch(head)
  await gitUtils.reset(github.context.sha)

  const searchQuery = `repo:${owner}/${name}+state:open+head:${head}+base:${branch}`
  const searchResult = await octokit.rest.search.issuesAndPullRequests({
    q: searchQuery,
  })

  console.log(searchResult)

  // read from .omcs/source
  await update()
  const commitMessage = 'chore: update template'
  // project with `commit: true` setting could have already committed files
  if (!(await gitUtils.checkIfClean())) {
    const finalCommitMessage = `${commitMessage}`
    await gitUtils.commitAll(finalCommitMessage)
  }
  await gitUtils.push(head, { force: true })
  // create pr
  const body = readChangelog()
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
