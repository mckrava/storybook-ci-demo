# Basilisk UI CI/CD

Basilisk-UI GitHub Actions are configured with using ["Reusing workflows"](https://docs.github.com/en/actions/using-workflows/reusing-workflows)
and [GitHub Script](https://github.com/actions/github-script).
We have root workflows which are configured for specific purposes with different 
trigger events (`pull_request`, `push`) and reusable modules/workflows which can be reused in different 
combinations/sequence in root workflow. 

---

### Used actions/libraries
- [GitHub Script](https://github.com/actions/github-script) - run JavaScript logic in GitHub Actions.
- [Discord for GitHub Actions](https://github.com/Ilshidur/action-discord) - publication messages to Discord channels.
- [code-coverage-action](https://github.com/barecheck/code-coverage-action) - generate/publish testing code coverage reports to PR.

![Alt text](1.png?raw=true "Title")

### Files naming/structure convention
- __root workflow file__ - (`.github/workflows/wf_*.yml`) has prefix `wf_`. Consists of reusable 
  workflow calls in different combinations regarding purposes. Should not contain any functionality for 
  building, testing, deployment, etc.
- __reusable workflow file__ - (`.github/workflows/_called_*.yml`) has prefix `_called_`. Contains 
  functionality for specific purpose (application build, unit testing, etc.). Should contain independent piece of full
  workflow, generate artifacts for next steps, publish reports, etc.
- __github scripts root module__ - (`./scripts/ci/github-script-src/*.js`) contains JavaScript logic for GitHub Script action.
- __github scripts imported module__ - (`./scripts/ci/github-script-src/_*.js`) contains JavaScript import modules for GitHub Script action.

---

## Existing reusing workflows

#### :chains:  Build App and Storybook ([.github/workflows/_called_build-app-and-storybook.yml](.github/workflows/_called_build-app-and-storybook.yml))
Build application and storybook.

:inbox_tray: ***Inputs***:
- `app-build-artifact-name`: _String, required_
- `storybook-build-artifact-name`: _String, required_
- `app-node-modules-cache-key`: _String, required_

:outbox_tray: ***Outputs***: -//-

:lock: ***Secrets***: -//-

<hr />

#### :chains:  Deploy App and Storybook ([.github/workflows/_called_deploy-app-and-storybook.yml](.github/workflows/_called_deploy-app-and-storybook.yml))
Deploy application and storybook to github pages.


This workflow is configured for deployment of UI application and Storybooks
at the same time. Each branch `develop|feat|fix/**` deploys to appropriate folder in `app-builds-gh-pages` branch.
Branch folder contains 2 sub-folders: `app` and `storybook` for UI app and Storybook builds
accordingly.

App UI builds and Storybooks are hosted in GitHub Pages.

For access to the builds you can use these paths:

- **UI app** - `https://galacticcouncil.github.io/Basilisk-ui/<folder_name>/<subfolder_name?>/app`
- **Storybook build** - `https://galacticcouncil.github.io/Basilisk-ui/<folder_name>/<subfolder_name?>/storybook`

Deployment triggers:

```yaml
push:
  branches:
    - develop
    - 'fix/**'
    - 'feat/**'
pull_request:
  branches:
    - 'fix/**'
    - 'feat/**'
```
<hr />

#### :chains:  Run unit tests on UI app ([.github/workflows/_called_run-app-unit-tests.yml](.github/workflows/_called_run-app-unit-tests.yml))
Run unit tests in UI application.

<hr />

#### :chains:  Publish reports in PR and Discord ([.github/workflows/_called_report-statuses.yml](.github/workflows/_called_report-statuses.yml))
Publish statuses and reports from different steps of root workflow.

<hr />

#FAQ

#### Workflow level `env` variables
We cannot use `env` variables in workflow level because of [this](https://github.com/actions/runner/issues/480) issue.