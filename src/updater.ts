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
  update()
  const commitMessage = 'chore: update template'
  // project with `commit: true` setting could have already committed files
  if (!(await gitUtils.checkIfClean())) {
    const finalCommitMessage = `${commitMessage}`
    await gitUtils.commitAll(finalCommitMessage)
  }
  await gitUtils.push(head, { force: true })
  // create pr
  const body = readChangelog()
  // TODO: tag head branch
  if (searchResult.data.items.length === 0) {
    await octokit.graphql(
      gql`
        mutation CreatePullRequest(
          $id: ID!
          $base: String!
          $head: String!
          $title: String!
          $body: String!
        ) {
          createPullRequest(
            input: {
              repositoryId: $id
              baseRefName: $base
              headRefName: $head
              title: $title
              body: $body
            }
          ) {
            pullRequest {
              id
            }
          }
        }
      `,
      {
        id: info.repository.id,
        base: branch,
        head,
        title: 'feat: update master',
        body,
      },
    )
  } else {
    await octokit.graphql(
      gql`
        mutation UpdatePullRequest($id: ID!, $base: String!, $title: String!, $body: String!) {
          updatePullRequest(
            input: { pullRequestId: $id, baseRefName: $base, title: $title, body: $body }
          ) {
            pullRequest {
              id
            }
          }
        }
      `,
      {
        id: searchResult.data.items[0].number,
        base: branch,
        title: 'feat: update master',
        body,
      },
    )
  }
}
