module.exports = ({ APP_BUILD_STATUS, context }) => {
  const workingBranch = context.ref.replace('refs/heads/', '');

  const appSbBuildData = {
    title: 'App / Storybook build',
    description: `Build of codebase from branch [${workingBranch}](${context.repository.html_url}/tree/${workingBranch})`,
    fields: [
      {
        name: 'Status',
        value: APP_BUILD_STATUS
          ? ':white_check_mark: Built.'
          : ':no_entry_sign: Failed',
        inline: true,
      },
    ],
  };
  return appSbBuildData;
};
