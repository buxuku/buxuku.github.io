import fs from 'fs/promises';
import { allBlogs } from '../.contentlayer/generated/index.mjs'
import { sortPosts } from "pliny/utils/contentlayer.js";

const publishPosts = allBlogs.filter((post) => post.draft !== true)
const sortedPosts = sortPosts(publishPosts).slice(0, 10);

async function generateList(path) {
    // 读取 markdown 文件
    try {
        let data = await fs.readFile(path, 'utf8');

        // 假设你的文章列表是一个 bullet list，你可以通过正则表达式找到它
        const listStart = data.indexOf('<!-- START -->'); // 文章列表开始的标记
        const listEnd = data.indexOf('<!-- END -->'); // 文章列表结束的标记

        if (listStart === -1 || listEnd === -1) {
            console.log('未找到文章列表');
            return;
        }

        const beforeList = data.substring(0, listStart);
        const afterList = data.substring(listEnd);

        // 使用你的文章数组生成新的文章列表
        const newList = sortedPosts.map(article => `- [${article.title}](${article.structuredData.url})`).join('\n');

        // 将新文章列表插入到 markdown 文件中，然后写回文件
        const newData = `${beforeList}\n<!-- START -->\n${newList}\n${afterList}`;
        await fs.writeFile(path, newData, 'utf8');
        console.log('文章列表已更新');
    } catch (err) {
        console.log(err);
    }
}

['./README.md', './profile.md'].forEach(path => generateList(path));
