interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'VideoSubtitleGenerator',
    description: `批量为本地视频生成字幕文件，并可将字幕文件翻译成其它语言`,
    href: 'https://github.com/buxuku/VideoSubtitleGenerator',
  },
  {
    title: 'ai-code-reviewer',
    description: `一个利用 openai api 对 gitlab 提交的 merge request 进行 code review 的小工具`,
    href: 'https://github.com/buxuku/ai-code-reviewer',
  },
  {
    title: 'hexo-generator-readme',
    description: 'auto generator readme file for hexo blog',
    href: 'https://github.com/buxuku/hexo-generator-readme',
  },

  {
    title: 'hexo-auto-issue',
    description: 'hexo plug auto push post to issue',
    href: 'https://github.com/buxuku/hexo-auto-issue',
  },
  {
    title: 'hexo-generator-latest2json',
    description: 'build a latest post list to a json file',
    href: 'https://github.com/buxuku/hexo-generator-latest2json',
  },
  {
    title: 'nest-quotes',
    description: '个股财务分析爬虫',
    href: 'https://github.com/buxuku/nest-quotes',
  },
  {
    title: 'hexo-issue2readme',
    description: 'auto generator readme file for hexo blog from github issues.',
    href: 'https://github.com/buxuku/hexo-issue2readme',
  },
]

export const repos = [
  'buxuku/SmartSub',
  'buxuku/VideoSubtitleGenerator',
  'buxuku/buxuku.github.io',
  'buxuku/ai-code-reviewer',
  'buxuku/hexo-generator-readme',
  'buxuku/hexo-auto-issue',
  'buxuku/hexo-generator-latest2json',
  'buxuku/nest-quotes',
  'buxuku/hexo-issue2readme',
  'buxuku/nest-quotes',
]

export default projectsData
