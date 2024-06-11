import { GET_ALL_EXPERIMENTS } from "API/graphql/queries/experiment/getAllExperiments";
import { experimentRecordsRowsPerPageOptions } from "constants/constants";
import { ExperimentsDataMock } from "__mocks__/ExperimentsDataMock";
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
          }
        },
      },
      result: {
        data: {
          experiments: {
            experimentsData: ExperimentsDataMock.filter(experiment => !isArchived(experiment.tags)).slice(0, experimentRecordsRowsPerPageOptions[0]),
            totalExperimentsCount: ExperimentsDataMock.filter(experiment => !isArchived(experiment.tags)).length,
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
            experimentsData: ExperimentsDataMock.filter(experiment => !isArchived(experiment.tags)).slice(
              experimentRecordsRowsPerPageOptions[0],
              experimentRecordsRowsPerPageOptions[0] * 2
            ),
            totalExperimentsCount: ExperimentsDataMock.filter(experiment => !isArchived(experiment.tags)).length,
          },
        },
      },
      maxUsageCount: Number.POSITIVE_INFINITY,
    },
  ],
};
