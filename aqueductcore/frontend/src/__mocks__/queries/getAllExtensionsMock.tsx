import { GET_ALL_EXTENSIONS } from "API/graphql/queries/extension/getAllExtensions";
import { ExtensionsDataMock } from "__mocks__/ExtensionsDataMock";

const request = {
    query: GET_ALL_EXTENSIONS,
};

export const getAllExtensions_mock = {
    success: [
        {
            request,
            result: {
                data: {
                    extensions: ExtensionsDataMock
                },
            },
            maxUsageCount: Number.POSITIVE_INFINITY,
        }
    ]
};
