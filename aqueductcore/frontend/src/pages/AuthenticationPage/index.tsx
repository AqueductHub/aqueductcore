import Box from "@mui/material/Box";
import { Typography, styled } from "@mui/material";

import { AqueductLogoHorinzontal } from "components/atoms/AqueductLogoHorizontal";
import LoginForm from "components/molecules/LoginForm";
import { useTheme } from "@mui/material";


const AuthenticationRoot = styled(Box)`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999999;
    background-color: ${(props) => props.theme.palette.background.default};
    text-align: center;
`;

const AuthenticationLogoContainer = styled(Box)`
    margin-top: ${(props) => props.theme.spacing(12)};
    margin-bottom: ${(props) => props.theme.spacing(5)};
`;

const LoginBoxContainer = styled(Box)`
    max-width: 500px;
    min-height: 300px;
    background-color: ${(props) => props.theme.palette.background.paper};
    border-top: 4px solid #06c;
    margin: 0 auto;
    padding: 20px 40px 30px 40px;
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.1);
`;

const LoginFormContainer = styled(Box)`
    margin-top: 20px;
`;

const LoginHeader = styled(Typography)`
    font-size: 24px;
    text-align: center;
    margin-top: ${(props) => `${props.theme.spacing(1)}`};
    margin-bottom: ${(props) => `${props.theme.spacing(1)}`};
    font-weight: 300;
`;

function AuthenticationPage() {
    const theme = useTheme();

    return (
        <>
            <AuthenticationRoot>
                <AuthenticationLogoContainer>
                    <AqueductLogoHorinzontal theme={theme.palette.mode} />
                </AuthenticationLogoContainer>
                <LoginBoxContainer>
                    <LoginHeader>Sign in to your account</LoginHeader>
                    <LoginFormContainer>
                        <LoginForm></LoginForm>
                    </LoginFormContainer>
                </LoginBoxContainer>
            </AuthenticationRoot>
        </>
    );
}

export default AuthenticationPage;
