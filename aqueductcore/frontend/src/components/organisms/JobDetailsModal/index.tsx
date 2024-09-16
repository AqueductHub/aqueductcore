import { Box, Button, Grid, List, ListItem, Modal, Tab, Tabs, Typography, styled } from "@mui/material"
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import { ReactNode, useState } from "react";

import JobExtensionStatus from "components/molecules/JobListTableCells/JobExtensionStatus";
import { useCancelTask } from "API/graphql/mutations/extension/cancelTask";
import ActionParameters from "components/molecules/ActionParameters";
import { useGetTask } from "API/graphql/queries/tasks/getTask";
import LogViewer from "components/molecules/LogViewer";
import { dateFormatter } from "helper/formatters";
import { TaskType } from "types/globalTypes";
import { Loading } from "components/atoms/Loading";
import { TaskStatus } from "types/graphql/__GENERATED__/graphql";

interface JobDetailsModalProps {
    isOpen: boolean
    handleClose: () => void
    taskId: TaskType['taskId']
}

export type settingItemType = {
    id: string
    title: string
    component: ReactNode
}

const ModalContainer = styled(Box)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 1080px;
    box-shadow: 24;
    border-radius: ${(props) => props.theme.spacing(1)};
    background-color: ${(props) =>
        props.theme.palette.mode === "dark"
            ? props.theme.palette.background.card
            : props.theme.palette.common.white};
`;

const ExtensionName = styled(Typography)`
    font-size: 1.1rem;
    display: inline;
    font-weight: bold;
    margin-left: ${(props) => props.theme.spacing(1.5)};
`;

const CloseModalIcon = styled(CloseIcon)`
    cursor: pointer;
    vertical-align: middle;
`;

const ActionName = styled(Typography)`
    font-size: 1.1rem;
    display: inline;
`;

const HeaderRightIcon = styled(ChevronRightIcon)`
    font-size: 3.25rem;
    vertical-align: top;
    padding: ${(props) => props.theme.spacing(1.25)};
    margin: 0 ${(props) => props.theme.spacing(-0.5)};
`;

const CancelTaskButton = styled(Button)`
    background-color: transparent;
    margin-right: ${(props) => props.theme.spacing(2)};
`;

const ExperimentDetailsTitle = styled(Typography)`
  font-weight: 400;
  font-size: 0.9rem;
  margin-right: ${(props) => `${props.theme.spacing(1)}`};
  line-height: ${(props) => `${props.theme.spacing(1)}`};
  padding: ${(props) => `${props.theme.spacing(0.75)}`} ${(props) => `${props.theme.spacing(1)}`};
`;

const ExperimentDetailsContent = styled(Typography)`
  font-weight: 500;
  font-weight: bold;
  font-size: 0.9rem;
  line-height: ${(props) => `${props.theme.spacing(1)}`};
`;

const ModalHeader = styled(Grid)`
    background-color: ${(props) =>
        props.theme.palette.mode === "dark"
            ? props.theme.palette.common.black
            : props.theme.palette.grey[300]};
    border-radius: ${(props) => props.theme.spacing(1)} ${(props) => props.theme.spacing(1)} 0 0;
    border-bottom: 1px solid ${({ theme }) => theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[400]};
    padding: 0 ${(props) => props.theme.spacing(2)};
`;

const ModalMain = styled(Box)`
    height: 600px;
    background-color: ${({ theme }) => theme.palette.mode === "dark" ? theme.palette.grey[900] : theme.palette.grey[200]};
`;

const JobDetailsBox = styled(Box)`
    width: calc(100% - ${(props) => props.theme.spacing(8)});
    margin-left: ${(props) => props.theme.spacing(4)};
    margin-top: ${(props) => props.theme.spacing(2)};
    background-color: ${(props) =>
        props.theme.palette.mode === "dark"
            ? props.theme.palette.background.card
            : props.theme.palette.common.white};
    border-radius: ${(props) => props.theme.spacing(1)};
    height: 400px;
    overflow: auto;
`;

const TabsBox = styled(Box)`
    width: calc(100% - ${(props) => props.theme.spacing(8)});
    margin-left: ${(props) => props.theme.spacing(4)};
`;

const Container = styled("div")`
    border-radius: 5px;
