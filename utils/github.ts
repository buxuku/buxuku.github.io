import { repos } from 'data/projectsData'

export type Repository = {
  name: string
  html_url: string
  description: string
  language?: string
  stargazers_count?: number
  forks?: number
}

const fetchRepoData = async (repo: string): Promise<Repository> => {
  const response = await fetch(`https://api.github.com/repos/${repo}`, {
    headers: {
      Authorization: `bearer ${process.env.GITHUB_TOKEN}`,
    },
  })
  const repository: Repository = await response.json()

  return {
    name: repository.name,
    html_url: repository.html_url,
    description: repository.description || '',
    language: repository.language,
    stargazers_count: repository.stargazers_count,
    forks: repository.forks,
  }
}

export const getFeaturedRepos = async (): Promise<Repository[]> => {
  const data = await Promise.all(
    repos.map(async (repo) => {
      const repository = await fetchRepoData(repo)
      if (repository.name === undefined) return null
      return repository
    })
  )
  const results = data.filter((repo) => repo !== null) as Repository[]

  return results
}

export const getLanguagesColor = async () => {
  const res = await fetch('https://raw.githubusercontent.com/ozh/github-colors/master/colors.json')
  return await res.json()
}
