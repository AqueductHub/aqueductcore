import { GET_CURRENT_USER_INFO } from "API/graphql/queries/user/getUserInformation";

const request = {
    query: GET_CURRENT_USER_INFO,
}

export const getUserInformation_mock = {
    success: [
        {
            request: {
                ...request,
                variables: {}
            },
            result: {
                data: {
                    getCurrentUserInfo: {
                        username: "admin",
                        "scopes": [
                            "experiment::view::own",
                            "experiment::view::all",
                            "experiment::delete::own",
                            "experiment::create::own",
                            "experiment::delete::all",
                            "experiment::edit::all",
                            "experiment::edit::own"
                        ],
                    }
                }
            },
            maxUsageCount: Number.POSITIVE_INFINITY,
        }
    ],
    viewOnlyAccess: [
        {
            request: {
                ...request,
                variables: {}
            },
            result: {
                data: {
                    getCurrentUserInfo: {
                        username: "admin",
                        "scopes": [
                            "experiment::view::own",
                            "experiment::delete::own",
                            "experiment::create::own",
                        ]
                    }
                }
            },
            maxUsageCount: Number.POSITIVE_INFINITY,
        }
    ]
};
