const apiUtils = require('./utils/github-api');

/**
 * Check, if pull request head branch name starts from requested substring.
 *
 * @param github
 * @param context
 * @returns {Promise<string>}
 */
module.exports = async ({ github, context }) => {
  const {
    GITHUB_SHA,
    MATCH_BRANCH_NAME = 'release',
    EXACT_MATCH = 'false',
    MERGED_PR = 'false',
  } = process.env;
  const [owner, repo] = context.payload.repository.full_name.split('/');

  console.log('EXACT_MATCH - ', EXACT_MATCH);
  console.log('MATCH_BRANCH_NAME - ', MATCH_BRANCH_NAME);

  const sourcePr = await apiUtils.getPullRequest(
    github,
    owner,
    repo,
    GITHUB_SHA,
    MERGED_PR === 'false' ? 'open' : 'closed'
  );

  console.log('sourcePr - ', sourcePr);

  if (!sourcePr) return 'false';
  if (EXACT_MATCH === 'true' && sourcePr.head_ref === MATCH_BRANCH_NAME)
    return 'true';
  if (
    EXACT_MATCH === 'false' &&
    sourcePr.head_ref.startsWith(MATCH_BRANCH_NAME)
  )
    return 'true';
  return 'false';
};
