import { Grid, styled, Typography } from "@mui/material";

interface JobExperimentNameProps {
    experimentName: string,
    experimentEid: string,
}

const ExperimentNameChip = styled(Grid)`
    margin: 0 ${(props) => props.theme.spacing(1)};
`;

const ExperimentName = styled(Typography)`
    font-size: 0.938rem;
    border: 1px solid #ccc;
    border-right: none;
    line-height: 1.625rem;
    background-color: #FFF;
    padding: 0 ${(props) => props.theme.spacing(1)};
    border-radius: ${(props) => props.theme.spacing(0.5)} 0 0 ${(props) => props.theme.spacing(0.5)};
`;

const ExperimentEid = styled(Typography)`
    font-size: 0.938rem;
    border: 1px solid #ccc;
    line-height: 1.625rem;
    padding: 0 ${(props) => props.theme.spacing(1)};
    border-radius: 0 ${(props) => props.theme.spacing(0.5)} ${(props) => props.theme.spacing(0.5)} 0;
`;

function JobExperimentName({
    experimentName,
    experimentEid
}: JobExperimentNameProps) {
    return (
        <ExperimentNameChip container>
            <Grid item>
                <ExperimentName>{experimentName}</ExperimentName>
            </Grid>
            <Grid item>
                <ExperimentEid>{experimentEid}</ExperimentEid>
            </Grid>
        </ExperimentNameChip>
    );
}

export default JobExperimentName;
