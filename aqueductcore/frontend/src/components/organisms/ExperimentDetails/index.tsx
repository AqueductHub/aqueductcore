import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { useLocation, useNavigate } from "react-router-dom";
import RestoreIcon from "@mui/icons-material/Restore";
import LinkIcon from "@mui/icons-material/Link";
import StarIcon from "@mui/icons-material/Star";
import toast from "react-hot-toast";
import { useState } from "react";
import {
  Box,
  Button,
  Grid,
  Chip,
  List,
  ListItem,
  Typography,
  styled,
  CircularProgress,
} from "@mui/material";

import { useRemoveTagFromExperiment } from "API/graphql/mutations/Experiment/removeTagFromExperiment";
import { useAddTagToExperiment } from "API/graphql/mutations/Experiment/addTagToExperiment";
import { useUpdateExperiment } from "API/graphql/mutations/Experiment/updateExperiment";
import { ExperimentDescriptionUpdate } from "components/molecules/ExperimentDescription";
import { ARCHIVED, FAVOURITE, MAX_TAGS_VISIBLE_LENGTH } from "constants/constants";
import { ExperimentTitleUpdate } from "components/molecules/ExperimentTitle";
import { ExperimentDataType, TagType } from "types/globalTypes";
import { useGetAllTags } from "API/graphql/queries/getAllTags";
import { isArchived, isFavourite, removeFavouriteAndArchivedTag } from "helper/formatters";
import { EditTags } from "components/molecules/EditTags";

const BackButton = styled(Button)`
  border-color: ${(props) => props.theme.palette.neutral.main};
  color: ${(props) =>
    props.theme.palette.mode === "dark"
      ? props.theme.palette.common.white
      : props.theme.palette.common.black};
  text-transform: none;
  margin-right: 0;
  padding-left: ${(props) => `${props.theme.spacing(0.5)}`};
  padding-right: ${(props) => `${props.theme.spacing(0.5)}`};
  min-width: 0;
`;

const SaveChangesIndicator = styled(Typography)`
  color: ${(props) => props.theme.palette.neutral.main};
  text-transform: none;
  font-weight: bold;
  font-size: 0.9rem;
  line-height: ${(props) => `${props.theme.spacing(3.75)}`};
`;

const BorderedButtonWithIcon = styled(Button)`
  border-color: ${(props) => props.theme.palette.neutral.main};
  color: ${(props) =>
    props.theme.palette.mode === "dark"
      ? props.theme.palette.common.white
      : props.theme.palette.common.black};
  text-transform: none;
  padding-left: ${(props) => `${props.theme.spacing}`};
  padding-right: ${(props) => `${props.theme.spacing}`};
`;

const ExperimentDetailsTitle = styled(Typography)`
  font-weight: 400;
  font-size: 0.9rem;
  margin-right: ${(props) => `${props.theme.spacing(1)}`};
  line-height: ${(props) => `${props.theme.spacing(3)}`};
  padding: ${(props) => `${props.theme.spacing(0.75)}`} ${(props) => `${props.theme.spacing(1)}`};
`;

const ExperimentDetailsContent = styled(Typography)`
  font-weight: 500;
  font-weight: bold;
  font-size: 0.9rem;
  line-height: ${(props) => `${props.theme.spacing(3)}`};
`;

interface ExperimentDetailsProps {
  experimentDetails: ExperimentDataType;
}

