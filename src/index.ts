import core from '@actions/core'

// most @actions toolkit packages have async methods
async function run() {
  try {
    core.setOutput('message', 'hello world')
  } catch (error) {
    core.setFailed((error as any).message)
  }
}

run()
