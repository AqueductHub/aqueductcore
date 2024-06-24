import { Box, Chip, Grid, List, ListItem, Typography, styled } from "@mui/material"
import { useGetAllTags } from "API/graphql/queries/experiment/getAllTags";
import toast from "react-hot-toast";
import { useState } from "react";

import { useRemoveTagFromExperiment } from "API/graphql/mutations/experiment/removeTagFromExperiment";
import { useAddTagToExperiment } from "API/graphql/mutations/experiment/addTagToExperiment";
import { dateFormatter, removeFavouriteAndArchivedTag } from "helper/formatters";
import { ExperimentDataType, TagType } from "types/globalTypes";
import { MAX_TAGS_VISIBLE_LENGTH } from "constants/constants";
import { EditTags } from "components/molecules/EditTags";

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

interface experimentDetailsDataProps {
    experimentDetails: ExperimentDataType,
    isEditable: boolean
}

function ExperimentDetailsData({ experimentDetails, isEditable }: experimentDetailsDataProps) {
    const [selectedTags, setSelectedTags] = useState<TagType[]>(
        removeFavouriteAndArchivedTag(experimentDetails.tags)
    );
    const { data: allTags } = useGetAllTags();
    const { mutate: mutateAddTag } = useAddTagToExperiment();
    const { mutate: mutateRemoveTag } = useRemoveTagFromExperiment();

    const handleTagUpdate = (updatedTagsList: TagType[]) => {
        if (selectedTags.length < updatedTagsList.length) {
            mutateAddTag({
                variables: {
                    uuid: experimentDetails.uuid,
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
                    uuid: experimentDetails.uuid,
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
    return (
        <Grid container sx={{ mt: 2 }}>
            <Grid item sx={{ mr: 4 }}>
                <List>
                    <ListItem sx={{ pl: 1, pr: 1 }}>
                        <ExperimentDetailsTitle>Experiment ID: </ExperimentDetailsTitle>
                        <ExperimentDetailsContent>{experimentDetails.eid}</ExperimentDetailsContent>
                    </ListItem>
                    <ListItem sx={{ pl: 1, pr: 1 }}>
                        <ExperimentDetailsTitle>Time Created: </ExperimentDetailsTitle>
                        <ExperimentDetailsContent>{dateFormatter(new Date(experimentDetails.createdAt))}</ExperimentDetailsContent>
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
                                isEditable={isEditable}
                                tags={allTags?.tags?.tagsData || []}
                                selectedOptions={selectedTags}
                                handleTagUpdate={handleTagUpdate}
                            />
                        </Box>
                    </ListItem>
                </List>
            </Grid>
        </Grid>
    )
}
export default ExperimentDetailsData
