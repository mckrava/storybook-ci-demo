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
  const commentTopTitle = 'Basilisk-UI workflows reporter';

  // const githubActions = require('@tonyhallett/github-actions');
  //
  // console.log(
  //   'githubActions - ',
  //   await githubActions.getWorkflowArtifactDetails()
  // );

  const triggerCommit = await github.rest.git.getCommit({
    owner,
    repo,
    commit_sha: context.payload.after,
  });

  // const ghPagesInfo = await github.rest.repos.getPages({
  //   owner,
  //   repo,
  // });
  const ghPagesInfo = await github.request(
    `GET /repos/${owner}/${repo}/pages`,
    {
      owner,
      repo,
    }
  );

  console.log('ghPagesInfo - ', ghPagesInfo);
  console.log('context - ', context);
  console.log('process.env - ', process.env);

  let commentBody = `:page_with_curl: **${commentTopTitle}**. <br />`;

  commentBody += ` _Report has been triggered by commit [${triggerCommit.data.message} (${triggerCommit.data.sha})](${triggerCommit.data.html_url})_ `;
  commentBody += `<br /><br />`;

  commentBody += `:small_blue_diamond: **Application/Storybook build:** <br /> 
    - Status: ${
      APP_BUILD_STATUS === 'true'
        ? ':white_check_mark: _Built_ '
        : ':no_entry_sign: _Failed_ '
    } <br />
    - [Application build]()
    - [Storybook build]()
`;

  commentBody += `<br /><br />`;

  commentBody = commentBody.replace(/(\r\n|\n|\r)/gm, '');

  const existingIssueComment = await getComment({
    github,
    context,
    issueNumber: context.payload.number,
    bodyIncludes: commentTopTitle,
  });

  // const newSuiteResp = await github.rest.checks.createSuite({
  //   owner,
  //   repo,
  //   head_sha: context.payload.pull_request.head.sha,
  // });
  //
  // console.log('newSuiteResp - ', newSuiteResp);
  //
  // const suite = await github.rest.checks.getSuite({
  //   owner,
  //   repo,
  //   check_suite_id: newSuiteResp.data.id,
  // });

  const suitesList = await github.request(
    `GET /repos/${owner}/${repo}/commits/${context.payload.pull_request.head.sha}/check-suites`,
    {
      owner,
      repo,
      ref: context.payload.pull_request.head.sha,
    }
  );
  let suiteId = '';

  for (let suiteItem of suitesList.data.check_suites.filter(
    (item) => item.status === 'in_progress'
  )) {
    console.log('suiteItem - ', suiteItem);
    suiteId = suiteItem.id;
  }

  console.log('commentBody - ', commentBody);

  return JSON.stringify({
    commentBody,
    owner,
    repo,
    suiteId,
    repoUrl: context.payload.repository.html_url,
    issueNumber: context.payload.number,
    runId: context.runId,
    existingIssueCommentId: existingIssueComment
      ? existingIssueComment.id
      : null,
  });
};
