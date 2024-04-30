import { genPageMetadata } from 'app/seo'
import GithubRepoCard from '@/components/GithubRepoCard'
import { getLanguagesColor, getFeaturedRepos } from '../../utils/github'

export const metadata = genPageMetadata({ title: '我的开源项目' })
export default async function Projects() {
  const repos = await getFeaturedRepos()
  const colors = await getLanguagesColor()
  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            开源项目
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            感谢开源社区，让我学习到很多，虽然都是一些微不足道的小项目，我也希望能够为开源社区贡献一份力量。
          </p>
        </div>
        <div className="container py-12">
          <div className="flex flex-wrap pt-4 md:-mr-6">
            {repos.map((d) => (
              <div key={d.name} className="w-full pb-4 md:w-1/2 md:pr-6 lg:w-1/3">
                <GithubRepoCard {...d} color={d.language ? colors[d.language].color : '#f1e05a'} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
