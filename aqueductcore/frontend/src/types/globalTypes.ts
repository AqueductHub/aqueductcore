import {
  ExperimentFiltersInput,
  ExperimentData,
  ExperimentFile,
  Experiments,
  PluginInfo,
  UserInfo,
  Tags,
  PluginFunctionInfo,
  PluginParameterType,
} from "./graphql/__GENERATED__/graphql";

type NonNullish<T> = Exclude<T, null | undefined>; // Remove null and undefined from T

export type WithRequired<T, K extends keyof T> = T & {
  [P in K]-?: NonNullish<T[P]>;
};

export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;


//############### Query types ###############//
export type GET_ALL_EXPERIMENTS__TYPE = {
  experiments: {
    experimentsData: Array<{
      id: ExperimentDataType["id"];
      alias: ExperimentDataType["alias"];
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
    id: ExperimentDataType["id"];
    alias: ExperimentDataType["alias"];
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
export type GET_USER_INFO_TYPE = {
  getCurrentUserInfo: {
    scopes: UserInfo["scopes"]
    username: UserInfo["username"]
    __typename?: UserInfo["__typename"];
  };
};
export type GET_ALL_EXTENSIONS_NAME_TYPE = {
  plugins: Array<{
    name: ExtensionType['name']
    __typename?: PluginInfo["__typename"];
  }>;
};

//############### Mutation types ###############//
export type UPDATE_EXPERIMENT_DETAILS_TYPE = {
  id: ExperimentDataType["id"];
  alias: ExperimentDataType["alias"];
  title: ExperimentDataType["title"];
  description: ExperimentDataType["description"];
};
export type ADD_TAG_TO_EXPERIMENT_TYPE = {
  id: ExperimentDataType["id"];
  tags: ExperimentDataType["tags"];
};
export type REMOVE_TAG_FROM_EXPERIMENT_TYPE = {
  id: ExperimentDataType["id"];
  tags: ExperimentDataType["tags"];
};
export type REMOVE_EXPERIMENT_TYPE = {
  id: ExperimentDataType["id"];
}

//############### Experiment types ###############//
export type TagType = string;

export type TagsFieldProps = {
  tags: TagType[];
  selectedOptions: TagType[];
  handleTagUpdate: (value: TagType[]) => void;
  isEditable?: boolean,
};

export type ExperimentAllFieldsDataType = {
  id: ExperimentData["id"];
  alias: ExperimentData["alias"];
  title: ExperimentData["title"];
  description: ExperimentData["description"];
  tags: Array<TagType>;
  createdAt: ExperimentData["createdAt"];
  createdBy: ExperimentData["createdBy"];
  files: Array<ExperimentFileType>;
};

export type ExperimentDataType = {
  id: ExperimentData["id"];
  alias: ExperimentData["alias"];
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

export type ExtensionType = {
  name: PluginInfo['name']
  authors: PluginInfo['authors'],
  description: PluginInfo['description']
  functions: Array<ExtensionFunctionType>
};

export type ExtensionFunctionType = {
  name: PluginFunctionInfo['name']
  description: PluginFunctionInfo['description'],
  experimentVariableName: PluginFunctionInfo['experimentVariableName'],
  parameters: Array<ExtensionParameterType>,
};

export type ExtensionParameterType = {
  dataType: PluginParameterType['dataType']
  defaultValue: PluginParameterType['defaultValue']
  description: PluginParameterType['description']
  displayName: PluginParameterType['displayName']
  name: PluginParameterType['name']
  options: PluginParameterType['options']
};

export type PreviewFilesType = "JSON" | "MARKDOWN" | "text/plain" | "image/png" | "image/jpeg" | "file";
export type ExperimentRecordsPageType = "all" | "favourites" | "archived";

export interface ExperimentsListTableProps extends ExperimentDataType {
  star: boolean;
}

export interface PluginFieldBase {
  title: string,
  field: string,
  description?: string,
}

export interface ExperimentRecordsColumnsType {
  id: keyof ExperimentsListTableProps;
  label: string;
  minWidth?: number;
  maxWidth?: number;
  align?: "right" | "center";
  ellipsis?: boolean;
  format?: (value?: unknown) => string | React.ReactNode;
}
