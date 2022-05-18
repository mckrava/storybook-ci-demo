const commentUtils = require('./utils/github-api');
const issueCommentComponents = require('./utils/issue-comment');

module.exports = async ({ github, context, core }) => {
  const { COMMENT_CACHED_CONTENT = '{}' } = process.env;

  console.log('[LOG]:: context 2 - ', context);
  console.log(JSON.parse(COMMENT_CACHED_CONTENT));

  let commentData = null;

  if (COMMENT_CACHED_CONTENT !== 'false') {
    try {
      commentData =
        typeof COMMENT_CACHED_CONTENT === 'string'
          ? JSON.parse(COMMENT_CACHED_CONTENT)
          : COMMENT_CACHED_CONTENT;
    } catch (e) {
      console.log(e);
    }
  }

  console.log('>>> commentData - ', commentData);

  if (!commentData) return 1;

  const { commentMeta, commentSections } = commentData;
  // const { commentMeta, commentSections } = JSON.parse(COMMENT_CACHED_CONTENT);

  if (
    !commentMeta.owner ||
    !commentMeta.repo ||
    !commentMeta.runsList ||
    commentMeta.runsList.length === 0
  )
    return;

  const availableArtifacts = await issueCommentComponents.getRunArtifactsList({
    github,
    commentMeta,
  });

  const commentMarkdownBody = issueCommentComponents.getCommentMarkdownBody({
    github,
    context,
    commentData: {
      commentMeta,
      commentSections,
      availableArtifacts,
    },
  });

  await commentUtils.publishIssueComment({
    github,
    owner: commentMeta.owner,
    repo: commentMeta.repo,
    existingIssueCommentId: commentMeta.existingIssueComment
      ? commentMeta.existingIssueComment.id
      : null,
    commentBody: commentMarkdownBody,
    issueNumber: commentMeta.issueNumber,
  });
};
