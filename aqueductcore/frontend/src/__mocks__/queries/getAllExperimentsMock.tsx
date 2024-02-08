import { GET_ALL_EXPERIMENTS } from "API/graphql/queries/getAllExperiments";
import { ExperimentDataMock } from "__mocks__/ExperimentDataMock";
import { experimentRecordsRowsPerPageOptions } from "constants/constants";
import { isArchived } from "helper/formatters";

const request = {
  query: GET_ALL_EXPERIMENTS,
};

export const getAllExperiments_mock = {
  success: [
    {
      request: {
        ...request,
        variables: {
          offset: 0,
          limit: experimentRecordsRowsPerPageOptions[0],
          filters: {
            startDate: null,
            endDate: null,
            title: "",
            tags: null,
            shouldIncludeTags: null,
          },
        },
      },
      result: {
        data: {
          experiments: {
            experimentsData: ExperimentDataMock.filter(experiment => !isArchived(experiment.tags)).slice(0, experimentRecordsRowsPerPageOptions[0]),
            totalExperimentsCount: ExperimentDataMock.filter(experiment => !isArchived(experiment.tags)).length,
          },
        },
      },
      maxUsageCount: Number.POSITIVE_INFINITY,
    },
    {
      request: {
        ...request,
        variables: {
          offset: experimentRecordsRowsPerPageOptions[0],
          limit: experimentRecordsRowsPerPageOptions[0],
          filters: {
            startDate: null,
            endDate: null,
            title: "",
            tags: null,
            shouldIncludeTags: null,
          },
        },
      },
      result: {
        data: {
          experiments: {
            experimentsData: ExperimentDataMock.filter(experiment => !isArchived(experiment.tags)).slice(
              experimentRecordsRowsPerPageOptions[0],
              experimentRecordsRowsPerPageOptions[0] * 2
            ),
            totalExperimentsCount: ExperimentDataMock.filter(experiment => !isArchived(experiment.tags)).length,
          },
        },
      },
      maxUsageCount: Number.POSITIVE_INFINITY,
    },
  ],
};
