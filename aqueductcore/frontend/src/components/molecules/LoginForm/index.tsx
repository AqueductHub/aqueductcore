import { Button, TextField, Typography, styled } from "@mui/material";

const FieldLabel = styled(Typography)`
    font-size: 12px;
    text-align: left;
    margin-bottom: 2px;
`;

const FormInputField = styled(TextField)`
    width: 100%;
    margin-bottom: 15px;
    padding: 0;
`;

function LoginForm() {
    return (
        <>
            <FieldLabel>Username</FieldLabel>
            <FormInputField
                size="small"
                type="text"
                InputProps={{
                    sx: {
                        borderRadius: 0,
                    }
                }}>
            </FormInputField>
            <FieldLabel>Password</FieldLabel>
            <FormInputField
                size="small"
                type="password"
                InputProps={{
                    sx: {
                        borderRadius: 0,
                    }
                }}>
            </FormInputField>
            <Button
                size="small"
                variant="contained"
                sx={{
                    width: "100%",
                    mt: 1,
                    textTransform: "none",
                    fontWeight: "bold",
                    lineHeight: 2.0,
                    boxShadow: "none"
                }}>
                Sign In
            </Button>
        </>
    );
}

export default LoginForm;