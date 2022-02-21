module.exports = ({ APP_BUILD_STATUS, context }) => {
  const workingBranch = context.ref.replace('refs/heads/', '');
  const repoUrl = context.payload.repository.html_url;

  const appSbBuildData = {
    title: 'App / Storybook build',
    description: `Build of codebase in branch [${workingBranch}](${repoUrl}/tree/${workingBranch}) from commit [${context.sha}](${repoUrl}/commit/${context.sha})`,
    color: APP_BUILD_STATUS ? '65280' : '16711680',
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
