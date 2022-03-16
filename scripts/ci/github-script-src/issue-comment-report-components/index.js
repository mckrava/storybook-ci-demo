const commentUtils = require('../utils/comment-utils');
const { commentDataKeys } = require('../utils/variables');

async function getCommentDataMetadata({ github, context, env }) {
  const {
    GITHUB_HEAD_REF,
    GITHUB_REF_NAME,
    REPORT_MSG_TITLE,
    GITHUB_SHA,
    GH_PAGES_CUSTOM_DOMAIN,
    PUBLISH_ARTIFACTS_WORKFLOW_DISPATCH_FILE,
  } = env;
  const [owner, repo] = context.payload.repository.full_name.split('/');
  const branchName =
    context.eventName === 'pull_request' ? GITHUB_HEAD_REF : GITHUB_REF_NAME;
  let commentMetaData = {};

  commentMetaData = {
    owner,
    repo,
    branchName,
    defaultBranch: context.payload.repository.default_branch,
    ghPagesCustomDomain: GH_PAGES_CUSTOM_DOMAIN,
    repoUrl: context.payload.repository.html_url,
    runId: context.runId,
    triggerCommit: null,
    existingIssueComment: null,
    suiteId: '',
    issueNumber: null,
    reportMessageTitle: REPORT_MSG_TITLE,
    publishArtifactsWorkflowDispatchFile:
      PUBLISH_ARTIFACTS_WORKFLOW_DISPATCH_FILE,
  };

  /**
   * Get triggered commit SHA
   */
  if (context.payload.after) {
    try {
      const triggerCommitResp = await github.rest.git.getCommit({
        owner,
        repo,
        commit_sha: context.payload.after,
      });
      commentMetaData.triggerCommit = triggerCommitResp.data;
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Fetch "existingIssueComment", "issueNumber"
   */
  if (context.eventName === 'pull_request') {
    try {
      commentMetaData.existingIssueComment =
        await commentUtils.findIssueComment({
          github,
          context,
          issueNumber: context.payload.number,
          bodyIncludes: REPORT_MSG_TITLE,
        });
    } catch (e) {
      console.log(e);
    }

    commentMetaData.issueNumber = context.payload.number;
  } else if (context.eventName === 'push') {
    const pullRequestsList = await github.request(
      `GET /repos/${owner}/${repo}/commits/${context.sha}/pulls`,
      {
        owner,
        repo,
        commit_sha: context.sha,
      }
    );
    console.log('[LOG]:: prList - ', pullRequestsList);
    const relatedPr = pullRequestsList.data.filter(
      (prItem) => prItem.state === 'open'
    );

    commentMetaData.issueNumber =
      relatedPr.length > 0 ? relatedPr[0].number : null;

    commentMetaData.existingIssueComment = commentMetaData.issueNumber
      ? await commentUtils.findIssueComment({
          github,
          context,
          issueNumber: commentMetaData.issueNumber,
          bodyIncludes: REPORT_MSG_TITLE,
        })
      : null;
  }

  if (!commentMetaData.issueNumber) return commentMetaData;

  /**
   * Get Suit ID
   */

  const suitesList = await github.request(
    `GET /repos/${owner}/${repo}/commits/${GITHUB_SHA}/check-suites`,
    {
      owner,
      repo,
      ref: GITHUB_SHA,
    }
  );

  console.log('[LOG]:: suitesList - ', suitesList);

  for (let suiteItem of suitesList.data.check_suites.filter(
    (item) => item.status === 'in_progress'
  )) {
    console.log('[LOG]:: suiteItem - ', suiteItem);
    commentMetaData.suiteId = suiteItem.id;
  }

  return commentMetaData;
}

async function processCommentData({ github, context, env }) {
  const {
    COMMENT_CACHED_CONTENT,
    IS_APP_STORYBOOK_BUILD_REPORT,
    IS_APP_STORYBOOK_DEPLOYMENT_REPORT,
    PUBLISH_ARTIFACTS_LIST,
    APP_STORYBOOK_BUILD_STATUS,
    APP_STORYBOOK_DEPLOYMENT_STATUS,
  } = env;
  let commentData = {};

  if (COMMENT_CACHED_CONTENT) {
    commentData = { ...COMMENT_CACHED_CONTENT };
  }

  commentData.commentMeta = getCommentDataMetadata({ github, context, env });

  if (!commentData.commentSections) commentData.commentSections = {};

  /**
   * IS_APP_STORYBOOK_BUILD_REPORT
   */
  if (IS_APP_STORYBOOK_BUILD_REPORT) {
    if (
      COMMENT_CACHED_CONTENT.hasOwnProperty(commentDataKeys.appStorybookBuild)
    ) {
      commentData.commentSections[commentDataKeys.appStorybookBuild] = {
        ...commentData.commentSections[commentDataKeys.appStorybookBuild],
      };
    }

    commentData.commentSections[commentDataKeys.appStorybookBuild].status =
      APP_STORYBOOK_BUILD_STATUS === 'true';
  }

  /**
   * IS_APP_STORYBOOK_DEPLOYMENT_REPORT
   */
  if (IS_APP_STORYBOOK_DEPLOYMENT_REPORT) {
    if (
      COMMENT_CACHED_CONTENT.hasOwnProperty(
        commentDataKeys.appStorybookDeployGhPages
      )
    ) {
      commentData.commentSections[commentDataKeys.appStorybookDeployGhPages] = {
        ...commentData.commentSections[
          commentDataKeys.appStorybookDeployGhPages
        ],
      };
    }

    commentData.commentSections[
      commentDataKeys.appStorybookDeployGhPages
    ].status = APP_STORYBOOK_DEPLOYMENT_STATUS === 'true';
  }

  return commentData;
}

async function getCommentMarkdownBody({ github, context, commentData = {} }) {
  const { commentMeta, commentSections } = commentData;
  let commentMarkdownBody = '';
  const commentSectionsList = Object.keys(commentSections);

  commentMarkdownBody = `:page_with_curl: **${commentMeta.reportMessageTitle}** <br />`;

  if (commentMeta.triggerCommit) {
    commentMarkdownBody += ` _Report has been triggered by commit [${commentMeta.triggerCommit.message} (${commentMeta.triggerCommit.sha})](${commentMeta.triggerCommit.html_url})_ `;
  }
  commentMarkdownBody += `<br /><br />`;

  /**
   * App Storybook Build
   */
  if (commentSectionsList.includes(commentDataKeys.appStorybookBuild)) {
    commentMarkdownBody += `:small_blue_diamond: **Application/Storybook build:** <br />
    - Status: ${
      commentSections[commentDataKeys.appStorybookBuild].status
        ? ':white_check_mark: _Built_ '
        : ':no_entry_sign: _Failed_ '
    }`;
  }

  /**
   * App Storybook Deploy
   */

  if (commentSectionsList.includes(commentDataKeys.appStorybookDeployGhPages)) {
    commentMarkdownBody += `<br /><br />`;
    commentMarkdownBody += `:small_blue_diamond: **Application/Storybook deployment:** <br />
    - Status: ${
      commentSections[commentDataKeys.appStorybookDeployGhPages].status
        ? ':white_check_mark: _Deployed_ '
        : ':no_entry_sign: _Failed_ '
    }`;
  }

  if (
    commentSectionsList.includes(commentDataKeys.appStorybookDeployGhPages) &&
    commentSections[commentDataKeys.appStorybookDeployGhPages].status
  ) {
    commentMarkdownBody += `
    <br />
    - [Application build page](https://${commentMeta.ghPagesCustomDomain}/${commentMeta.branchName}/app) <br />
    - [Storybook build page](https://${commentMeta.ghPagesCustomDomain}/${commentMeta.branchName}/storybook)
    `;
    commentMarkdownBody += `<br /><br />`;
  }

  commentMarkdownBody = commentMarkdownBody.replace(/(\r\n|\n|\r)/gm, '');

  return commentMarkdownBody;
}

async function runPublishArtifactsWorkflow({ github, commentData }) {
  const { commentMeta } = commentData;
  const preparedInputs = JSON.stringify(commentData);

  const workflowsList = await github.request(
    `GET /repos/${commentMeta.owner}/${commentMeta.repo}/actions/workflows`,
    {
      owner: commentMeta.owner,
      repo: commentMeta.repo,
    }
  );

  const publishArtifactsWf =
    workflowsList.data && workflowsList.data.total_count > 0
      ? workflowsList.data.workflows.find(
          (item) =>
            item.path ===
            `.github/workflows/${commentMeta.publishArtifactsWorkflowDispatchFile}`
        )
      : null;

  console.log('[LOG]:: publishArtifactsWf - ', publishArtifactsWf);

  if (!publishArtifactsWf) return preparedInputs;

  const dispatchResp = await github.rest.actions.createWorkflowDispatch({
    owner: commentMeta.owner,
    repo: commentMeta.repo,
    workflow_id: publishArtifactsWf.id,
    ref: commentMeta.defaultBranch,
    inputs: {
      issue_comment_data: preparedInputs,
    },
  });

  console.log('[LOG]:: dispatchResp - ', dispatchResp);
}

module.exports = {
  getCommentMarkdownBody: getCommentMarkdownBody,
  processCommentData: processCommentData,
  runPublishArtifactsWorkflow: runPublishArtifactsWorkflow,
};
