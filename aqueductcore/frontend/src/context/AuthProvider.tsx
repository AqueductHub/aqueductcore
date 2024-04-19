// Inspired by:  https://codesandbox.io/p/sandbox/authentication-with-react-context-d3x0r
import { createContext } from "react";

import { useGetCurrentUserInfo } from "API/graphql/queries/getUserInformation";
import { GET_USER_INFO_TYPE } from "types/globalTypes";

const AuthStateContext = createContext<GET_USER_INFO_TYPE | undefined>(undefined);

function AuthProvider(props: { children: React.ReactNode }) {
    const { data } = useGetCurrentUserInfo()
    return (
        <AuthStateContext.Provider value={data}>
            {props.children}
        </AuthStateContext.Provider>
    );
}

export { AuthProvider, AuthStateContext };
