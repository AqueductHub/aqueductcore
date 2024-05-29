import dayjs from "dayjs";

import { GET_ALL_EXPERIMENTS } from "API/graphql/queries/experiments/getAllExperiments";
import { experimentRecordsRowsPerPageOptions } from "constants/constants";
import { ExperimentDataMock } from "__mocks__/ExperimentDataMock";

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
            experimentsData: ExperimentDataMock.filter(
              (item) =>
                dayjs(item.createdAt).isAfter(dayjs(filterByThisStartDate, "DD/MM/YYYY")) ||
                dayjs(item.createdAt).isSame(dayjs(filterByThisStartDate, "DD/MM/YYYY"))
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
            experimentsData: ExperimentDataMock.filter(
              (item) =>
                dayjs(item.createdAt).isAfter(dayjs(filterByThisStartDate, "DD/MM/YYYY")) ||
                dayjs(item.createdAt).isSame(dayjs(filterByThisStartDate, "DD/MM/YYYY"))
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
