import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import { Button, Grid, CircularProgress } from "@mui/material"
import StarBorderIcon from "@mui/icons-material/StarBorder";
import RestoreIcon from "@mui/icons-material/Restore";
import StarIcon from "@mui/icons-material/Star";
import LinkIcon from "@mui/icons-material/Link";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";

import { BorderedButtonWithIcon } from "components/atoms/sharedStyledComponents/BorderedButtonWithIcon"
import { useRemoveTagFromExperiment } from "API/graphql/mutations/experiment/removeTagFromExperiment";
import { useAddTagToExperiment } from "API/graphql/mutations/experiment/addTagToExperiment";
import { useRemoveExperiment } from "API/graphql/mutations/experiment/removeExperiment";
import ConfirmActionModal from 'components/organisms/ConfirmActionModal';
import { isArchived, isFavourite } from "helper/formatters"
import { ARCHIVED, FAVOURITE } from "constants/constants";
import { ExperimentDataType } from "types/globalTypes";

interface ExperimentDetailsActionButtonsProps {
    isEditable?: boolean,
    isDeletable?: boolean,
    experimentDetails: ExperimentDataType
}

function ExperimentDetailsActionButtons({ isEditable, isDeletable, experimentDetails }: ExperimentDetailsActionButtonsProps) {
    const navigate = useNavigate();
    const { loading: addTagLoading, mutate: mutateAddTag } = useAddTagToExperiment();
    const { loading: removeTagLoading, mutate: mutateRemoveTag } = useRemoveTagFromExperiment();
    const [isDeleteExperimentModalOpen, setDeleteExperimentModalOpen] = useState(false);
    const { loading: removeExperimentLoading, mutate: mutateRemoveExperiment } = useRemoveExperiment();
    const handleOpenDeleteExperimentModal = () => setDeleteExperimentModalOpen(true);
    const handleCloseDeleteExperimentModal = () => setDeleteExperimentModalOpen(false);

    const ToggleAddToFavourites = () => {
        if (isFavourite(experimentDetails.tags)) {
            mutateRemoveTag({
                variables: {
                    uuid: experimentDetails.uuid,
                    tag: FAVOURITE,
                },
                onError() {
                    toast.error("Add To Favourites Failed", {
                        id: "fav_error",
                    });
                },
            });
        } else {
            mutateAddTag({
                variables: {
                    uuid: experimentDetails.uuid,
                    tag: FAVOURITE,
                },
                onError() {
                    toast.error("Remove From Favourites Failed", {
                        id: "unFav_error",
                    });
                },
            });
        }
    };

    const handleArchive = () => {
        mutateAddTag({
            variables: {
                uuid: experimentDetails.uuid,
                tag: ARCHIVED,
            },
            onCompleted() {
                toast((t) => (
                    <span>
                        Moved To Archived
                        <Button
                            variant="outlined"
                            size="small"
                            color="inherit"
                            sx={{ ml: 1 }}
                            onClick={() => {
                                mutateRemoveTag({
                                    variables: {
                                        uuid: experimentDetails.uuid,
                                        tag: ARCHIVED,
                                    },
                                    onCompleted() {
                                        toast.dismiss(t.id);
                                    },
                                });
                            }}
                        >
                            Undo
                        </Button>
                    </span>
                ));
            },
            onError() {
                toast.error("Failed To Archive", {
                    id: "archive_error",
                });
            },
        });
    };

    const handleRestore = () => {
        mutateRemoveTag({
            variables: {
                uuid: experimentDetails.uuid,
                tag: ARCHIVED,
            },
            onError() {
                toast.error("Failed To Restore", {
                    id: "restore_error",
                });
            },
        });
    };

    const handleDeleteExperiment = () => {
        if (!removeExperimentLoading) {
            mutateRemoveExperiment({
                variables: {
                    uuid: experimentDetails.uuid
                },
                onError(error) {
                    toast.error(error.message, {
                        id: "restore_error",
                    });
                },
                onCompleted() {
                    toast.success("Successfully deleted experiment", {
                        id: "restore_error",
                    });
                    navigate("/")
                },
            })
        }
    };

    function handleCopyToClipboard() {
        navigator.clipboard
            .writeText(`${window.location.origin}/aqd/experiments/${experimentDetails.eid}`)
            .then(
                () => {
                    toast.success("Copied to clipboard!", {
                        id: "clipboard",
                    });
                },
                () => {
                    toast.error("Failed! \n Please copy page's URL manually.", {
                        id: "clipboard-failed",
                    });
                }
            );
    }

    return (
        <>
            <Grid item>
                {addTagLoading || removeTagLoading ? (
                    <BorderedButtonWithIcon
                        variant="outlined"
                        size="small"
                        color="neutral"
                        startIcon={<CircularProgress size="1.2rem" />}
                        sx={{ minWidth: 140, ml: 1 }}
                    ></BorderedButtonWithIcon>
                ) :
                    <BorderedButtonWithIcon
                        disabled={!isEditable}
                        variant="outlined"
                        size="small"
                        color="neutral"
                        startIcon={
                            isFavourite(experimentDetails.tags) ? (
                                <StarIcon color="primary" />
                            ) : (
                                <StarBorderIcon />
                            )
                        }
                        sx={{ minWidth: 140, ml: 1 }}
                        onClick={ToggleAddToFavourites}
                        title="toggle-favourite"
                    >
                        Add{isFavourite(experimentDetails.tags) ? "ed" : ""} to favourites
                    </BorderedButtonWithIcon>}
            </Grid>
            <Grid item>
                <BorderedButtonWithIcon
                    variant="outlined"
                    size="small"
                    color="neutral"
                    startIcon={<LinkIcon />}
                    sx={{ ml: 1 }}
                    onClick={handleCopyToClipboard}
                >
                    Copy link
                </BorderedButtonWithIcon>
            </Grid>
            <Grid item>
                {isArchived(experimentDetails.tags) ? (
                    <BorderedButtonWithIcon
                        variant="outlined"
                        size="small"
                        color="neutral"
                        startIcon={<RestoreIcon />}
                        sx={{ ml: 1 }}
                        onClick={handleRestore}
                    >
                        Restore
                    </BorderedButtonWithIcon>
                ) : (
                    <BorderedButtonWithIcon
                        disabled={!isEditable}
                        variant="outlined"
                        size="small"
                        color="neutral"
                        startIcon={<ArchiveOutlinedIcon />}
                        sx={{ ml: 1 }}
                        onClick={handleArchive}
                    >
                        Archive
                    </BorderedButtonWithIcon>
                )}
            </Grid>
            {isArchived(experimentDetails.tags) && <Grid item>
                <BorderedButtonWithIcon
                    disabled={!isDeletable}
                    variant="outlined"
                    size="small"
                    color="error"
                    startIcon={<DeleteForeverOutlinedIcon color="error" />}
                    title="delete-experiment"
                    sx={{ ml: 1 }}
                    onClick={handleOpenDeleteExperimentModal}
                >
                    Delete
                </BorderedButtonWithIcon>
                <ConfirmActionModal
                    title="Delete Experiment"
                    message="Are you sure you want to delete this experiment?"
                    warning="This action cannot be undone."
                    open={isDeleteExperimentModalOpen}
                    onClose={handleCloseDeleteExperimentModal}
                    handleConfirmAction={handleDeleteExperiment}
                />
            </Grid>}
        </>
    )
}
export default ExperimentDetailsActionButtons
