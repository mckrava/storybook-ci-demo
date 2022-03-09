async function publishIssueComment({
  github,
  context,
  issueNumber,
  owner,
  repo,
  commentBody,
  existingIssueCommentId,
}) {
  try {
    if (!existingIssueCommentId || existingIssueCommentId === 'null') {
      await github.rest.issues.createComment({
        issue_number: issueNumber,
        owner,
        repo,
        body: commentBody,
      });
    } else {
      await github.rest.issues.updateComment({
        owner,
        repo,
        comment_id: existingIssueCommentId,
        body: commentBody,
      });
    }
    return 0;
  } catch (e) {
    console.log(e);
    return 1;
  }
}

module.exports = {
  publishIssueComment: publishIssueComment,
};
