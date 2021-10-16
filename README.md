# @aiou/actions-template
*a fork version of [typescript-action](https://github.com/actions/typescript-action), self use*

[![npm](https://img.shields.io/npm/v/@aiou/actions-template)](https://github.com/spring-catponents/actions-template) [![GitHub](https://img.shields.io/npm/l/@aiou/actions-template)](https://github.com/spring-catponents/actions-template) [![stackblitz](https://img.shields.io/badge/%E2%9A%A1%EF%B8%8Fstackblitz-online-blue)](https://github.com/spring-catponents/actions-template)

[Edit on StackBlitz ⚡️](https://github.com/spring-catponents/actions-template)

Use this template to bootstrap the creation of a Typescript action.:rocket:

This template includes tests, linting, a validation workflow, publishing, and versioning guidance.

## features

- 💪 Typescript - type safe
- 🦋 Changeset - modern changelog/version tool
- 📦 pnpm - much faster than yarn and npm
  
## development

Most toolkit and CI/CD operations involve async operations so the action is run in an async function.

```javascript
const core = require('@actions/core');
...

async function run() {
  try {
      ...
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
```

See the [toolkit documentation](https://github.com/actions/toolkit/blob/master/README.md#packages) for the various packages.

### change action.yml

The action.yml defines the inputs and output for your action.

Update the action.yml with your name, description, inputs and outputs for your action.

See the [documentation](https://help.github.com/en/articles/metadata-syntax-for-github-actions)


### publish

GitHub Actions will run the entry point from the action.yml. Packaging assembles the code into one file that can be checked in to Git, enabling fast and reliable execution and preventing the need to check in node_modules.

Actions are run from GitHub repos.  Packaging the action will create a packaged action in the dist folder.

Run prepare

```bash
pnpm run prepare
```

Since the packaged index.js is run from the dist folder.

```bash
git add dist
```

### release

Users shouldn't consume the action from master since that would be latest code and actions can break compatibility between major versions.

Checkin to the v1 release branch

```bash
git checkout -b v1
git commit -a -m "v1 release"
```

```bash
git push origin v1
```

Note: We recommend using the `--license` option for ncc, which will create a license file for all of the production node modules used in your project.

Your action is now published! :rocket:

See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)

## usage

You can now consume the action by referencing the v1 branch

```yaml
uses: <namespace>/<repo>@v1
with:
  milliseconds: 1000
```

See the [actions tab]() for runs of this action! :rocket:

# 
<div align='right'>

*built with ❤️ by 😼*

</div>
