const commentUtils = require('./utils/comment-utils');
const issueCommentComponents = require('./issue-comment-report-components');

module.exports = async ({ github, context, core }) => {
  const {
    REPORT_MSG_TITLE = 'Basilisk-UI workflows reporter',
    PUBLISH_ARTIFACTS_WORKFLOW_DISPATCH_FILE,
    PUBLISH_ARTIFACTS_LIST,
    COMMENT_CACHED_CONTENT,

    IS_APP_STORYBOOK_BUILD_REPORT,
    IS_APP_UNIT_TEST_REPORT,
    IS_APP_E2E_TEST_REPORT,
    IS_STORYBOOK_UNIT_TEST_REPORT,
    IS_STORYBOOK_E2E_TEST_REPORT,
    IS_APP_STORYBOOK_DEPLOYMENT_REPORT,

    APP_UNIT_TEST_PERCENTAGE,
    APP_UNIT_TEST_DIFF,

    APP_STORYBOOK_BUILD_STATUS,
    APP_UNIT_TEST_STATUS,
    APP_STORYBOOK_DEPLOYMENT_STATUS,

    GITHUB_HEAD_REF,
    GITHUB_REF_NAME,
    GITHUB_SHA,
    GITHUB_REF,
    GITHUB_BASE_REF, // for PR target branch

    GH_PAGES_CUSTOM_DOMAIN,
    GH_TOKEN,
  } = process.env;


  process.env.GITHUB_TOKEN = GH_TOKEN;

  console.log('[LOG]:: context - ', context);
  console.log('COMMENT_CACHED_CONTENT - ', COMMENT_CACHED_CONTENT);

  const commentData = await issueCommentComponents.processCommentData({
    env: process.env,
    github,
    context,
  });

  const commentMarkdownBody = issueCommentComponents.getCommentMarkdownBody({
    commentData,
    github,
    context,
  });

  if (!commentData.commentMeta.issueNumber) return commentData;

  await commentUtils.publishIssueComment({
    github,
    owner: commentData.commentMeta.owner,
    repo: commentData.commentMeta.repo,
    existingIssueCommentId: commentData.commentMeta.existingIssueComment
      ? commentData.commentMeta.existingIssueComment.id
      : null,
    commentBody: commentMarkdownBody,
    issueNumber: commentData.commentMeta.issueNumber,
  });

  if (PUBLISH_ARTIFACTS_LIST === 'true')
    await issueCommentComponents.runPublishArtifactsWorkflow({
      github,
      commentData,
    });

  return commentData;
};
