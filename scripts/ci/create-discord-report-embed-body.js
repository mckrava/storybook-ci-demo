module.exports = async ({ github, context, core }) => {
  const { SHA, app_unit_test_percentage, app_unit_test_diff } = process.env;
  const embedBody = {
    embeds: [
      {
        author: {
          name: 'Bot Tester',
        },
        title: 'Title',
        color: '51281',
        fields: [
          {
            name: 'Label',
            value: 648,
            inline: true,
          },
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
    ],
  };

  return embedBody;
};
