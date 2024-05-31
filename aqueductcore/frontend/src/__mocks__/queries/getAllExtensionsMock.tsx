import { GET_ALL_EXTENSIONS_NAME } from "API/graphql/queries/extension/getAllExtensions";
import { ExtensionsDataMock } from "__mocks__/ExtensionsDataMock";

const request = {
    query: GET_ALL_EXTENSIONS_NAME,
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
