// ########## CSS constants ########## //
export const ANIMATION_TIMEOUT = 250; //ms

// Debounce length
export const DEBOUNCE_DELAY = 250; //ms

// ########## Aqueduct ########## //
// Pagination for Experiment Records
export const experimentRecordsRowsPerPageOptions = [10, 25, 100];
// Pagination for Tasks List
export const taskListRowsPerPageOptions = [10, 25, 100];
// Pagination for Tasks List in experiment details page
export const taskListRowsPerPageOptionsInExperimentDetailsPage = [3];

export const FAVOURITE = "__favourite__";
export const ARCHIVED = "__archived__";
export const MAX_TAGS_VISIBLE_LENGTH = 3;

//Extension
export const ExtensionParameterDataTypes = {
    STR: "str",
    INT: "int",
    FLOAT: "float",
    EXPERIMENT: "experiment",
    TEXTAREA: "textarea",
    BOOL: "bool",
    SELECT: "select",
    FILE: "file"
}
