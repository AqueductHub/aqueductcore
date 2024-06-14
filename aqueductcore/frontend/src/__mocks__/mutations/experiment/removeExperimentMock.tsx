import { REMOVE_EXPERIMENT } from "API/graphql/mutations/experiment/removeExperiment";
import { selected_experiment } from "__mocks__/queries/experiment/getExperimentByIdMock";

export const removeExperiment_mock = {
  success: [
    {
      request: {
        query: REMOVE_EXPERIMENT,
        variables: {
          uuid: selected_experiment.uuid
        },
      },
      result: {
        data: {
          "removeExperiment": null
        }
      },
    },
  ],
  failed: [
    {
      request: {
        query: REMOVE_EXPERIMENT,
        variables: {
          uuid: selected_experiment.uuid
        },
      },
      result: {
        data: {
          "removeExperiment": null
        },
        "errors": [
          {
            "message": "Non-existing experiment with the specified ID for the user.",
            "locations": [
              { "line": 2, "column": 3 }
            ],
            "path": [
              "removeExperiment"
            ]
          }
        ]
      },
      maxUsageCount: Number.POSITIVE_INFINITY,
    },
  ],
};
