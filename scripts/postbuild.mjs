import rss from './rss.mjs'
import discussions from './discussion.mjs'

async function postbuild() {
  await rss()
  await discussions()
}

postbuild()
