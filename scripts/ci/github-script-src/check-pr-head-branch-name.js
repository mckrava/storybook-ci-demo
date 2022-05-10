const apiUtils = require('./utils/github-api');

/**
 * Returns application version name as commit hash or triggered commit tag or
 * release version. If commit which has triggered this action run has any tag,
 * this tag will be returned. If tag is not existing but push event has been
 * done after merge of pull request from "release/vX.X.X*" branch, "vX.X.X*"
 * part will be returned as an application version.
 * Default fallback value is commit hash (first 7 characters).
 *
 * @param github
 * @param context
 * @returns {Promise<string|*>}
 */
module.exports = async ({ github, context }) => {
  const { GITHUB_SHA, MATCH_BRANCH_NAME = 'release' } = process.env;
  const [owner, repo] = context.payload.repository.full_name.split('/');

  console.log('context- ', context)
  console.log('context base - ', context.payload.pull_request.base)
  console.log('context head - ', context.payload.pull_request.head)

  const sourcePr = await apiUtils.getMergedPullRequest(
    github,
    owner,
    repo,
    GITHUB_SHA
  );

  if (!sourcePr) return 'false';

  if (sourcePr.head_ref.startsWith('release/')) return 'true';

  return 'false'
};
