module.exports = ({ context, core }) => {

  const { IS_SANITIZED } = process.env;

  try {
    let branch = '';

    if (context.eventName === 'pull_request') {
      branch = process.env.GITHUB_HEAD_REF;
    } else {
      // Other events where we have to extract branch from the ref
      // Ref example: refs/heads/master, refs/tags/X
      const branchParts = context.ref.split('/');
      branch = branchParts.slice(2).join('/');
    }

    core.setOutput('branch_name', branch);
  } catch (error) {
    core.setFailed(error.message);
  }
};
