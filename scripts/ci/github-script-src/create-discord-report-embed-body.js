const getAppUnitTestReportData = require('./_app-unit-test-report');
const getAppSbBuildReportData = require('./_app-sb-build-report');

module.exports = async ({ github, context, core }) => {
  console.log('context - ', context);
  console.log('github - ', github);
  console.log('core - ', core);


  const {
    SHA,
    IS_APP_SB_BUILD_REPORT,
    IS_APP_UNIT_TEST_REPORT,
    IS_APP_E2E_TEST_REPORT,
    IS_SB_UNIT_TEST_REPORT,
    IS_SB_E2E_TEST_REPORT,

    APP_UNIT_TEST_PERCENTAGE,
    APP_UNIT_TEST_DIFF,
    APP_BUILD_STATUS,
    APP_UNIT_TEST_REF_BRANCH,
    APP_UNIT_TEST_SUCCESSFUL,
  } = process.env;

  const embedBody = [];

  if (IS_APP_UNIT_TEST_REPORT) {
    embedBody.push(
      getAppUnitTestReportData({
        APP_UNIT_TEST_PERCENTAGE,
        APP_UNIT_TEST_DIFF,
        APP_UNIT_TEST_REF_BRANCH,
        APP_UNIT_TEST_SUCCESSFUL,
      })
    );
  }

  if (IS_APP_SB_BUILD_REPORT) {
    embedBody.push(
      getAppSbBuildReportData({
        APP_BUILD_STATUS,
        context: context,
      })
    );
  }

  embedBody.push({
    description: `Check workflow execution results and artifacts [here](${context.repository.html_url}/actions/runs/${context.repository.runId})`,
  });

  return JSON.stringify(embedBody);
};
