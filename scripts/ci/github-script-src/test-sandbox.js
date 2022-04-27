const apiUtils = require('./utils/github-api');

module.exports = async ({ github, context, core }) => {
  console.log('[LOG]:: context - ', context);

  const { GITHUB_SHA } = process.env;
  const [owner, repo] = context.payload.repository.full_name.split('/');

  const tagsListResp = await github.rest.repos.listTags({
    owner,
    repo,
  });

  const commitTag = tagsListResp.data.find(
    (tagItem) => tagItem.commit.sha === GITHUB_SHA
  );

  console.log('[LOG]:: commitTag - ', commitTag);

  if (commitTag) return commitTag.name || GITHUB_SHA;

  const sourcePr = await apiUtils.getMergedPullRequest(
    github,
    owner,
    repo,
    GITHUB_SHA
  );

  console.log('[LOG]:: sourcePr - ', sourcePr)

  if (!sourcePr) return GITHUB_SHA;

  if (!sourcePr.head_ref.startsWith('release/')) return GITHUB_SHA;

  return sourcePr.head_ref.replace('release/', '') || GITHUB_SHA;
};
