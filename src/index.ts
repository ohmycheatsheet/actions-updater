import * as core from '@actions/core'
import * as github from '@actions/github'
import execa from 'execa'

import { createPR } from './updater'
import { setupUser } from './gitUtils'

async function run() {
  try {
    const { repo } = github.context
    // create pull request
    const { stdout } = await execa('ls')
    console.log(stdout, repo)
    await setupUser()
    await createPR(repo.owner, repo.repo)
  } catch (error) {
    core.setFailed((error as any).message)
  }
}

run()
