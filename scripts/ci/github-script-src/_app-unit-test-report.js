module.exports = ({
  APP_UNIT_TEST_PERCENTAGE,
  APP_UNIT_TEST_DIFF,
  APP_UNIT_TEST_REF_BRANCH,
  APP_UNIT_TEST_SUCCESSFUL,
}) => {
  const appUnitTestsData = {
    title: 'App Unit tests',
    color: APP_UNIT_TEST_SUCCESSFUL ? '65280' : '16711680',
    fields: [
      {
        name: 'Status',
        value: APP_UNIT_TEST_SUCCESSFUL
          ? ':white_check_mark: Passed'
          : ':no_entry_sign: Failed',
        inline: true,
      },
    ],
  };
  if (APP_UNIT_TEST_SUCCESSFUL) {
    appUnitTestsData.fields.push({
      name: 'Percentage',
      value: APP_UNIT_TEST_PERCENTAGE,
      inline: true,
    });
  }
  if (APP_UNIT_TEST_SUCCESSFUL && APP_UNIT_TEST_REF_BRANCH) {
    appUnitTestsData.fields.push({
      name: `Diff with ref branch - ${APP_UNIT_TEST_REF_BRANCH}`,
      value: APP_UNIT_TEST_DIFF,
      inline: true,
    });
  }

  return appUnitTestsData;
};
