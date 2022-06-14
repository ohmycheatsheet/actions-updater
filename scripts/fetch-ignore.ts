import { $fetch } from 'ohmyfetch'
import fs from 'fs'
import path from 'path'

const main = async () => {
  const result: string = await $fetch('https://www.toptal.com/developers/gitignore/api/node')
  console.log(result)
  const nodePatterns = result.split('\n').filter((line) => {
    return !line.startsWith('#') && !!line
  })
  const patterns = nodePatterns.map((line) => `"${line}"`)
  const exportIgnorePatterns = `
  export default [${patterns}]
  `
  fs.writeFileSync(path.resolve(__dirname, '../src/ignores.ts'), exportIgnorePatterns)
}

main()
