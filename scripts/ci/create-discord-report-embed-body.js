module.exports = async ({ github, context, core }) => {
  // const { SHA, app_unit_test_percentage, app_unit_test_diff } = process.env;
  const embedBody = [
    {
      title: 'Title',
      color: '51281',
    },
  ];

  return JSON.stringify(embedBody);
};
