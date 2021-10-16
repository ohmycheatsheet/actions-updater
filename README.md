# @omcs/actions-updater
*🚧 fetch cheatsheet template and update it*

[![npm](https://img.shields.io/npm/v/@aiou/actions-template)](https://github.com/spring-catponents/actions-template) [![GitHub](https://img.shields.io/npm/l/@aiou/actions-template)](https://github.com/spring-catponents/actions-template) 

Use this template to bootstrap the creation of a Typescript action.:rocket:

This template includes tests, linting, a validation workflow, publishing, and versioning guidance.

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
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## variables

|name|description|type|required|
|:---:|:---:|:---:|:---|
|GITHUB_TOKEN|fetch github issues|string|true|

## development

Setup environment

1. copy `.env.sample` file
2. replace `GITHUB_TOKEN`, `ALGOLIA_APPID`, `ALGOLIA_APP_KEY`

Users shouldn't consume the action from master since that would be latest code and actions can break compatibility between major versions.

Checkin to the v1 release branch

```yml
pnpm
pnpm run build
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
