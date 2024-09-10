import { Box, Grid, List, ListItem, Modal, Tab, Tabs, Typography, styled } from "@mui/material"
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import { ReactNode, useState } from "react";

import JobExtensionStatus from "components/molecules/JobListTableCells/JobExtensionStatus";
import ActionParameters from "components/molecules/ActionParameters";
import LogViewer from "components/molecules/LogViewer";
import { dateFormatter } from "helper/formatters";
import { TaskType } from "types/globalTypes";
import { useGetTask } from "API/graphql/queries/tasks/getTask";

// const parameters: ExtensionsActionParameterType[] = [
//     {
//         "dataType": "str",
//         "defaultValue": "1",
//         "description": "variable 1",
//         "displayName": null,
//         "name": "var1",
//         "options": null
//     },
//     {
//         "dataType": "int",
//         "defaultValue": null,
//         "description": "variable 2",
//         "displayName": "some display name",
//         "name": "var2",
//         "options": null
//     },
//     {
//         "dataType": "float",
//         "defaultValue": null,
//         "description": "variable 3",
//         "displayName": null,
//         "name": "var3",
//         "options": null
//     },
//     {
//         "dataType": "experiment",
//         "defaultValue": null,
//         "description": "variable 4",
//         "displayName": null,
//         "name": "var4",
//         "options": null
//     },
//     {
//         "dataType": "textarea",
//         "defaultValue": null,
//         "description": "variable 5 multiline",
//         "displayName": null,
//         "name": "var5",
//         "options": null
//     },
//     {
//         "dataType": "bool",
//         "defaultValue": "1",
//         "description": "boolean variable",
//         "displayName": null,
//         "name": "var6",
//         "options": null
//     },
//     {
//         "dataType": "select",
//         "defaultValue": "string three",
//         "description": "select / combobox",
//         "displayName": null,
//         "name": "var7",
//         "options": [
//             "string1",
//             "string2",
//             "string three",
//             "string4"
//         ]
//     }
// ]

// const inputParams = [
//     { "name": "var4", "value": "240611-32" },
//     { "name": "var6", "value": "1" },
//     { "name": "var7", "value": "string three" },
//     { "name": "var1", "value": "string" },
//     { "name": "var2", "value": "123" },
//     { "name": "var3", "value": "123.456" },
//     { "name": "var5", "value": "multiline" }
// ]

const jobRunLog = `Process:               OpenVPN Driver [58878]
Path:                  /Applications/NordLayer.app/Contents/PlugIns/OpenVPN Driver.appex/Contents/MacOS/OpenVPN Driver
Identifier:            com.nordvpn.macos.teams.packetTunnelProvider
Version:               3.5.0 (637)
App Item ID:           1488888843
App External ID:       867475105
Code Type:             ARM-64 (Native)
Parent Process:        launchd [1]
User ID:               501

Date/Time:             2024-07-30 16:04:25.0854 +0100
OS Version:            macOS 14.3.1 (23D60)
Report Version:        12
Anonymous UUID:        E2278324-231C-F87F-B352-E3E268C448D6

Sleep/Wake UUID:       26469B16-F200-4A24-ABA6-0D34CEB2988B

Time Awake Since Boot: 120000 seconds
Time Since Wake:       15 seconds

System Integrity Protection: enabled

Crashed Thread:        3

Exception Type:        EXC_BREAKPOINT (SIGTRAP)
`;

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

    const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const { data } = useGetTask({
        variables: {
            taskId
        },
    })
    const task = data?.task

    if (!task) return <></>

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
        <Modal open={isOpen}>
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
