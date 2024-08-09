import { Grid, styled, Typography } from "@mui/material";

const ExperimentNameChip = styled(Grid)`
    margin: 0 ${(props) => props.theme.spacing(1)};
`;

const ExperimentName = styled(Typography)`
    font-size: 0.938rem;
    border: 1px solid #ccc;
    line-height: 1.375rem;
    background-color: #FFF;
    padding: 0 ${(props) => props.theme.spacing(2)};
`;

const ExperimentEid = styled(Typography)`
    font-size: 0.938rem;
    border: 1px solid #ccc;
    line-height: 1.375rem;
    padding: 0 ${(props) => props.theme.spacing(2)};
`;

function JobExperimentName() {
    return (
        <ExperimentNameChip container>
            <Grid item>
                <ExperimentName>2 Qubit gate first...</ExperimentName>
            </Grid>
            <Grid item>
                <ExperimentEid>20240508-1</ExperimentEid>
            </Grid>
        </ExperimentNameChip>
    );
}

export default JobExperimentName;
