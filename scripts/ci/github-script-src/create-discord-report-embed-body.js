const getAppUnitTestReportData = require('./_app-unit-test-report');
const getAppSbBuildReportData = require('./_app-sb-build-report');

module.exports = async ({ github, context, core }) => {
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
    APP_UNIT_TEST_STATUS,
    REPORT_MSG_TITLE = 'Basilisk-UI APP/Storybook build | testing | deployment',
  } = process.env;

  const embedBody = [
    {
      title: REPORT_MSG_TITLE,
      description: `Check workflow execution results and artifacts [here](${context.payload.repository.html_url}/actions/runs/${context.runId})`,
      color: !APP_BUILD_STATUS || !APP_UNIT_TEST_STATUS ? '16711680' : '65280',
      fields: [],
    },
  ];

  if (IS_APP_UNIT_TEST_REPORT) {
    embedBody.fields.push(
      ...getAppUnitTestReportData({
        APP_UNIT_TEST_PERCENTAGE,
        APP_UNIT_TEST_DIFF,
        APP_UNIT_TEST_REF_BRANCH,
        APP_UNIT_TEST_STATUS,
      })
    );
  }

  if (IS_APP_SB_BUILD_REPORT) {
    embedBody.fields.push(
      ...getAppSbBuildReportData({
        APP_BUILD_STATUS,
        context: context,
      })
    );
  }


  return JSON.stringify(embedBody);
};
