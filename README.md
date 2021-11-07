# @omcs/actions-updater
*fetch remote source repo and update current repo*

[![npm](https://img.shields.io/github/package-json/v/ohmycheatsheet/actions-updater)](https://github.com/ohmycheatsheet/actions-updater) [![GitHub](https://img.shields.io/github/license/ohmycheatsheet/actions-updater)](https://github.com/ohmycheatsheet/actions-updater)


## features

In default, this action will diff `source-template-repo` and `current-repo` by filepath recursive

- `deleted:` if `current/a.file` not exist in `source`, `a.file` will be deleted.
- `add:` if `current/a.file` not exist, but `source/a.file` exist, `a.file` will be added.
- `update:` if `current/a.file` and `source/a.file` exist, force update `current/a.file`

Friendly pr

- read changelog as pr body
- bump version like dependabot

![image](https://user-images.githubusercontent.com/6839576/140630037-09abd412-b19a-4893-bded-a3022949dafc.png)


## usage

1. create file `updater.yml` in `.github/workflows`
2. add following code to `updater.yml` file
  
```yml
name: "updater"

on:
  schedule:
    - cron: "0 23 * * *"

jobs:
  # test action works running from the schedule
  cronjob:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: ohmycheatsheet/actions-updater@v1
      with:
        repo: ohmycheatsheet/cheatsheets
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## variables

|name|description|type|required|
|:---:|:---:|:---:|:---|
|repo|(input) source repo|string|true|
|ignores|(input) ignore update files|string[]|false|
|GITHUB_TOKEN|(env) create/update pr|string|true|

## development

Setup environment

1. copy `.env.sample` file
2. replace `GITHUB_TOKEN`

Users shouldn't consume the action from master since that would be latest code and actions can break compatibility between major versions.

Checkin to the v1 release branch

```yml
pnpm
pnpm run prepare
ga .
gpsup
```

See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md), the [toolkit documentation](https://github.com/actions/toolkit/blob/master/README.md#packages) for the various packages.

See the [toolkit documentation](https://github.com/actions/toolkit/blob/master/README.md#packages) for the various packages.

### change action.yml

The action.yml defines the inputs and output for your action.

Update the action.yml with your name, description, inputs and outputs for your action.

See the [documentation](https://help.github.com/en/articles/metadata-syntax-for-github-actions)

# 
<div align='right'>

*built with ❤️ by 😼*

</div>
