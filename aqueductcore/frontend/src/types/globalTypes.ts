import {
  ExperimentFiltersInput,
  ExtensionParameterType,
  ExtensionActionInfo,
  ExperimentData,
  ExperimentFile,
  Experiments,
  ExtensionInfo,
  UserInfo,
  TaskData,
  Tags,
  KeyValuePair,
} from "./graphql/__GENERATED__/graphql";

type NonNullish<T> = Exclude<T, null | undefined>; // Remove null and undefined from T

export type WithRequired<T, K extends keyof T> = T & {
  [P in K]-?: NonNullish<T[P]>;
};

export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;


//############### Query types ###############//
//### EXPERIMENT ###
export type GET_ALL_EXPERIMENTS_TYPE = {
  experiments: {
    experimentsData: Array<{
      uuid: ExperimentDataType["uuid"];
      eid: ExperimentDataType["eid"];
      title: ExperimentDataType["title"];
      description: ExperimentDataType["description"];
      tags: Array<TagType>;
      createdAt: ExperimentDataType["createdAt"];
      createdBy: ExperimentDataType["createdBy"];
      __typename?: ExperimentData["__typename"];
    }>;
    totalExperimentsCount: number;
    __typename?: Experiments["__typename"];
  };
};
export type GET_ALL_TAGS_TYPE = {
  tags: {
    tagsData: Array<TagType>;
    __typename?: Tags["__typename"];
  };
};
export type GET_EXPERIMENT_BY_ID_TYPE = {
  experiment: {
    uuid: ExperimentDataType["uuid"];
    eid: ExperimentDataType["eid"];
    title: ExperimentDataType["title"];
    description: ExperimentDataType["description"];
    tags: Array<TagType>;
    createdAt: ExperimentDataType["createdAt"];
    createdBy: ExperimentDataType["createdBy"];
    files: Array<{
      name: ExperimentFileType["name"];
      path: ExperimentFileType["path"];
      modifiedAt: ExperimentFileType["modifiedAt"];
      __typename?: ExperimentFile["__typename"];
    }>;
    __typename?: ExperimentData["__typename"];
  };
};
export type GET_EXPERIMENT_FILES_BY_ID_TYPE = {
  experiment: {
    files: Array<{
      name: ExperimentFileType["name"];
      path: ExperimentFileType["path"];
      modifiedAt: ExperimentFileType["modifiedAt"];
      __typename?: ExperimentFile["__typename"];
    }>;
    __typename?: ExperimentData["__typename"];
  };
};
//### USER ###
export type GET_USER_INFO_TYPE = {
  getCurrentUserInfo: {
    scopes: UserInfo["scopes"]
    username: UserInfo["username"]
    __typename?: UserInfo["__typename"];
  };
};
//### EXTENSION ###
export type GET_ALL_EXTENSIONS_NAME_TYPE = {
  extensions: Array<{
    name: ExtensionType['name']
    __typename?: ExtensionInfo["__typename"];
  }>;
};
export type GET_ALL_EXTENSIONS_TYPE = {
  extensions: Array<ExtensionType>;
};

//### TASKS ###
export type GET_ALL_TASKS_TYPE = {
  tasks: {
    tasksData: Array<TaskType>
    totalTasksCount: number;
  }
  __typename?: TaskData['__typename'];
};
export type GET_TASK_TYPE = {
  task: TaskWithParamsType
  __typename?: TaskData['__typename'];
};


//############### Mutation types ###############//
//### EXPERIMENT ###
export type UPDATE_EXPERIMENT_DETAILS_TYPE = {
  uuid: ExperimentDataType["uuid"];
  eid: ExperimentDataType["eid"];
  title: ExperimentDataType["title"];
  description: ExperimentDataType["description"];
};
export type ADD_TAG_TO_EXPERIMENT_TYPE = {
  uuid: ExperimentDataType["uuid"];
  tags: ExperimentDataType["tags"];
};
export type REMOVE_TAG_FROM_EXPERIMENT_TYPE = {
  uuid: ExperimentDataType["uuid"];
  tags: ExperimentDataType["tags"];
};
export type REMOVE_EXPERIMENT_TYPE = {
  uuid: ExperimentDataType["uuid"];
}
export type CREATE_EXPERIMENT_TYPE = {
  eid: ExperimentDataType["eid"];
}
//### EXTENSION ###
export type EXECUTE_EXTENSION_TYPE = {
  actionName: TaskData['actionName']
  endedTime: TaskData['endedAt']
  experiment: TaskData['experiment']
  extensionName: TaskData['extensionName']
  parameters: TaskData['parameters']
  receiveAt: TaskData['receivedAt']
  resultCode: TaskData['resultCode']
  stdErr: TaskData['stdErr']
  stdOut: TaskData['stdOut']
  taskId: TaskData['taskId']
  taskStatus: TaskData['taskStatus']
}

