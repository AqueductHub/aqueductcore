import { ExperimentData, UserInfo } from "types/graphql/__GENERATED__/graphql"

const defined_scopes = {
    EXPERIMENT_VIEW_OWN: "experiment::view::own",
    EXPERIMENT_VIEW_ALL: "experiment::view::all",
    EXPERIMENT_EDIT_OWN: "experiment::edit::own",
    EXPERIMENT_EDIT_ALL: "experiment::edit::all",
    EXPERIMENT_DELETE_OWN: "experiment::delete::own",
    EXPERIMENT_DELETE_ALL: "experiment::delete::all",
    EXPERIMENT_CREATE_OWN: "experiment::create::own",
    JOB_VIEW_OWN: "job::view::own",
    JOB_VIEW_ALL: "job::view::all",
    JOB_CREATE: "job::create",
    JOB_CANCEL_OWN: "job::cancel::own",
    JOB_CANCEL_ALL: "job::cancel::all"
}

export function isUserAbleToEditExperiment(userInfo: UserInfo, createdBy: ExperimentData['createdBy']) {
    const isExperimentOwner = userInfo.username === createdBy
    for (const scope of userInfo.scopes) {
        if (
            scope === defined_scopes.EXPERIMENT_EDIT_ALL ||
            (scope === defined_scopes.EXPERIMENT_EDIT_OWN && isExperimentOwner)
        ) {
            return true
        }
    }
    return false
}

export function isUserAbleToDeleteExperiment(userInfo: UserInfo, createdBy: ExperimentData['createdBy']) {
    const isExperimentOwner = userInfo.username === createdBy
    for (const scope of userInfo.scopes) {
        if (
            scope === defined_scopes.EXPERIMENT_DELETE_ALL ||
            (scope === defined_scopes.EXPERIMENT_DELETE_OWN && isExperimentOwner)
        ) {
            return true
        }
    }
    return false
}

export function isUserAbleToCreateTask(userInfo: UserInfo) {
    for (const scope of userInfo.scopes) {
        if (scope === defined_scopes.JOB_CREATE) {
            return true
        }
    }
    return false
}

export function isUserAbleToCancelTask(userInfo: UserInfo, createdBy: ExperimentData['createdBy']) {
    const isExperimentOwner = userInfo.username === createdBy
    for (const scope of userInfo.scopes) {
        if (
            scope === defined_scopes.JOB_CANCEL_OWN ||
            (scope === defined_scopes.JOB_CANCEL_ALL && isExperimentOwner)
        ) {
            return true
        }
    }
    return false
}

export function isUserAbleToCreateTask(userInfo: UserInfo) {
    for (const item of userInfo.scopes) {
        if (item === defined_scopes.JOB_CREATE) {
            return true
        }
    }
    return false
}

export function isUserAbleToCancelTask(userInfo: UserInfo, createdBy: ExperimentData['createdBy']) {
    for (const item of userInfo.scopes) {
        if (
            item === defined_scopes.JOB_CANCEL_OWN ||
            item === defined_scopes.JOB_CANCEL_ALL && userInfo.username === createdBy
        ) {
            return true
        }
    }
    return false
}

