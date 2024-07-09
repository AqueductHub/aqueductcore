export const ApolloOptions = {
    typePolicies: {
        ExperimentData: {
            keyFields: ["uuid"],
        },
        ExperimentFile: {
            keyFields: ["name"],
        }
    },
};
