import { Box, Modal, styled } from "@mui/material"


interface ExtensionModalProps {
    isOpen: boolean
    handleClose: () => void
    selectedExtension?: string
}

const ModalContainer = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  background-color: ${(props) => props.theme.palette.background.default};
  box-shadow: 24;
  padding: ${(props) => props.theme.spacing(4)};
`;

function ExtensionModal({ isOpen, handleClose, selectedExtension }: ExtensionModalProps) {

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <ModalContainer>
                Extension: {selectedExtension}
            </ModalContainer>
        </Modal>
    )
}

export default ExtensionModal
