module.exports = ({ APP_DEPLOYMENT_STATUS, context }) => {
  const workingBranch = context.ref.replace('refs/heads/', '');
  const repoUrl = context.payload.repository.html_url;

  console.log(
    'APP_DEPLOYMENT_STATUS - ',
    APP_DEPLOYMENT_STATUS,
    typeof APP_DEPLOYMENT_STATUS
  );

  const appSbDeploymentData = [
    {
      name: ':small_blue_diamond:  App / Storybook deploy',
      value: `${
        APP_DEPLOYMENT_STATUS
          ? ':white_check_mark:  Deployed.'
          : ':no_entry_sign:  Failed'
      }`,
      inline: false,
    },
  ];
  return appSbDeploymentData;
};
