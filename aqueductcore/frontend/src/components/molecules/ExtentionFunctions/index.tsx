import { Box, Grid, Radio, Typography, styled } from "@mui/material"

const ExtentionFunctionBox = styled(Box)`
    width: 100%;
    border: 1px solid #E0E0E0;
    border-radius: ${(props) => props.theme.spacing(0.5)};
    margin-top: ${(props) => props.theme.spacing(2.5)};
`;

const ExtentionDescription = styled(Typography)`
    font-size: 0.8rem;
`;

const FunctionHeader = styled(Grid)`
    padding: 0 ${(props) => props.theme.spacing(1.5)};
    background-color: #efefef;
    border-bottom: 1px solid #E0E0E0;
    border-radius: ${(props) => props.theme.spacing(0.5)} ${(props) => props.theme.spacing(0.5)} 0 0;
    &:after{clear: both;display: block;content: "";}
`;

const FunctionName = styled(Typography)`
    font-size: 0.9rem;
    font-weight: bold;
    line-height: 36px;
    float: left;
`;

const FunctionCheckbox = styled(Box)`
    float: right;
    line-height: 36px;
`;

const FunctionDescription = styled(Typography)`
    font-size: 0.8rem;
    padding: ${(props) => props.theme.spacing(0.75)} ${(props) => props.theme.spacing(1.5)};
    background-color: #FFFFFF;
    border-radius: 0 0 ${(props) => props.theme.spacing(0.5)} ${(props) => props.theme.spacing(0.5)};
`;

function ExtentionFunctions () {
    return (
        <>
            <ExtentionDescription>
                QEC Explorer supports QEC experimentation through offline software-based decoding. Further parameters can be configured in the manifest.yml file.
            </ExtentionDescription>
            <ExtentionFunctionBox>
                <FunctionHeader>
                    <FunctionName>Populate QEC Experiment</FunctionName>
                    <FunctionCheckbox>
                        <Radio
                            checked={true}
                            value="populate qec experiment"
                            name="radio-buttons"
                            sx={{p: 0.5}}
                            inputProps={{ 'aria-label': 'A' }}
                        />
                    </FunctionCheckbox>
                </FunctionHeader>
                <FunctionDescription>
                    Build a new QEC experiment and add it to Aqueduct. Allows you to choose parameters including repetitions, experiment type and code size.
                </FunctionDescription>
            </ExtentionFunctionBox>
            <ExtentionFunctionBox>
                <FunctionHeader>
                    <FunctionName>Simulate Experiment</FunctionName>
                    <FunctionCheckbox>
                        <Radio
                            checked={false}
                            value="simulate experiment"
                            name="radio-buttons"
                            sx={{p: 0.5}}
                            inputProps={{ 'aria-label': 'A' }}
                        />
                    </FunctionCheckbox>
                </FunctionHeader>
                <FunctionDescription>
                    Simulate the execution of an experiment using Qiskit as a backend.
                </FunctionDescription>
            </ExtentionFunctionBox>
            <ExtentionFunctionBox>
                <FunctionHeader>
                    <FunctionName>Decode Experimental Results</FunctionName>
                    <FunctionCheckbox>
                        <Radio
                            checked={false}
                            value="decode experimental results"
                            name="radio-buttons"
                            sx={{p: 0.5}}
                            inputProps={{ 'aria-label': 'A' }}
                        />
                    </FunctionCheckbox>
                </FunctionHeader>
                <FunctionDescription>
                    Use Riverlane decoders to decode your experimental data on the cloud, after results have been gathered from a hardware run.
                </FunctionDescription>
            </ExtentionFunctionBox>
        </>
    );
}

export default ExtentionFunctions;
