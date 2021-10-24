import * as github from '@actions/github'
import { exec } from '@actions/exec'

const octokit = github.getOctokit(process.env.GITHUB_TOKEN!)
const gql = String.raw

/**
 * @see {@link https://github.com/changesets/action/blob/master/src/gitUtils.ts}
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

const checkout = async (branch: string) => {
  const { stderr } = await execWithOutput('git', ['checkout', branch], { ignoreReturnCode: true })
  const isCreatingBranch = !stderr.toString().includes(`Switched to a new branch '${branch}'`)
  if (isCreatingBranch) {
    await exec('git', ['checkout', '-b', branch])
  }
}

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
  await checkout(head)
  // TODO: tag head branch
  // TODO: body changelog
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
      body: 'update master',
    },
  )
}
