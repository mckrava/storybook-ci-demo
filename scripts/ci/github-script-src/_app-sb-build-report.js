module.exports = ({ APP_BUILD_STATUS, context }) => {
  const workingBranch = context.ref.replace('refs/heads/', '');
  const repoUrl = context.payload.repository.html_url;

  const appSbBuildData = [
    {
      name: 'App / Storybook build',
      value: `${
        APP_BUILD_STATUS
          ? ':white_check_mark: Built.'
          : ':no_entry_sign: Failed'
      }\n Build of codebase in branch [${workingBranch}](${repoUrl}/tree/${workingBranch}) from commit [${
        context.sha
      }](${repoUrl}/commit/${context.sha})`,
      inline: false,
    },
  ];
  return appSbBuildData;
};
