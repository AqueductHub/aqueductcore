import { ExtensionsDataMock } from "__mocks__/ExtensionsDataMock";
import { GET_ALL_EXTENSION_NAMES } from "API/graphql/queries/getAllExtensionNames";

const request = {
    query: GET_ALL_EXTENSION_NAMES,
};

export const getAllExtensionNames_mock = {
    success: [
        {
            request,
            result: {
                data: {
                    plugins: ExtensionsDataMock.map(item => ({ name: item.name }))
                },
            },
        }
    ]
};
