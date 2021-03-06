import * as core from '@actions/core'
import * as github from '@actions/github'

import { createPR } from './updater'
import { setupUser } from './gitUtils'
import { validate } from './utils'

async function run() {
  try {
    const { repo } = github.context
    if (!validate()) {
      console.log('Exited')
      return
    }
    await setupUser()
    await createPR(repo.owner, repo.repo)
  } catch (error) {
    core.setFailed((error as any).message)
  }
}

run()
