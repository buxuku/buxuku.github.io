import { request } from 'graphql-request';

const token = process.env.GITHUB_TOKEN; // 你的 GitHub Personal Access Token
const endpoint = 'https://api.github.com/graphql';

const headers = {
    Authorization: `Bearer ${token}`,
};

async function deleteDiscussions(owner, repo) {
    const getDiscussionsQuery = `
    query ($owner: String!, $name: String!) {
      repository(owner: $owner, name: $name) {
        discussions(first: 100) {
          nodes {
            id
          }
        }
      }
    }
  `;

    const deleteDiscussionMutation = `
    mutation ($id: ID!) {
      deleteDiscussion(input: {id: $id}) {
        clientMutationId
      }
    }
  `;

    try {
        // 获取仓库的所有 Discussions
        const data = await request(endpoint, getDiscussionsQuery, { owner, name: repo }, headers);
        const discussions = data.repository.discussions.nodes;

        // 遍历每个 Discussion
        for (const discussion of discussions) {
            // 删除 Discussion
            await request(endpoint, deleteDiscussionMutation, { id: discussion.id }, headers);
            console.log(`Deleted discussion ${discussion.id}`);
        }
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

// 使用你的 GitHub 用户名和仓库名替换 'owner' 和 'repo'
deleteDiscussions('buxuku', 'buxuku.github.io');
