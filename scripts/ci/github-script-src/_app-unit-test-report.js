module.exports = ({
  APP_UNIT_TEST_PERCENTAGE,
  APP_UNIT_TEST_DIFF,
  APP_UNIT_TEST_REF_BRANCH,
  APP_UNIT_TEST_STATUS,
}) => {
  const appUnitTestsData = [
    {
      name: 'App Unit tests',
      value: APP_UNIT_TEST_STATUS
        ? ':white_check_mark: Passed'
        : ':no_entry_sign: Failed',
      inline: false,
    },
  ];

  if (APP_UNIT_TEST_STATUS) {
    appUnitTestsData.push({
      name: 'Percentage',
      value: APP_UNIT_TEST_PERCENTAGE,
      inline: true,
    });
  }
  if (APP_UNIT_TEST_STATUS && APP_UNIT_TEST_REF_BRANCH) {
    appUnitTestsData.push({
      name: `Diff with ref branch - ${APP_UNIT_TEST_REF_BRANCH}`,
      value: APP_UNIT_TEST_DIFF,
      inline: true,
    });
  }

  return appUnitTestsData;
};
