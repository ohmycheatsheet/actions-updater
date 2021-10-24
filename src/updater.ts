import * as github from '@actions/github'

const octokit = github.getOctokit(process.env.GITHUB_TOKEN!)
const gql = String.raw

export const createPR = async (owner: string, name: string) => {
  const info: any = await octokit.graphql(
    gql`
      query GetRepoID($name: String!, $owner: String!) {
        repository(name: $name, owner: $owner) {
          id
        }
      }
    `,
    {
      name,
      owner,
    },
  )
  console.log(info)
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
      base: 'v1',
      head: 'omcs:latest',
      title: 'feat: update master',
      body: 'update master',
    },
  )
}
