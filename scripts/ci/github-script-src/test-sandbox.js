module.exports = async ({ github, context, core }) => {
  console.log('[LOG]:: context - ', context);
  console.log('[LOG]:: env - ', process.env);

  const { GITHUB_SHA } = process.env;
  const [owner, repo] = context.payload.repository.full_name.split('/');

  const tagsListResp = await github.rest.repos.listTags({
    owner,
    repo,
  });

  console.log('GITHUB_SHA - ', GITHUB_SHA);
  console.log('tagsList - ', tagsListResp);

  for (const tagItem of tagsListResp.data) {
    console.log('tagItem - commit - ', tagItem.commit);
  }
};
