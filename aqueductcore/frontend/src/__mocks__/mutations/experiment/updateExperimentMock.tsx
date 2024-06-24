import { UPDATE_EXPERIMENT } from "API/graphql/mutations/experiment/updateExperiment";
import { updatedTitle, updatedDescription } from "__mocks__/constants";
import { ExperimentsDataMock } from "__mocks__/ExperimentsDataMock";

export const updateExperiment_mock = {
  success: [
    {
      request: {
        query: UPDATE_EXPERIMENT,
        variables: {
          uuid: ExperimentsDataMock[0].uuid,
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
            uuid: ExperimentsDataMock[0].uuid,
            eid: ExperimentsDataMock[0].eid,
          },
        },
      },
      maxUsageCount: Number.POSITIVE_INFINITY,
    },
    {
      request: {
        query: UPDATE_EXPERIMENT,
        variables: {
          uuid: ExperimentsDataMock[0].uuid,
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
            uuid: ExperimentsDataMock[0].uuid,
            eid: ExperimentsDataMock[0].eid,
          },
        },
      },
      maxUsageCount: Number.POSITIVE_INFINITY,
    },
    {
      request: {
        query: UPDATE_EXPERIMENT,
        variables: {
          uuid: ExperimentsDataMock[0].uuid,
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
            uuid: ExperimentsDataMock[0].uuid,
            eid: ExperimentsDataMock[0].eid,
          },
        },
      },
      maxUsageCount: Number.POSITIVE_INFINITY,
    },
  ],
};
