'use client'
import React from 'react'
import Typed from 'typed.js'
import Link from 'next/link'

const Greetings = () => {
  const el = React.useRef(null)
  const typed = React.useRef<Typed | null>(null)

  React.useEffect(() => {
    const options = {
      strings: [
        '我是一名前端工程师',
        '目前常居于天府之国-成都',
        '已有八年教育行业从业经验',
        '平时喜欢读读书，写写文字',
        '...',
      ],
      typeSpeed: 50,
      backSpeed: 50,
      loop: true,
    }

    // elRef refers to the <span> rendered below
    typed.current = new Typed(el.current, options)

    return () => {
      // Make sure to destroy Typed instance during cleanup
      // to prevent memory leaks
      typed.current?.destroy()
    }
  }, [])

  return (
    <div className="lg:mb-10 lg:mt-10">
      <h1 className="text-7xl font-extrabold text-gray-500">朋友,您好！</h1>
      <div className="dark:prose-dark prose lg:prose-lg">
        <p>
          欢迎光临， 我是 <b>林晓东</b>.
        </p>

        <p>这是我的个人博客，我将在这里记录分享我的一些学习知识与经验。</p>

        <div className="type-wrap">
          <span style={{ whiteSpace: 'pre' }} ref={el} />
          <br />

          <p>
            我于2006年开始接触互联网，曾经做过一名草根站长，涉足了前端，后端，运维包括SEO等等。目前重点专注于前端开发。在前端领域，也见证过原生js,
            JQuery, RequireJS, 到后来 React， Vue， Angular 三足鼎力的发展历程， 现重点专注的是
            React 方向， 包括 Umi， NextJs 及周边的各种生态{' '}
            <Link href="/about"> 了解更多关于我的信息 </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Greetings
