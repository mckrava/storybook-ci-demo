module.exports = ({ APP_BUILD_STATUS }) => {
  const appSbBuildData = {
    title: 'App / Storybook build',
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
