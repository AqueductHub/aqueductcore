import { GET_ALL_TAGS } from "API/graphql/queries/experiments/getAllTags";
import { tagOptions } from "__mocks__/ExperimentDataMock";

const request = {
  query: GET_ALL_TAGS,
};

export const getAllTags_mock = {
  success: {
    request,
    result: {
      data: {
        tags: {
          tagsData: tagOptions,
        },
      },
    },
    maxUsageCount: Number.POSITIVE_INFINITY,
  },
};
