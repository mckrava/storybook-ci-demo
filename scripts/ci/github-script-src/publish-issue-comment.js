const getComment = require('./utils/find-issue-comment');
const commentUtils = require('./utils/comment-utils');

module.exports = async ({ github, context, core }) => {
  const {
    REPORT_MSG_TITLE = 'Basilisk-UI workflows reporter',
    PUBLISH_ARTIFACTS_LIST,
    IS_APP_SB_BUILD_REPORT,
    IS_APP_UNIT_TEST_REPORT,
    IS_APP_E2E_TEST_REPORT,
    IS_SB_UNIT_TEST_REPORT,
    IS_SB_E2E_TEST_REPORT,
    IS_APP_SB_DEPLOYMENT_REPORT,

    APP_UNIT_TEST_PERCENTAGE,
    APP_UNIT_TEST_DIFF,

    APP_BUILD_STATUS,
    APP_UNIT_TEST_STATUS,
    APP_DEPLOYMENT_STATUS,

    GITHUB_HEAD_REF,
    GITHUB_REF,
    GITHUB_REF_NAME,

    GH_PAGES_CUSTOM_DOMAIN,
    GH_TOKEN,
  } = process.env;

  process.env.GITHUB_TOKEN = GH_TOKEN;

  console.log('context 1 - ', context);
  console.log('process.env - ', process.env);

  const [owner, repo] = context.payload.repository.full_name.split('/');

  let triggerCommit = null;

  // const ghPagesInfo = await github.rest.repos.getPages({
  //   owner,
  //   repo,
  // });
  // console.log('ghPagesInfo - ', ghPagesInfo);

  let commentBody = `:page_with_curl: **${REPORT_MSG_TITLE}** <br />`;

  if (context.payload.after) {
    triggerCommit = await github.rest.git.getCommit({
      owner,
      repo,
      commit_sha: context.payload.after,
    });
    commentBody += ` _Report has been triggered by commit [${triggerCommit.data.message} (${triggerCommit.data.sha})](${triggerCommit.data.html_url})_ `;
  }

  if (IS_APP_SB_BUILD_REPORT === 'true') {
    commentBody += `<br /><br />`;

    commentBody += `:small_blue_diamond: **Application/Storybook build:** <br /> 
    - Status: ${
      APP_BUILD_STATUS === 'true'
        ? ':white_check_mark: _Built_ '
        : ':no_entry_sign: _Failed_ '
    }`;
  }

  if (IS_APP_SB_BUILD_REPORT === 'true' && APP_BUILD_STATUS === 'true') {
    commentBody += `
    <br />
    - [Application build page](https://${GH_PAGES_CUSTOM_DOMAIN}/${GITHUB_HEAD_REF}/app) <br />
    - [Storybook build page](https://${GH_PAGES_CUSTOM_DOMAIN}/${GITHUB_HEAD_REF}/storybook)
    `;
    commentBody += `<br /><br />`;
  }

  commentBody = commentBody.replace(/(\r\n|\n|\r)/gm, '');

  let existingIssueComment = null;
  let suiteId = '';

  existingIssueComment = await getComment({
    github,
    context,
    issueNumber: context.payload.number,
    bodyIncludes: REPORT_MSG_TITLE,
  });

  const existingIssueCommentId = existingIssueComment
    ? existingIssueComment.id
    : null;

  if (PUBLISH_ARTIFACTS_LIST === 'true') {
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

    for (let suiteItem of suitesList.data.check_suites.filter(
      (item) => item.status === 'in_progress'
    )) {
      console.log('suiteItem - ', suiteItem);
      suiteId = suiteItem.id;
    }
  } else {
    await commentUtils.publishIssueComment({
      github,
      owner,
      repo,
      existingIssueCommentId,
      commentBody,
    });
  }

  console.log('commentBody - ', commentBody);

  return JSON.stringify({
    commentBody,
    owner,
    repo,
    suiteId,
    existingIssueCommentId,
    publishArtifactsList: PUBLISH_ARTIFACTS_LIST,
    repoUrl: context.payload.repository.html_url,
    issueNumber: context.payload.number,
    runId: context.runId,
  });
};
