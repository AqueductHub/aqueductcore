import { GET_ALL_EXTENSIONS_NAME } from "API/graphql/queries/getAllExtensions";
import { extensions } from "../ExtensionsDataMock";

const request = {
    query: GET_ALL_EXTENSIONS_NAME,
};

export const getAllExtensionNames_mock = {
    success: [
        {
            request,
            result: {
                data: {
                    plugins: extensions.map(item => ({ name: item.name }))
                },
            },
        }
    ]
};
