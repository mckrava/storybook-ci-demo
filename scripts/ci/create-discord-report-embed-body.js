module.exports = async ({ github, context, core }) => {
  const { SHA, app_unit_test_percentage, app_unit_test_diff } = process.env;
  const embedBody = {
    embeds: [
      {
        title: 'Meow!',
        color: 1127128,
      },
      {
        description:
          '*Hi!* **Wow!** I can __open__ action workflow [here](https://discord.com).',
      },
    ],
  };

  return embedBody;
};
