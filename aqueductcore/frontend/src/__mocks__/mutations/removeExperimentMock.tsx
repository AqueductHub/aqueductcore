import { REMOVE_EXPERIMENT } from "API/graphql/mutations/Experiment/removeExperiment";
import { selected_experiment } from "__mocks__/queries/getExperimentByIdMock";

export const removeExperiment_mock = {
  success: [
    {
      request: {
        query: REMOVE_EXPERIMENT,
        variables: {
            experimentId: selected_experiment.id
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
            experimentId: selected_experiment.id
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
              {"line": 2, "column": 3}
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
