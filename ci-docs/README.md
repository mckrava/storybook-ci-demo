# Basilisk UI CI/CD

## Workflows architecture

GitHub Actions are configured with using ["Reusing workflows"](https://docs.github.com/en/actions/using-workflows/reusing-workflows).
We have root workflows which are configured for specific purposes with different 
trigger events (`pull_request`, `push`) and reusable modules/workflows which can be reused in different 
combinations/sequence in root workflow.

### Files naming/structure convention
- __root workflow file__ - has prefix `wf_`. Consists of  
- __reusable workflow file__ - has prefix `_called_`


## Deployment

GitHub Actions Workflow is configured for deployment of UI application and Storybooks
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

To build optimized production artifacts locally you can run

```
yarn build
```