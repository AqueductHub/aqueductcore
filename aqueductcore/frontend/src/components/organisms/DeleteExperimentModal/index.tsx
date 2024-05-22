import { Alert, Box, Button, Grid, Modal, Typography, styled } from "@mui/material"
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const DeleteExperimentAlert = styled(Alert)`
  padding: ${(props) => `${props.theme.spacing(0.5)}`} ${(props) => `${props.theme.spacing(1)}`} ${(props) => `${props.theme.spacing(0.5)}`} ${(props) => `${props.theme.spacing(1)}`};
`;

const DeleteExperimentBox = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  background-color: ${(props) =>
        props.theme.palette.mode === "dark"
            ? props.theme.palette.common.black
            : props.theme.palette.common.white};
  box-shadow: 24;
  padding: ${(props) => props.theme.spacing(4)};
`;

interface deleteExperimentModalProps {
    open: boolean
    onClose: () => void
    handleDeleteExperiment: () => void
}

function DeleteExperimentModal({ open, onClose, handleDeleteExperiment }: deleteExperimentModalProps) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <DeleteExperimentBox>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Delete Experiment
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2, mb: 1.5 }}>
                    Are you sure you want to delete this experiment?
                </Typography>
                <DeleteExperimentAlert variant="outlined" severity="warning" icon={<WarningAmberIcon sx={{ mr: -0.5 }} fontSize="small" />} >
                    This action cannot be undone.
                </DeleteExperimentAlert>
                <Grid container spacing={2} sx={{ mt: 0.5 }}>
                    <Grid item>
                        <Button variant="contained" color="error" onClick={handleDeleteExperiment}>Confirm Deletion</Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="neutral" onClick={onClose}>Cancel</Button>
                    </Grid>
                    <Grid item></Grid>
                </Grid>
            </DeleteExperimentBox>
        </Modal>
    )
}

export default DeleteExperimentModal
