import { GET_EXPERIMENT_FILES_BY_ID } from "API/graphql/queries/experiment/getExperimentFilesById";
import { ExperimentsDataMock, eid } from "__mocks__/ExperimentsDataMock";

const request = {
  query: GET_EXPERIMENT_FILES_BY_ID,
};
//TODO: uuid: eid?
export const getExperimentFiles_mock = {
  success: {
    request: {
      ...request,
      variables: {
        uuid: eid,
      },
    },
    result: {
      data: {
        experiment: {
          files: ExperimentsDataMock.filter((experiment) => experiment.eid === eid)[0].files,
        },
      },
    },
    maxUsageCount: Number.POSITIVE_INFINITY,
  },
};
