import { ExperimentData, UserInfo } from "types/graphql/__GENERATED__/graphql"

const defined_scopes = {
    EXPERIMENT_VIEW_OWN: "experiment::view::own",
    EXPERIMENT_VIEW_ALL: "experiment::view::all",
    EXPERIMENT_EDIT_OWN: "experiment::edit::own",
    EXPERIMENT_EDIT_ALL: "experiment::edit::all",
    EXPERIMENT_DELETE_OWN: "experiment::delete::own",
    EXPERIMENT_DELETE_ALL: "experiment::delete::all",
    EXPERIMENT_CREATE_OWN: "experiment::create::own"
}

export function isUserAbleToEditExperiment(userInfo: UserInfo, createdBy: ExperimentData['createdBy']) {
    for (const item of userInfo.scopes) {
        if (
            item === defined_scopes.EXPERIMENT_EDIT_ALL ||
            item === defined_scopes.EXPERIMENT_EDIT_OWN && userInfo.username === createdBy
        ) {
            return true
        }
    }
    return false
}

export function isUserAbleToDeleteExperiment(userInfo: UserInfo, createdBy: ExperimentData['createdBy']) {
    for (const item of userInfo.scopes) {
        if (
            item === defined_scopes.EXPERIMENT_DELETE_ALL ||
            item === defined_scopes.EXPERIMENT_DELETE_OWN && userInfo.username === createdBy
        ) {
            return true
        }
    }
    return false
}

