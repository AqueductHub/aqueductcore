import { GET_ALL_EXTENSION_NAMES } from "API/graphql/queries/extension/getAllExtensionNames";
import { ExtensionsDataMock } from "__mocks__/ExtensionsDataMock";

const request = {
    query: GET_ALL_EXTENSION_NAMES,
};

export const getAllExtensionNames_mock = {
    success: [
        {
            request,
            result: {
                data: {
                    extensions: ExtensionsDataMock.map(item => ({ name: item.name }))
                },
            },
            maxUsageCount: Number.POSITIVE_INFINITY,
        }
    ]
};
