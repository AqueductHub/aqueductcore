import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CircularProgress,
  Typography,
  Button,
  styled,
  Grid,
  Box,
} from "@mui/material";

import { isUserAbleToDeleteExperiment, isUserAbleToEditExperiment } from "helper/auth/userScope";
import ExperimentDetailsActionButtons from "components/organisms/ExperimentDetailsActionButtons";
import { ExperimentDescriptionUpdate } from "components/molecules/ExperimentDescription";
import { useUpdateExperiment } from "API/graphql/mutations/experiment/updateExperiment";
import TaskListInExperimentDetails from "components/organisms/TaskListInExperimentDetails";
import { useGetCurrentUserInfo } from "API/graphql/queries/user/getUserInformation";
import ExperimentDetailsData from "components/organisms/ExperimentDetailsData";
import { ExperimentTitleUpdate } from "components/molecules/ExperimentTitle";
import { ExperimentDataType } from "types/globalTypes";

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

interface ExperimentDetailsProps {
  experimentDetails: ExperimentDataType;
}

function ExperimentDetails({ experimentDetails }: ExperimentDetailsProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: userInfo } = useGetCurrentUserInfo()

  const isEditable = Boolean(userInfo && isUserAbleToEditExperiment(userInfo.getCurrentUserInfo, experimentDetails.createdBy))
  const isDeletable = Boolean(userInfo && isUserAbleToDeleteExperiment(userInfo.getCurrentUserInfo, experimentDetails.createdBy))

  const { loading: updateExperimentLoading, mutate: mutateExperiment } = useUpdateExperiment();

  const handleExperimentTitleUpdate = (value: string) => {
    mutateExperiment({
      variables: {
        uuid: experimentDetails.uuid,
        experimentUpdateInput: {
          title: value,
        },
      },
    });
  };

  const handleExperimentDescriptionUpdate = (value: string) => {
    mutateExperiment({
      variables: {
        uuid: experimentDetails.uuid,
        experimentUpdateInput: {
          description: value,
        },
      },
    });
  };

  function handleNavigateBack() {
    switch (location.state?.from) {
      //if user have chosen the experiment from the experiment records
      case "/aqd/experiments/favourites":
      case "/aqd/experiments/archived":
      case "/aqd/experiments":
        navigate(-1);
        break;
      //if the link is copied or other states
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
                isEditable={isEditable}
                experimentTitle={experimentDetails.title}
                handleExperimentTitleUpdate={handleExperimentTitleUpdate}
              />
            </Grid>
          </Box>
        </Grid>
        <Grid item>
          <Box display="flex" justifyContent="flex-end" sx={{ mt: { xs: 2, md: 0 } }}>
            {isEditable &&
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
              </Grid>}
            <ExperimentDetailsActionButtons
              isEditable={isEditable}
              isDeletable={isDeletable}
              experimentDetails={experimentDetails}
            />
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item xs={12} xl={6}>
          <ExperimentDetailsData
            experimentDetails={experimentDetails}
            isEditable={isEditable}
          />
          <ExperimentDescriptionUpdate
            isEditable={isEditable}
            experimentDescription={experimentDetails.description ? experimentDetails.description : ""}
            handleExperimentDescriptionUpdate={handleExperimentDescriptionUpdate}
          />
        </Grid>
        <Grid item xs={12} xl={6}>
          <TaskListInExperimentDetails experimentUuid={experimentDetails.uuid} />
        </Grid>
      </Grid>
    </>
  );
}

export default ExperimentDetails;
