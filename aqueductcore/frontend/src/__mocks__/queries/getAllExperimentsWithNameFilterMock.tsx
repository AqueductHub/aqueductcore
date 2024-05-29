import { GET_ALL_EXPERIMENTS } from "API/graphql/queries/experiments/getAllExperiments";
import { experimentRecordsRowsPerPageOptions } from "constants/constants";
import { ExperimentDataMock } from "__mocks__/ExperimentDataMock";

export const filterByThisTitle = "EXP_rabi";

const request = {
  query: GET_ALL_EXPERIMENTS,
};

export const getAllExperimentsWithNameFilter_mock = {
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
            title: filterByThisTitle,
            tags: null,
            shouldIncludeTags: null
          },
        },
      },
      result: {
        data: {
          experiments: {
            experimentsData: ExperimentDataMock.filter((item) =>
              item.title.includes(filterByThisTitle)
            ).slice(0, experimentRecordsRowsPerPageOptions[0]),
            totalExperimentsCount: ExperimentDataMock.length,
          },
        },
      },
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
            title: filterByThisTitle,
            tags: null,
            shouldIncludeTags: null
          },
        },
      },
      result: {
        data: {
          experiments: {
            experimentsData: ExperimentDataMock.filter((item) =>
              item.title.includes(filterByThisTitle)
            ).slice(
              experimentRecordsRowsPerPageOptions[0],
              experimentRecordsRowsPerPageOptions[0] * 2
            ),
            totalExperimentsCount: ExperimentDataMock.length,
          },
        },
      },
    },
  ],
};
