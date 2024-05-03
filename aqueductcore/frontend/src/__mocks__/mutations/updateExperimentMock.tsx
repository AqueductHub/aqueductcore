import { UPDATE_EXPERIMENT } from "API/graphql/mutations/Experiment/updateExperiment";
import { experimentId, title, description } from "__mocks__/constants";

export const updateExperiment_mock = {
  success: [
    {
      request: {
        query: UPDATE_EXPERIMENT,
        variables: {
          experimentId: experimentId,
          experimentUpdateInput: {
            title: title,
            description: description,
          },
        },
      },
      result: {
        data: {
          updateExperiment: {
            title: title,
            description: description,
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
