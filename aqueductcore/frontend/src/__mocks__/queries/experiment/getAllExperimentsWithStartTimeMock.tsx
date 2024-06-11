import dayjs from "dayjs";

import { GET_ALL_EXPERIMENTS } from "API/graphql/queries/experiment/getAllExperiments";
import { experimentRecordsRowsPerPageOptions } from "constants/constants";
import { ExperimentsDataMock } from "__mocks__/ExperimentsDataMock";

export const filterByThisStartDate = "23/11/2022";

const request = {
  query: GET_ALL_EXPERIMENTS,
};

export const getAllExperimentsWithStartTime_mock = {
  success: [
    {
      request: {
        ...request,
        variables: {
          offset: 0,
          limit: experimentRecordsRowsPerPageOptions[0],
          filters: {
            startDate: dayjs(filterByThisStartDate, "DD/MM/YYYY").format("YYYY-MM-DD"),
            endDate: null,
            title: "",
            tags: null,
          },
        },
      },
      result: {
        data: {
          experiments: {
            experimentsData: ExperimentsDataMock.filter(
              (item) =>
                dayjs(item.createdAt).isAfter(dayjs(filterByThisStartDate, "DD/MM/YYYY")) ||
                dayjs(item.createdAt).isSame(dayjs(filterByThisStartDate, "DD/MM/YYYY"))
            ).slice(0, experimentRecordsRowsPerPageOptions[0]),
            totalExperimentsCount: ExperimentsDataMock.length,
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
            startDate: dayjs(filterByThisStartDate, "DD/MM/YYYY").format("YYYY-MM-DD"),
            endDate: null,
            title: "",
            tags: null,
          },
        },
      },
      result: {
        data: {
          experiments: {
            experimentsData: ExperimentsDataMock.filter(
              (item) =>
                dayjs(item.createdAt).isAfter(dayjs(filterByThisStartDate, "DD/MM/YYYY")) ||
                dayjs(item.createdAt).isSame(dayjs(filterByThisStartDate, "DD/MM/YYYY"))
            ).slice(
              experimentRecordsRowsPerPageOptions[0],
              experimentRecordsRowsPerPageOptions[0] * 2
            ),
            totalExperimentsCount: ExperimentsDataMock.length,
          },
        },
      },
    },
  ],
};
