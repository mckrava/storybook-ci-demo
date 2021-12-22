import axios, { AxiosResponse } from 'axios';

const graphQlEndpoint = process.env.INDEXER_GRAPHQL_URL;

export const getBasiliskProcessorIndexerStatus = async () => {
  try {
    const procIndStatus: AxiosResponse = await axios({
      url: graphQlEndpoint,
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