`;

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && <Box>{children}</Box>}
        </div>
    );
}

function JobDetailsModal({ isOpen, handleClose, taskId }: JobDetailsModalProps) {
    const [value, setValue] = useState(0);
    const { mutate: mutateCancelTask } = useCancelTask();

    const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const { loading, data } = useGetTask({
        variables: {
            taskId
        },
        skip: !taskId
    })

    const handleCancelTask = () => {
        mutateCancelTask({
            variables: {
                taskId: taskId
            }
        });
    }
    const task = data?.task

    if (loading) return <Loading isGlobal />
    if (!task) return <></>

    const jobRunLog = [
        {
            label: "experiment",
            value: task.experiment.title
        },
        {
            label: "extensionName",
            value: task.extensionName
        },
        {
            label: "ActionName",
            value: task.actionName
        },
        {
            label: "receivedAt",
            value: task.receivedAt
        },
        {
            label: "taskId",
            value: task.taskId
        },
        {
            label: "taskStatus",
            value: task.taskStatus
        },
        {
            label: "resultCode",
            value: task.resultCode
        },
        {
            label: "stdErr",
            value: task.stdErr
        },
        {
            label: "stdOut",
            value: task.stdOut
        }
    ]
    const parameters = task.parameters.map(param => param.key)
    const inputParams = task.parameters.map(param => ({ name: param.key.name, value: param.value }))
    const taskDetailsItems = [
        {
            id: "parameters",
            title: "Parameters",
            component: <ActionParameters
                readonly
                parameters={parameters}
                inputParams={inputParams}
            />
        },
        {
            id: "log",
            title: "Log",
            component: <LogViewer
                log={jobRunLog}
            />
        }
    ]

    return (
        <Modal open={isOpen} onClose={handleClose}>
            <ModalContainer>
                <ModalHeader
                    container
                    sx={{
                        justifyContent: "space-between"
                    }}
                >
                    <Grid item sx={{ display: "flex", alignItems: "center" }}>
                        <JobExtensionStatus status={task.taskStatus} />
                        <ExtensionName>{task.extensionName}</ExtensionName>
                        <HeaderRightIcon />
                        <ActionName>{task.actionName}</ActionName>
                    </Grid>
                    <Grid item sx={{ display: "flex", alignItems: "center" }}>
                        <CloseModalIcon onClick={handleClose} />
                    </Grid>
                </ModalHeader>
                <ModalMain sx={{ pt: 2, pl: 2, pr: 2 }}>
                    <Grid justifyContent="space-between" container>
                        <Grid item>
                            <List>
                                <ListItem>
                                    <ExperimentDetailsTitle>Created By: </ExperimentDetailsTitle>
                                    <ExperimentDetailsContent>admin</ExperimentDetailsContent>
                                </ListItem>
                                <ListItem>
                                    <ExperimentDetailsTitle>Time Created: </ExperimentDetailsTitle>
                                    <ExperimentDetailsContent>{dateFormatter(new Date(task.receivedAt))}</ExperimentDetailsContent>
                                </ListItem>
                            </List>
                        </Grid>
                        <Grid item>
                            {
                                (task.taskStatus == TaskStatus.Pending ||
                                task.taskStatus == TaskStatus.Received ||
                                task.taskStatus == TaskStatus.Started) &&
                                <CancelTaskButton
                                    variant="outlined"
                                    size="small"
                                    color="error"
                                    onClick={handleCancelTask}
                                >Cancel</CancelTaskButton>}
                        </Grid>
                    </Grid>
                    <TabsBox
                        sx={{
                            borderBottom: 1,
                            borderColor: "divider",
                        }}
                    >
                        <Tabs variant="fullWidth" value={value} onChange={handleChangeTab}>
                            {taskDetailsItems.map((item) => (
                                <Tab
                                    key={item.title}
                                    label={item.title}
                                />
                            ))}
                        </Tabs>
                    </TabsBox>
                    <JobDetailsBox>
                        <Container>
                            {taskDetailsItems.map((item, index) => (
                                <TabPanel value={value} index={index} key={item.id}>
                                    <Grid
                                        container
                                        justifyContent="center"
                                        direction="column"
                                        sx={{ boxShadow: 1, borderRadius: "4px" }}
                                    >
                                        <Grid item sx={{ minHeight: "400px", position: "relative", pt: 2 }}>
                                            {item.component}
                                        </Grid>
                                    </Grid>
                                </TabPanel>
                            ))}
                        </Container>
                    </JobDetailsBox>
                </ModalMain>
            </ModalContainer>
        </Modal>
    );
}

export default JobDetailsModal;
