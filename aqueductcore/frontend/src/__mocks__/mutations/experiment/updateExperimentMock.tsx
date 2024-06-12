import { UPDATE_EXPERIMENT } from "API/graphql/mutations/experiment/updateExperiment";
import { updatedTitle, updatedDescription } from "__mocks__/constants";
import { ExperimentsDataMock } from "__mocks__/ExperimentsDataMock";

export const updateExperiment_mock = {
  success: [
    {
      request: {
        query: UPDATE_EXPERIMENT,
        variables: {
          experimentId: ExperimentsDataMock[0].id,
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
            id: ExperimentsDataMock[0].id,
            alias: ExperimentsDataMock[0].alias,
          },
        },
      },
      maxUsageCount: Number.POSITIVE_INFINITY,
    },
    {
      request: {
        query: UPDATE_EXPERIMENT,
        variables: {
          experimentId: ExperimentsDataMock[0].id,
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
            id: ExperimentsDataMock[0].id,
            alias: ExperimentsDataMock[0].alias,
          },
        },
      },
      maxUsageCount: Number.POSITIVE_INFINITY,
    },
    {
      request: {
        query: UPDATE_EXPERIMENT,
        variables: {
          experimentId: ExperimentsDataMock[0].id,
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
            id: ExperimentsDataMock[0].id,
            alias: ExperimentsDataMock[0].alias,
          },
        },
      },
      maxUsageCount: Number.POSITIVE_INFINITY,
    },
  ],
};
