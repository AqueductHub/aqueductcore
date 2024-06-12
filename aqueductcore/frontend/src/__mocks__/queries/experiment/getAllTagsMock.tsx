import { GET_ALL_TAGS } from "API/graphql/queries/experiment/getAllTags";
import { tagOptions } from "__mocks__/ExperimentsDataMock";

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
