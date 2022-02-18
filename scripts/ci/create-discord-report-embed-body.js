module.exports = async ({ github, context, core }) => {
  const { SHA, app_unit_test_percentage, app_unit_test_diff } = process.env;
  const embedBody = [
    {
      title: 'Unit tests code coverage',
      color: '51281',
      fields: [
        {
          name: 'Percentage',
          value: app_unit_test_percentage,
          inline: true,
        },
        {
          name: 'Diff',
          value: app_unit_test_diff,
          inline: true,
        },
      ],
    },
  ];

  return JSON.stringify(embedBody);
};
