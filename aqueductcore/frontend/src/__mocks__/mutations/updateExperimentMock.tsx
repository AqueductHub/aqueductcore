import { UPDATE_EXPERIMENT } from "API/graphql/mutations/Experiment/updateExperiment";
import { ExperimentDataMock } from "__mocks__/ExperimentDataMock";
import { updatedTitle, updatedDescription } from "__mocks__/constants";

export const updateExperiment_mock = {
  success: [
    {
      request: {
        query: UPDATE_EXPERIMENT,
        variables: {
          experimentId: ExperimentDataMock[0].id,
          experimentUpdateInput: {
            title: updatedTitle,
            description: updatedDescription,
          },
        },
      },
      result: {
        data: {
          updateExperiment: {
            title: updatedTitle,
            description: updatedDescription,
            id: ExperimentDataMock[0].id,
            alias: ExperimentDataMock[0].alias,
          },
        },
      },
      maxUsageCount: Number.POSITIVE_INFINITY,
    },
    {
      request: {
        query: UPDATE_EXPERIMENT,
        variables: {
          experimentId: ExperimentDataMock[0].id,
          experimentUpdateInput: {
            description: "",
          },
        },
      },
      result: {
        data: {
          updateExperiment: {
            title: updatedTitle,
            description: updatedDescription,
            id: ExperimentDataMock[0].id,
            alias: ExperimentDataMock[0].alias,
          },
        },
      },
      maxUsageCount: Number.POSITIVE_INFINITY,
    },
    {
      request: {
        query: UPDATE_EXPERIMENT,
        variables: {
          experimentId: ExperimentDataMock[0].id,
          experimentUpdateInput: {
            title: "",
          },
        },
      },
      result: {
        data: {
          updateExperiment: {
            title: updatedTitle,
            description: updatedDescription,
            id: ExperimentDataMock[0].id,
            alias: ExperimentDataMock[0].alias,
          },
        },
      },
      maxUsageCount: Number.POSITIVE_INFINITY,
    },
  ],
};
