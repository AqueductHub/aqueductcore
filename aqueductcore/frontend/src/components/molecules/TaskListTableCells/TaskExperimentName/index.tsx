import { Grid, IconButton, styled, Typography } from "@mui/material";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { MouseEvent } from 'react';

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

function TaskExperimentName({ name, eid }: { name: ExperimentData['title'], eid: ExperimentData['eid'] }) {
    function handleOpenExperimentDetailsPage(e: MouseEvent) {
        e.stopPropagation()
        window.open(`/aqd/experiments/${eid}`)
    }

    return (
        <ExperimentNameChip container alignItems='center'>
            <Grid item>
                <ExperimentName noWrap>
                    {name}
                </ExperimentName>
            </Grid>
            <Grid item>
                <ExperimentEid>{eid}</ExperimentEid>
            </Grid>
            <Grid item>
                <IconButton
                    size="small"
                    onClick={handleOpenExperimentDetailsPage}
                    title="View experiment"
                    sx={{
                        ml: 1,
                        alignItems: "flex-end",
                        fontSize: '1.2rem'
                    }}
                >
                    <OpenInNewIcon sx={{ fontSize: '1.2rem' }} />
                </IconButton>
            </Grid>
        </ExperimentNameChip>
    );
}

export default TaskExperimentName;
