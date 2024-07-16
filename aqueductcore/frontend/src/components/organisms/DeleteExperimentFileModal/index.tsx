import { Alert, Box, Button, Grid, Modal, Typography, styled } from "@mui/material"
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const DeleteExperimentFileAlert = styled(Alert)`
  padding: ${(props) => `${props.theme.spacing(0.5)}`} ${(props) => `${props.theme.spacing(1)}`} ${(props) => `${props.theme.spacing(0.5)}`} ${(props) => `${props.theme.spacing(1)}`};
`;

const DeleteExperimentFileBox = styled(Box)`
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

interface deleteExperimentFileModalProps {
    open: boolean
    onClose: () => void
    handleDeleteExperimentFile: () => void
}

function DeleteExperimentFileModal({ open, onClose, handleDeleteExperimentFile }: deleteExperimentFileModalProps) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <DeleteExperimentFileBox>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Delete File
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2, mb: 1.5 }}>
                    Are you sure you want to delete this file?
                </Typography>
                <DeleteExperimentFileAlert variant="outlined" severity="warning" icon={<WarningAmberIcon sx={{ mr: -0.5 }} fontSize="small" />} >
                    This action cannot be undone.
                </DeleteExperimentFileAlert>
                <Grid container spacing={2} sx={{ mt: 0.5 }}>
                    <Grid item>
                        <Button variant="contained" color="error" onClick={handleDeleteExperimentFile}>Confirm Deletion</Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="neutral" onClick={onClose}>Cancel</Button>
                    </Grid>
                    <Grid item></Grid>
                </Grid>
            </DeleteExperimentFileBox>
        </Modal>
    )
}

export default DeleteExperimentFileModal;
