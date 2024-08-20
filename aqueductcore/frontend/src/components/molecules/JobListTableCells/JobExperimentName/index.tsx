import { Grid, styled, Typography } from "@mui/material";
import { ExperimentData } from "types/graphql/__GENERATED__/graphql";

const ExperimentNameChip = styled(Grid)`
    margin: 0 ${(props) => props.theme.spacing(1)};
`;

const ExperimentName = styled(Typography)`
    font-size: 0.938rem;
    border: 1px solid #ccc;
    line-height: 1.375rem;
    background-color: #FFF;
    color: ${({ theme }) => theme.palette.grey[800]};
    padding: 0 ${(props) => props.theme.spacing(2)};
`;

const ExperimentEid = styled(Typography)`
    font-size: 0.938rem;
    border: 1px solid #ccc;
    line-height: 1.375rem;
    padding: 0 ${(props) => props.theme.spacing(2)};
`;

const ExperimentNameSpan = styled(Typography)`
    max-width: 280px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;

function JobExperimentName({ name, eid }: { name: ExperimentData['title'], eid: ExperimentData['eid'] }) {
    return (
        <ExperimentNameChip container>
            <Grid item>
                <ExperimentName noWrap>
                    <ExperimentNameSpan>{name}</ExperimentNameSpan>
                </ExperimentName>
            </Grid>
            <Grid item>
                <ExperimentEid>{eid}</ExperimentEid>
            </Grid>
        </ExperimentNameChip>
    );
}

export default JobExperimentName;
