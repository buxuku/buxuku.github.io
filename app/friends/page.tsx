import { genPageMetadata } from 'app/seo'
import { friendsData } from '@/data/friendsData'

export const metadata = genPageMetadata({ title: '友情链接' })
export default async function Projects() {
  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            我的朋友们
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            如果你也喜欢分享自己的好玩有事的事，欢迎咱们一起交换友链。你可以给我发送邮件：
            <a href="mailto:buxku@gmail.com">buxuku@gmail.com</a>
          </p>
        </div>
        <div className="container py-2">
          <div className="flex flex-wrap pt-4 md:-mr-6">
            {friendsData.map((d) => (
              <div key={d.title} className="pb-4  md:pr-6">
                <div className="border p-4 hover:scale-[1.1] hover:bg-gray-100">
                  <a href={d.href} target="_blank">
                    <h3 className="text-xl text-gray-900 dark:text-gray-100">{d.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400">{d.desc}</p>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
