import rss from './rss.mjs'
import discussions from './discussions.mjs'

async function postbuild() {
  await rss()
  await discussions()
}

postbuild()
