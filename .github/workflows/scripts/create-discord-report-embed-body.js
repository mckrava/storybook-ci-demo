module.exports = async ({ github, context, core }) => {
  const { SHA, app_unit_test_percentage, app_unit_test_diff } = process.env;
  const embedBody = {
    embeds: [
      {
        title: 'Meow!',
        color: 1127128,
      },
      {
        title: 'Meow-meow!',
        color: 14177041,
        description: `Hi! :grinning: .Commit hash - ${SHA}`,
      },
    ],
  };

  return embedBody;
};
