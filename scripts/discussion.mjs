import { allBlogs } from '../.contentlayer/generated/index.mjs'
import { createDiscussion, getDiscussions } from './github.mjs';
import { sortPosts } from "pliny/utils/contentlayer.js";

const publishPosts = allBlogs.filter((post) => post.draft !== true)
const sortedPosts = sortPosts(publishPosts)

const allDiscussions = await getDiscussions();

const discussions = async () => {
    // 遍历所有文章
    for (const article of sortedPosts) {
        const discussionExists = allDiscussions.some(discussion => discussion.title === article.title);
        if(discussionExists){
            console.log(`${article.title} already exists.`);
            continue;
        }
        const note = `> [!NOTE]
> 本文通过 \`mdx\` 编辑，部分效果可能无法在纯 \`markdown\` 下渲染，更完整的阅读体验，欢迎访问博客页面 [${article.title}](${article.structuredData.url})
\n`
        await createDiscussion(article.title, note + article.body.raw)
    }
}

export default discussions