export type CANCEL_TASK_TYPE = {
  taskId: TaskData['taskId']
  resultCode: TaskData['resultCode']
  taskStatus: TaskData['taskStatus']
}

//############### Other types ###############//
//### EXPERIMENT ###
export type TagType = string;
export type TagsFieldProps = {
  tags: TagType[];
  selectedOptions: TagType[];
  handleTagUpdate: (value: TagType[]) => void;
  isEditable?: boolean,
};
export type ExperimentAllFieldsDataType = {
  uuid: ExperimentData["uuid"];
  eid: ExperimentData["eid"];
  title: ExperimentData["title"];
  description: ExperimentData["description"];
  tags: Array<TagType>;
  createdAt: ExperimentData["createdAt"];
  createdBy: ExperimentData["createdBy"];
  files: Array<ExperimentFileType>;
};
export type ExperimentDataType = {
  uuid: ExperimentData["uuid"];
  eid: ExperimentData["eid"];
  title: ExperimentData["title"];
  description: ExperimentData["description"];
  tags: Array<TagType>;
  createdAt: ExperimentData["createdAt"];
  createdBy: ExperimentData["createdBy"];
};
export type ExperimentFiltersType = {
  endDate?: ExperimentFiltersInput["endDate"];
  startDate?: ExperimentFiltersInput["startDate"];
  tags?: ExperimentFiltersInput["tags"];
  shouldIncludeTags?: ExperimentFiltersInput["shouldIncludeTags"];
  title?: ExperimentFiltersInput["title"];
};
export type ExperimentFileType = {
  name: ExperimentFile["name"];
  path: ExperimentFile["path"];
  modifiedAt: ExperimentFile["modifiedAt"];
};
export type TaskDataType = {
  experiment: {
    title: ExperimentData['title']
    eid: ExperimentData['eid']
  };
  extension: {
    name: ExtensionInfo['name']
    action: ExtensionActionInfo['name']
  };
  taskId: TaskType['taskId']
  taskStatus: TaskType['taskStatus'];
  receivedAt: TaskData['receivedAt'];
  createdBy: TaskData['createdBy'];
};
export interface ExperimentRecordsColumnsType {
  id: keyof ExperimentsListTableProps;
  label: string;
  minWidth?: number;
  maxWidth?: number;
  align?: "right" | "center";
  ellipsis?: boolean;
  format?: (value?: unknown) => string | React.ReactNode;
}
export interface TasksListColumnsType {
  id: keyof TaskDataType;
  label: string;
  minWidth?: number;
  maxWidth?: number;
  align?: "right" | "center";
  ellipsis?: boolean;
  format?: (value?: unknown) => string | React.ReactNode;
}
export type ExperimentRecordsPageType = "all" | "favourites" | "archived";
export type PreviewFilesType = "JSON" | "HTML" | "MARKDOWN" | "text/plain" | "image/png" | "image/jpeg" | "file";
export interface ExperimentsListTableProps extends ExperimentDataType {
  star: boolean;
}
//### EXTENSION ###

export type ExtensionType = {
  name: ExtensionInfo['name']
  authors: ExtensionInfo['authors'],
  description: ExtensionInfo['description']
  actions: Array<ExtensionActionType>
};
export type ExtensionActionType = {
  name: ExtensionActionInfo['name']
  description: ExtensionActionInfo['description'],
  experimentVariableName: ExtensionActionInfo['experimentVariableName'],
  parameters: Array<ExtensionsActionParameterType>,
};
export type ExtensionsActionParameterType = {
  dataType: ExtensionParameterType['dataType']
  defaultValue: ExtensionParameterType['defaultValue']
  description: ExtensionParameterType['description']
  displayName: ExtensionParameterType['displayName']
  name: ExtensionParameterType['name']
  options: ExtensionParameterType['options']
};
export interface ExtensionFieldBase {
  title: string,
  field: string,
  description?: string,
}
//### TASKS ###
export interface TaskType {
  extensionName: TaskData['extensionName']
  actionName: TaskData['actionName']
  taskStatus: TaskData['taskStatus']
  receivedAt: TaskData['receivedAt']
  resultCode: TaskData['resultCode']
  stdOut: TaskData['stdOut']
  stdErr: TaskData['stdErr']
  taskId: TaskData['taskId']
  createdBy: TaskData['createdBy']
  experiment: {
    uuid: ExperimentData['uuid']
    title: ExperimentData['title']
    eid: ExperimentData['eid']
  }
}
export interface TaskWithParamsType extends TaskType {
  parameters: Array<{
    key: ParamsType,
    value: KeyValuePair['value']
  }>
}
export interface ParamsType {
  dataType: ExtensionParameterType['dataType']
  name: ExtensionParameterType['name']
  displayName: ExtensionParameterType['displayName']
  defaultValue: ExtensionParameterType['defaultValue']
  description: ExtensionParameterType['description']
  options: ExtensionParameterType['options']
}

