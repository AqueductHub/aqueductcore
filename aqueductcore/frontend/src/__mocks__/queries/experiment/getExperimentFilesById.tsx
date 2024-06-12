import { GET_EXPERIMENT_FILES_BY_ID } from "API/graphql/queries/experiment/getExperimentFilesById";
import { ExperimentsDataMock, alias } from "__mocks__/ExperimentsDataMock";

const request = {
  query: GET_EXPERIMENT_FILES_BY_ID,
};

export const getExperimentFiles_mock = {
  success: {
    request: {
      ...request,
      variables: {
        experimentId: alias,
      },
    },
    result: {
      data: {
        experiment: {
          files: ExperimentsDataMock.filter((experiment) => experiment.alias === alias)[0].files,
        },
      },
    },
    maxUsageCount: Number.POSITIVE_INFINITY,
  },
};
