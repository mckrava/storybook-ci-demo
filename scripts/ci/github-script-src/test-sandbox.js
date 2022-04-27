module.exports = async ({ github, context, core }) => {
  console.log('[LOG]:: context - ', context);

  const { GITHUB_SHA } = process.env;
  const [owner, repo] = context.payload.repository.full_name.split('/');

  const tagsList = await github.rest.repos.listTags({
    owner,
    repo,
  });

  console.log('GITHUB_SHA - ', GITHUB_SHA);
  console.log('tagsList - ', tagsList);

  for (const tagItem of tagsList) {
    console.log('tagItem - commit - ', tagItem.commit);
  }
};
