import { Alert, Box, Button, Grid, Modal, Typography, styled } from "@mui/material"
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

interface confirmationModalProps {
    title: string;
    message: string;
    warning?: string;
    open: boolean;
    onClose: () => void;
    handleConfirmAction: () => void;
}

const ConfirmActionAlert = styled(Alert)`
  padding: ${(props) => `${props.theme.spacing(0.5)}`} ${(props) => `${props.theme.spacing(1)}`} ${(props) => `${props.theme.spacing(0.5)}`} ${(props) => `${props.theme.spacing(1)}`};
`;

const ConfirmationModal = styled(Box)`
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

function ConfirmActionModal({ title, message, warning, open, onClose, handleConfirmAction }: confirmationModalProps) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <ConfirmationModal>
                <Typography id="modal-modal-title" variant="h6" component="h2">{title}</Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2, mb: 1.5 }}>{message}</Typography>
                {warning && <ConfirmActionAlert variant="outlined" severity="warning" icon={<WarningAmberIcon sx={{ mr: -0.5 }} fontSize="small" />} >
                    {warning}
                </ConfirmActionAlert>}
                <Grid container spacing={2} sx={{ mt: 0.5 }}>
                    <Grid item>
                        <Button variant="contained" color="error" title="confirmAction" onClick={handleConfirmAction}>Confirm Deletion</Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="neutral" title="closeModal" onClick={onClose}>Cancel</Button>
                    </Grid>
                    <Grid item></Grid>
                </Grid>
            </ConfirmationModal>
        </Modal>
    )
}

export default ConfirmActionModal;
