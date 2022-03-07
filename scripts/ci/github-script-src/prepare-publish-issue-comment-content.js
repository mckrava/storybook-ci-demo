const getComment = require('./_find-issue-comment');

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
  } = process.env;

  process.env.GITHUB_TOKEN = gh_token;
  const [owner, repo] = context.payload.repository.full_name.split('/');

  // const githubActions = require('@tonyhallett/github-actions');
  //
  // console.log(
  //   'githubActions - ',
  //   await githubActions.getWorkflowArtifactDetails()
  // );

  console.log('context - ', context);
  // console.log('process.env - ', process.env);

  const commentBody = `## Basilisk-reporter message. \n ---
  :small_blue_diamond: Application unit tests: ${
    APP_UNIT_TEST_STATUS === 'true'
      ? ':white_check_mark: Passed'
      : ':no_entry_sign: Failed'
  }\n
  Application tests code coverage: **${APP_UNIT_TEST_PERCENTAGE}**
  `;

  const existingIssueComment = await getComment({
    github,
    context,
    issueNumber: context.payload.number,
    bodyIncludes: 'Basilisk-reporter message.',
  });

  console.log('context.payload - ', context.payload.pull_request.head);

  const newSuiteResp = await github.rest.checks.createSuite({
    owner,
    repo,
    head_sha: context.payload.pull_request.head.sha,
  });

  console.log('newSuiteResp - ', newSuiteResp);

  const suite = await github.rest.checks.getSuite({
    owner,
    repo,
    check_suite_id: newSuiteResp.data.id,
  });

  const suitesList = await github.request(
    `GET /repos/${owner}/${repo}/commits/${context.payload.pull_request.head.sha}/check-suites`,
    {
      owner,
      repo,
      ref: context.payload.pull_request.head.sha,
    }
  );

  console.log('suitesList - ', suitesList);

  return JSON.stringify({
    commentBody,
    owner,
    repo,
    suiteId: suite.data.id,
    repoUrl: context.payload.repository.html_url,
    issueNumber: context.payload.number,
    runId: context.runId,
    existingIssueCommentId: existingIssueComment
      ? existingIssueComment.id
      : null,
  });
};
