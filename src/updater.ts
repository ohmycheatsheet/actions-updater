import * as github from '@actions/github'

const octokit = github.getOctokit(process.env.GITHUB_TOKEN!)
const gql = String.raw

export const createPR = async (repo: string) => {
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
      id: repo,
      base: 'master',
      head: 'omcs:v1',
      title: 'feat: update master',
      body: 'update master',
    },
  )
}
