import axios, { AxiosResponse } from 'axios';

export const getBasiliskProcessorIndexerStatus = async () => {
  const graphQlEndpoint = process.env.INDEXER_GRAPHQL_URL;

  console.log('INDEXER_GRAPHQL_URL >> - ' ,process.env.INDEXER_GRAPHQL_URL)

  try {
    const procIndStatus: AxiosResponse = await axios({
      url: 'http://localhost:4010/v1/graphql',
      // url: graphQlEndpoint,
      method: 'post',
      data: {
        query: `
          query MyQuery {
            indexerStatus {
              inSync
              lastComplete
              chainHeight
            }
          }
      `,
      },
    });

    /**
     * procIndStatus.data = {
          data: {
            indexerStatus: { inSync: true, lastComplete: 20, chainHeight: 20 }
          }
        }
     */
    console.log('parsedStatus >>> ', procIndStatus.data);

    return procIndStatus.data.data.indexerStatus;
  } catch (e) {
    console.log('>>> e ', e);
    return null;
  }
};
