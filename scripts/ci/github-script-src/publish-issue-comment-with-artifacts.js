const commentUtils = require('./utils/comment-utils');

function getArtifactUrl(repoHtmlUrl, checkSuiteNumber, artifactId) {
  return `${repoHtmlUrl}/suites/${checkSuiteNumber}/artifacts/${artifactId.toString()}`;
}

module.exports = async ({ github, context, core }) => {
  const {
    SHA,
    IS_APP_SB_BUILD_REPORT,
    IS_APP_SB_DEPLOYMENT_REPORT,
    IS_APP_UNIT_TEST_REPORT,
    IS_APP_E2E_TEST_REPORT,
    IS_SB_UNIT_TEST_REPORT,
    IS_SB_E2E_TEST_REPORT,

    APP_UNIT_TEST_PERCENTAGE,
    APP_UNIT_TEST_DIFF,
    APP_BUILD_STATUS,
    APP_UNIT_TEST_REF_BRANCH,
    APP_UNIT_TEST_STATUS,
    APP_DEPLOYMENT_STATUS,
    REPORT_MSG_TITLE = 'Basilisk-UI APP/Storybook build | testing | deployment',

    GITHUB_HEAD_REF,
    GITHUB_REF,
    GITHUB_REF_NAME,
    gh_token,
    issue_comment_data = '{}',
  } = process.env;

  process.env.GITHUB_TOKEN = gh_token;

  console.log('context - ', context);
  console.log('process.env - ', process.env);

  console.log(JSON.parse(issue_comment_data));

  let {
    owner,
    repo,
    runId,
    issueNumber,
    suiteId,
    repoUrl,
    existingIssueCommentId,
    commentBody,
  } = JSON.parse(issue_comment_data);

  if (!owner || !repo || !runId) return;

  const iterator = github.paginate.iterator(
    github.rest.actions.listWorkflowRunArtifacts,
    {
      owner,
      repo,
      run_id: runId,
      per_page: 100,
    }
  );

  commentBody += `:small_blue_diamond: **Available artifacts:** <br />`;

  for await (const { data: artifacts } of iterator) {
    console.log('---artifacts - ', artifacts);
    for (const artifact of artifacts) {
      console.log('artifact - ', artifact);
      commentBody += `- [${artifact.name}](${getArtifactUrl(
        repoUrl,
        suiteId,
        artifact.id
      )}) <br />`;
    }
  }

  await commentUtils.publishIssueComment({
    github,
    owner,
    repo,
    existingIssueCommentId,
    commentBody,
  });
};