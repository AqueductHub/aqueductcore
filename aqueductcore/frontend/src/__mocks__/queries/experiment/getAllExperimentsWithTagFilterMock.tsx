import { GET_ALL_EXPERIMENTS } from "API/graphql/queries/experiment/getAllExperiments";
import { ExperimentsDataMock, tagOptions } from "__mocks__/ExperimentsDataMock";
import { experimentRecordsRowsPerPageOptions } from "constants/constants";

export const filterByThisTag = tagOptions[0];

const request = {
  query: GET_ALL_EXPERIMENTS,
};

export const getAllExperimentsWithTagFilter_mock = {
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
            tags: [filterByThisTag],
            shouldIncludeTags: null
          },
        },
      },
      result: {
        data: {
          experiments: {
            experimentsData: ExperimentsDataMock.filter((item) =>
              item.tags.includes(filterByThisTag)
            ).slice(0, experimentRecordsRowsPerPageOptions[0]),
            totalExperimentsCount: ExperimentsDataMock.length,
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
            tags: [filterByThisTag],
            shouldIncludeTags: null
          },
        },
      },
      result: {
        data: {
          experiments: {
            experimentsData: ExperimentsDataMock.filter((item) =>
              item.tags.includes(filterByThisTag)
            ).slice(
              experimentRecordsRowsPerPageOptions[0],
              experimentRecordsRowsPerPageOptions[0] * 2
            ),
            totalExperimentsCount: ExperimentsDataMock.length,
          },
        },
      },
      maxUsageCount: Number.POSITIVE_INFINITY,
    },
  ],
};
