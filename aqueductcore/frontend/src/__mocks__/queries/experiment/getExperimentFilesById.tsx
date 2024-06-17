import { GET_EXPERIMENT_FILES_BY_ID } from "API/graphql/queries/experiment/getExperimentFilesById";
import { ExperimentsDataMock, sample_eid } from "__mocks__/ExperimentsDataMock";

const request = {
  query: GET_EXPERIMENT_FILES_BY_ID,
};

export const getExperimentFiles_mock = {
  success: {
    request: {
      ...request,
      variables: {
        uuid: sample_eid,
      },
    },
    result: {
      data: {
        experiment: {
          files: ExperimentsDataMock.filter((experiment) => experiment.eid === sample_eid)[0].files,
        },
      },
    },
    maxUsageCount: Number.POSITIVE_INFINITY,
  },
};