function ExperimentDetails({ experimentDetails }: ExperimentDetailsProps) {
  const [selectedTags, setSelectedTags] = useState<TagType[]>(
    removeFavouriteAndArchivedTag(experimentDetails.tags)
  );
  const { data: allTags } = useGetAllTags();
  const navigate = useNavigate();
  const location = useLocation();

  const handleTagUpdate = (updatedTagsList: TagType[]) => {
    if (selectedTags.length < updatedTagsList.length) {
      mutateAddTag({
        variables: {
          experimentId: experimentDetails.id,
          tag: Array.from(
            new Set([...updatedTagsList].filter((element) => !new Set(selectedTags).has(element)))
          ).pop(),
        },
        onError() {
          toast.error("Add tag failed", {
            id: "addTag_error",
          });
        },
        onCompleted(inp) {
          setSelectedTags(inp.addTagToExperiment.tags);
        },
      });
    } else {
      mutateRemoveTag({
        variables: {
          experimentId: experimentDetails.id,
          tag: Array.from(
            new Set([...selectedTags].filter((element) => !new Set(updatedTagsList).has(element)))
          ).pop(),
        },
        onError() {
          toast.error("Remove tag failed", {
            id: "removeTag_error",
          });
        },
        onCompleted(inp) {
          setSelectedTags(inp.removeTagFromExperiment.tags);
        },
      });
    }
  };

  const { loading: updateExperimentLoading, mutate: mutateExperiment } = useUpdateExperiment();
  const { loading: addTagLoading, mutate: mutateAddTag } = useAddTagToExperiment();
  const { loading: removeTagLoading, mutate: mutateRemoveTag } = useRemoveTagFromExperiment();

  const handleExperimentTitleUpdate = (value: string) => {
    mutateExperiment({
      variables: {
        experimentId: experimentDetails.id,
        experimentUpdateInput: {
          title: value,
        },
      },
    });
  };

  const handleExperimentDescriptionUpdate = (value: string) => {
    mutateExperiment({
      variables: {
        experimentId: experimentDetails.id,
        experimentUpdateInput: {
          description: value,
        },
      },
    });
  };

  const ToggleAddToFavourites = () => {
    if (isFavourite(experimentDetails.tags)) {
      mutateRemoveTag({
        variables: {
          experimentId: experimentDetails.id,
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
          experimentId: experimentDetails.id,
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
        experimentId: experimentDetails.id,
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
                    experimentId: experimentDetails.id,
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
        experimentId: experimentDetails.id,
        tag: ARCHIVED,
      },
      onError() {
        toast.error("Failed To Restore", {
          id: "restore_error",
        });
      },
    });
  };

  function handleCopyToClipboard() {
    navigator.clipboard
      .writeText(`${window.location.origin}/aqd/experiments/${experimentDetails.alias}`)
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

  function handleNavigateBack() {
    switch (location.state?.from) {
      case "/aqd/experiments/favourites":
      case "/aqd/experiments/archived":
        navigate(-1);
        break;
      default:
        navigate("..", { relative: "path" });
    }
  }

  return (
    <>
      <Grid container>
        <Grid item xs>
          <Box display="flex" justifyContent="flex-start">
            <Grid item>
              <BackButton
                variant="outlined"
                size="small"
                color="neutral"
                sx={{ mr: 1.5 }}
                onClick={handleNavigateBack}
              >
                <ChevronLeftIcon />
              </BackButton>
            </Grid>
            <Grid item xs>
              <ExperimentTitleUpdate
                experimentTitle={experimentDetails.title}
                handleExperimentTitleUpdate={handleExperimentTitleUpdate}
              />
            </Grid>
          </Box>
        </Grid>
        <Grid item>
          <Box display="flex" justifyContent="flex-end" sx={{ mt: { xs: 2, md: 0 } }}>
            <Grid item>
              {!updateExperimentLoading ? (
                <SaveChangesIndicator color="neutral" sx={{ mr: 1 }}>
                  <CloudDownloadOutlinedIcon
                    sx={{ verticalAlign: "middle", fontSize: 16, mr: 0.25 }}
                  />
                  Saved
                </SaveChangesIndicator>
              ) : (
                <CircularProgress size="1.2rem" sx={{ mr: 5 }} />
              )}
            </Grid>
            <Grid item>
              {addTagLoading || removeTagLoading ? (
                <BorderedButtonWithIcon
                  variant="outlined"
                  size="small"
                  color="neutral"
                  startIcon={<CircularProgress size="1.2rem" />}
                  sx={{ minWidth: 140, ml: 1 }}
                ></BorderedButtonWithIcon>
              ) : (
                <BorderedButtonWithIcon
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
                >
                  Add{isFavourite(experimentDetails.tags) ? "ed" : ""} to favourites
                </BorderedButtonWithIcon>
              )}
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
          </Box>
        </Grid>
      </Grid>
      <Grid container sx={{ mt: 2 }}>
        <Grid item sx={{ mr: 4 }}>
          <List>
            <ListItem sx={{ pl: 1, pr: 1 }}>
              <ExperimentDetailsTitle>Experiment ID: </ExperimentDetailsTitle>
              <ExperimentDetailsContent>{experimentDetails.alias}</ExperimentDetailsContent>
            </ListItem>
            <ListItem sx={{ pl: 1, pr: 1 }}>
              <ExperimentDetailsTitle>Time Created: </ExperimentDetailsTitle>
              <ExperimentDetailsContent>{experimentDetails.createdAt}</ExperimentDetailsContent>
            </ListItem>
          </List>
        </Grid>
        <Grid item>
          <List>
            <ListItem sx={{ pl: 1, pr: 1 }}>
              <ExperimentDetailsTitle>Created by: </ExperimentDetailsTitle>
              <ExperimentDetailsContent>{experimentDetails.createdBy}</ExperimentDetailsContent>
            </ListItem>
            <ListItem sx={{ pl: 1, pr: 1, position: "relative" }}>
              <ExperimentDetailsTitle>Tags: </ExperimentDetailsTitle>
              <Box>
                {removeFavouriteAndArchivedTag(selectedTags)
                  .slice(0, MAX_TAGS_VISIBLE_LENGTH)
                  .map((tag) => (
                    <Chip sx={{ mr: 1, borderRadius: 1 }} key={tag} label={tag} />
                  ))}
                {selectedTags.length > MAX_TAGS_VISIBLE_LENGTH && (
                  <Typography sx={{ mr: 1, display: "inline" }}>
                    +{selectedTags.length - MAX_TAGS_VISIBLE_LENGTH}
                  </Typography>
                )}
                <EditTags
                  tags={allTags?.tags?.tagsData || []}
                  selectedOptions={selectedTags}
                  handleTagUpdate={handleTagUpdate}
                />
              </Box>
            </ListItem>
          </List>
        </Grid>
      </Grid>
      <ExperimentDescriptionUpdate
        experimentDescription={experimentDetails.description ? experimentDetails.description : ""}
        handleExperimentDescriptionUpdate={handleExperimentDescriptionUpdate}
      />
    </>
  );
}

export default ExperimentDetails;
