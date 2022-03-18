const commentUtils = require('./utils/github-api');
const issueCommentComponents = require('./utils/issue-comment');

module.exports = async ({ github, context, core }) => {
  const { PUBLISH_ARTIFACTS_LIST, COMMENT_CACHED_CONTENT } = process.env;

  console.log('[LOG]:: context - ', context);
  console.log('[LOG]:: COMMENT_CACHED_CONTENT - ', COMMENT_CACHED_CONTENT);

  const commentData = await issueCommentComponents.processCommentData({
    env: process.env,
    github,
    context,
  });

  const runsList = await github.rest.actions.listWorkflowRunsForRepo({
    owner: commentData.commentMeta.owner,
    repo: commentData.commentMeta.repo,
    branch: commentData.commentMeta.branchName,
  });

  console.log('runsList - ', runsList);

  const commentMarkdownBody = issueCommentComponents.getCommentMarkdownBody({
    commentData,
    github,
    context,
  });

  if (!commentData.commentMeta.issueNumber) return JSON.stringify(commentData);

  const publishCommentResp = await commentUtils.publishIssueComment({
    github,
    owner: commentData.commentMeta.owner,
    repo: commentData.commentMeta.repo,
    existingIssueCommentId: commentData.commentMeta.existingIssueComment
      ? commentData.commentMeta.existingIssueComment.id
      : null,
    commentBody: commentMarkdownBody,
    issueNumber: commentData.commentMeta.issueNumber,
  });

  if (publishCommentResp.status === 201)
    commentData.commentMeta.existingIssueComment = publishCommentResp.data;

  if (PUBLISH_ARTIFACTS_LIST === 'true')
    await issueCommentComponents.runPublishArtifactsWorkflow({
      github,
      commentData,
    });

  return JSON.stringify(commentData);
};
