import { Box, FormControl, FormControlLabel, Grid, Radio, RadioGroup, Typography, styled } from "@mui/material"

import { ExtensionFunctionType, ExtensionType } from "types/globalTypes";

const ExtentionFunctionBox = styled(Box)`
    width: 100%;
    border: 1px solid ${({ theme }) => theme.palette.grey[300]};
    border-radius: ${(props) => props.theme.spacing(0.5)};
`;

const ExtentionDescription = styled(Typography)`
    font-size: 0.8rem;
`;

const HiddenRadio = styled(Radio)`
    display: none;
`;

const FunctionHeader = styled(Grid)`
    padding: 0 ${(props) => props.theme.spacing(1.5)};
    background-color: ${({ theme }) => theme.palette.grey[500]};
    border-bottom: 1px solid ${({ theme }) => theme.palette.grey[300]};
    border-radius: ${(props) => props.theme.spacing(0.5)} ${(props) => props.theme.spacing(0.5)} 0 0;
    &:after{clear: both;display: block;content: "";}
`;

const FunctionsFormControl = styled(FormControl)`
    width: 100%;
    .MuiFormControlLabel-root {
        width: 100%;
        display: block;
        margin-right: 0;
        margin-left: 0;
    }
`;

const FunctionName = styled(Typography)`
    font-size: 0.9rem;
    font-weight: bold;
    line-height: 2.37rem;
    float: left;
`;

const FunctionCheckbox = styled(Box)`
    float: right;
    line-height: 2.37rem;
`;

const FunctionDescription = styled(Typography)`
    font-size: 0.8rem;
    padding: ${(props) => props.theme.spacing(0.75)} ${(props) => props.theme.spacing(1.5)};
    background-color: ${(props) => props.theme.palette.common.white};
    border-radius: 0 0 ${(props) => props.theme.spacing(0.5)} ${(props) => props.theme.spacing(0.5)};
`;

interface ExtentionFunctionsProps {
    extension?: ExtensionType;
    selectedFunction?: ExtensionFunctionType;
    updateSelectedFunction: (value: string) => void;
}

function ExtentionFunctions({
    extension,
    selectedFunction,
    updateSelectedFunction
}: ExtentionFunctionsProps) {

    const handleSelectedFunctionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateSelectedFunction(event.target.value);
    };

    return (
        <>
            <ExtentionDescription>{extension?.description}</ExtentionDescription>
            <FunctionsFormControl>
                <RadioGroup
                    defaultValue={extension?.functions[0].name}
                    onChange={handleSelectedFunctionChange}
                >
                    {extension?.functions.map(functionInfo => (
                        <FormControlLabel sx={{ mt: 2.5 }} key={functionInfo.name} value={functionInfo.name} control={<HiddenRadio />} label={
                            <ExtentionFunctionBox>
                                <FunctionHeader style={{ backgroundColor: selectedFunction?.name == functionInfo.name ? "#3dcbda" : "transparent" }}>
                                    <FunctionName>{functionInfo.name}</FunctionName>
                                    <FunctionCheckbox>
                                        <Radio
                                            size="small"
                                            color="default"
                                            checked={selectedFunction?.name == functionInfo.name}
                                        />
                                    </FunctionCheckbox>
                                </FunctionHeader>
                                <FunctionDescription>
                                    {functionInfo.description}
                                </FunctionDescription>
                            </ExtentionFunctionBox>
                        } />
                    ))}
                </RadioGroup>
            </FunctionsFormControl>
        </>
    );
}

export default ExtentionFunctions;
