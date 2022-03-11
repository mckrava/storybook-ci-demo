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
    GITHUB_REF_NAME,
    GITHUB_SHA,
    GITHUB_REF,
    GITHUB_BASE_REF, // for PR target branch

    GH_PAGES_CUSTOM_DOMAIN,
    GH_TOKEN,
  } = process.env;

  process.env.GITHUB_TOKEN = GH_TOKEN;

  console.log('context 1 - ', context);
  console.log('process.env - ', process.env);

  const [owner, repo] = context.payload.repository.full_name.split('/');
  const currentBranchName =
    context.eventName === 'pull_request' ? GITHUB_HEAD_REF : GITHUB_REF_NAME;
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
  commentBody += `<br /><br />`;

  if (IS_APP_SB_BUILD_REPORT === 'true') {
    commentBody += `:small_blue_diamond: **Application/Storybook build:** <br /> 
    - Status: ${
      APP_BUILD_STATUS === 'true'
        ? ':white_check_mark: _Built_ '
        : ':no_entry_sign: _Failed_ '
    }`;
  }

  if (IS_APP_SB_DEPLOYMENT_REPORT === 'true') {
    commentBody += `<br /><br />`;
    commentBody += `:small_blue_diamond: **Application/Storybook deployment:** <br /> 
    - Status: ${
      APP_DEPLOYMENT_STATUS === 'true'
        ? ':white_check_mark: _Deployed_ '
        : ':no_entry_sign: _Failed_ '
    }`;
  }

  if (
    IS_APP_SB_DEPLOYMENT_REPORT === 'true' &&
    APP_DEPLOYMENT_STATUS === 'true'
  ) {
    commentBody += `
    <br />
    - [Application build page](https://${GH_PAGES_CUSTOM_DOMAIN}/${currentBranchName}/app) <br />
    - [Storybook build page](https://${GH_PAGES_CUSTOM_DOMAIN}/${currentBranchName}/storybook)
    `;
    commentBody += `<br /><br />`;
  }

  commentBody = commentBody.replace(/(\r\n|\n|\r)/gm, '');

  let existingIssueComment = null;
  let suiteId = '';
  let issueNumber = null;

  if (context.eventName === 'pull_request') {
    existingIssueComment = await commentUtils.findIssueComment({
      github,
      context,
      issueNumber: context.payload.number,
      bodyIncludes: REPORT_MSG_TITLE,
    });

    issueNumber = context.payload.number;
  } else if (context.eventName === 'push') {
    const prList = await github.request(
      `GET /repos/${owner}/${repo}/commits/${context.sha}/pulls`,
      {
        owner,
        repo,
        commit_sha: context.sha,
      }
    );
    console.log('prList - ', prList);
    const relatedPr = prList.data.filter((prItem) => prItem.state === 'open');

    existingIssueComment =
      relatedPr.length > 0
        ? await commentUtils.findIssueComment({
            github,
            context,
            issueNumber: relatedPr[0].number,
            bodyIncludes: REPORT_MSG_TITLE,
          })
        : null;
  }

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
      // `GET /repos/${owner}/${repo}/commits/${context.payload.pull_request.head.sha}/check-suites`,
      `GET /repos/${owner}/${repo}/commits/${GITHUB_SHA}/check-suites`,
      {
        owner,
        repo,
        ref: GITHUB_SHA,
      }
    );

    console.log('suitesList - ', suitesList);

    for (let suiteItem of suitesList.data.check_suites.filter(
      (item) => item.status === 'in_progress'
    )) {
      console.log('suiteItem - ', suiteItem);
      suiteId = suiteItem.id;
    }

    // Run workflow for fetching and publication artifacts list

    const preparedInputs = JSON.stringify({
      publishArtifactsList: PUBLISH_ARTIFACTS_LIST,
      repoUrl: context.payload.repository.html_url,
      runId: context.runId,
      commentBody,
      owner,
      repo,
      suiteId,
      existingIssueCommentId,
      issueNumber,
    });

    const workflowsList = await github.request(
      `GET /repos/${owner}/${repo}/actions/workflows`,
      {
        owner,
        repo,
      }
    );

    console.log('workflowsList - ', workflowsList);

    const publishArtifactsWf =
      workflowsList.data && workflowsList.data.total_count > 0
        ? workflowsList.data.workflows.find(
            (item) =>
              item.path ===
              `.github/workflows/wfd_publish-issue-comment-with-artifacts.yml`
          )
        : null;

    console.log('publishArtifactsWf - ', publishArtifactsWf);

    if (publishArtifactsWf) {
      console.log('run params - ', {
        owner,
        repo,
        workflow_id: publishArtifactsWf.id,
        ref: 'develop',
        inputs: {
          issue_comment_data: preparedInputs,
        },
      });

      // const dispatchResp = await github.rest.actions.createWorkflowDispatch({
      //   owner,
      //   repo,
      //   // workflow_id: publishArtifactsWf.id,
      //   workflow_id: 'wfd_publish-issue-comment-with-artifacts.yml',
      //   // ref: currentBranchName,
      //   ref: context.payload.repository.default_branch,
      //   inputs: {
      //     issue_comment_data: preparedInputs,
      //   },
      // });

      // console.log(
      //   'eee - ',
      //   `POST /repos/${owner}/${repo}/actions/workflows/${publishArtifactsWf.id}/dispatches`,
      //   {
      //     ref: context.payload.pull_request.head.ref,
      //     inputs: {
      //       issue_comment_data: preparedInputs,
      //     },
      //   }
      // );

      // await github.request(
      //   `PUT /repos/${owner}/${repo}/actions/workflows/${publishArtifactsWf.id}/enable`,
      //   {
      //     owner,
      //     repo,
      //     workflow_id: publishArtifactsWf.id,
      //   }
      // );
      //

      const ghRequestWithAuth = github.request.defaults({
        headers: {
          accept: 'application/vnd.github.v3+json',
          authorization: `token ${GH_TOKEN}`,
        },
      });

      console.log('ghRequestWithAuth - ', ghRequestWithAuth);

      // const dispatchResp = await ghRequestWithAuth(
      //   `POST /repos/${owner}/${repo}/actions/workflows/${publishArtifactsWf.id}/dispatches`,
      //   {
      //     headers: {
      //       accept: 'application/vnd.github.v3+json',
      //       authorization: `token ${GH_TOKEN}`,
      //     },
      //     // ref: context.payload.pull_request.head.ref,
      //     ref: 'develop',
      //     inputs: {
      //       issue_comment_data: preparedInputs,
      //     },
      //   }
      // );

      // console.log('params - ', {
      //   headers: {
      //     accept: 'application/vnd.github.v3+json',
      //     authorization: `token ${GH_TOKEN}`,
      //   },
      //   method: 'POST',
      //   url: `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${publishArtifactsWf.id}/dispatches`,
      //   // ref: context.payload.pull_request.head.ref,
      //   data: {
      //     ref: 'develop',
      //     inputs: {
      //       issue_comment_data: preparedInputs,
      //     },
      //   },
      // })

      // const dispatchResp = await github.request({
      //   headers: {
      //     accept: 'application/vnd.github.v3+json',
      //     authorization: `Token ${GH_TOKEN}`,
      //   },
      //   method: 'POST',
      //   url: `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${publishArtifactsWf.id}/dispatches`,
      //   // ref: context.payload.pull_request.head.ref,
      //   data: {
      //     ref: 'develop',
      //     // inputs: {
      //     //   issue_comment_data: preparedInputs,
      //     // },
      //   },
      // });

      // const dispatchResp = await github.rest.actions.createWorkflowDispatch({
      //   owner,
      //   repo,
      //   workflow_id: publishArtifactsWf.id,
      //   // ref: currentBranchName,
      //   // ref: context.payload.repository.default_branch,
      //   ref: 'develop',
      //   // inputs: {
      //   //   issue_comment_data: preparedInputs,
      //   // },
      // });

      // console.log('dispatchResp - ', dispatchResp);

      const curlContent = `curl 
      -X POST 
      -H "Accept: application/vnd.github.v3+json" 
      -H "Authorization: token ${GH_TOKEN}" https://api.github.com/repos/${owner}/${repo}/actions/workflows/${publishArtifactsWf.id}/dispatches 
      -d '{"ref":"${context.payload.repository.default_branch}", "inputs": {"issue_comment_data": ${preparedInputs}}'
      `;

      return curlContent.replace(/(\r\n|\n|\r)/gm, '');
    }
  } else {
    await commentUtils.publishIssueComment({
      github,
      owner,
      repo,
      existingIssueCommentId,
      commentBody,
      issueNumber,
    });
  }

  console.log('commentBody - ', commentBody);

  // return JSON.stringify({
  //   publishArtifactsList: PUBLISH_ARTIFACTS_LIST,
  //   repoUrl: context.payload.repository.html_url,
  //   runId: context.runId,
  //   commentBody,
  //   owner,
  //   repo,
  //   suiteId,
  //   existingIssueCommentId,
  //   issueNumber,
  // });
};
