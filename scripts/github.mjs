import { request, gql } from 'graphql-request'

const endpoint = 'https://api.github.com/graphql'

const query = gql`
  query ($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      discussions(first: 100) {
        nodes {
          title
        }
      }
    }
  }
`

const mutation = gql`
  mutation ($repositoryId: ID!, $title: String!, $body: String!, $categoryId: ID!) {
    createDiscussion(input: {repositoryId: $repositoryId, title: $title, categoryId:$categoryId, body: $body}) {
      discussion {
        id
      }
    }
  }
`

const variables = {
    owner: process.env.GITHUB_USERNAME,
    name: process.env.GITHUB_REPOSITORY,
    categoryId: process.env.DISCUSSION_CATEGORY_ID,
    repositoryId: process.env.DISCUSSION_REPOSITORY_ID,
}

const headers = {
    Authorization: `bearer ${process.env.GITHUB_TOKEN}`,
}

export async function getDiscussions() {
    const res = await request(endpoint, query, variables, headers);
    return res.repository.discussions.nodes;
}

export async function createDiscussion(title, body) {
    variables.title = title;
    variables.body = body;
    await request(endpoint, query, variables, headers)
        .then(async (data) => {
            const discussions = data.repository.discussions.nodes;
            const discussionExists = discussions.some(discussion => discussion.title === variables.title);
            if (!discussionExists) {
                await request(endpoint, mutation, variables, headers)
                    .then((data) => {
                        console.log(`Created new discussion with id: ${data.createDiscussion.discussion.id}, ${variables.title}`);
                    })
                    .catch((err) => console.log(err))
            } else {
                console.log(`Discussion with title "${variables.title}" already exists.`);
            }
        })
        .catch((err) => console.log(err))
}
