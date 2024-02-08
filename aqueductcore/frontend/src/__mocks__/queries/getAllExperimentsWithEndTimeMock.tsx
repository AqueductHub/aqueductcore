import { GET_ALL_EXPERIMENTS } from "API/graphql/queries/getAllExperiments";
import { ExperimentDataMock } from "__mocks__/ExperimentDataMock";
import { experimentRecordsRowsPerPageOptions } from "constants/constants";
import dayjs from "dayjs";

export const filterByThisEndDate = "11/11/2022";

const request = {
  query: GET_ALL_EXPERIMENTS,
};

export const getAllExperimentsWithEndTime_mock = {
  success: [
    {
      request: {
        ...request,
        variables: {
          offset: 0,
          limit: experimentRecordsRowsPerPageOptions[0],
          filters: {
            startDate: null,
            endDate: dayjs(filterByThisEndDate, "DD/MM/YYYY").format("YYYY-MM-DD"),
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
                dayjs(item.createdAt).isBefore(dayjs(filterByThisEndDate, "DD/MM/YYYY")) ||
                dayjs(item.createdAt).isSame(dayjs(filterByThisEndDate, "DD/MM/YYYY"))
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
            endDate: dayjs(filterByThisEndDate, "DD/MM/YYYY").format("YYYY-MM-DD"),
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
                dayjs(item.createdAt).isBefore(dayjs(filterByThisEndDate, "DD/MM/YYYY")) ||
                dayjs(item.createdAt).isSame(dayjs(filterByThisEndDate, "DD/MM/YYYY"))
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
