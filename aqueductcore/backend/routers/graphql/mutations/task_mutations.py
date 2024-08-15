"""GraphQL mutation controller"""

from aqueductcore.backend.context import ServerContext
from aqueductcore.backend.errors import AQDValidationError
from aqueductcore.backend.routers.graphql.inputs import (
    CancelTaskInput,
    ExecuteExtensionInput,
    ExperimentIdentifierInput,
    IDType,
)
from aqueductcore.backend.routers.graphql.resolvers.experiment_resolver import (
    get_experiment,
)
from aqueductcore.backend.routers.graphql.types import TaskData
from aqueductcore.backend.routers.graphql.utils import task_model_to_node
from aqueductcore.backend.services.extensions_executor import ExtensionsExecutor
from aqueductcore.backend.services.task_executor import revoke_task


async def execute_extension(
    context: ServerContext, execute_extension_input: ExecuteExtensionInput
) -> TaskData:
    """Extension execution mutation."""

    experiment = await get_experiment(
        context,
        ExperimentIdentifierInput(
            type=IDType.UUID, value=str(execute_extension_input.experiment_uuid)
        ),
    )

    dict_params = dict(execute_extension_input.params)
    extension_object = ExtensionsExecutor.get_extension(execute_extension_input.extension)
    extension_object.aqueduct_api_token = context.user_info.token

    action_object = extension_object.get_action(execute_extension_input.action)
    exp_parameter = action_object.get_default_experiment_parameter()
    if exp_parameter is None:
        raise AQDValidationError(
            f"Action {execute_extension_input.extension}:{execute_extension_input.action}"
            " has no experiment parameters"
        )
    task = await ExtensionsExecutor.execute(
        user_info=context.user_info,
        db_session=context.db_session,
        experiment_uuid=execute_extension_input.experiment_uuid,
        extension=execute_extension_input.extension,
        action=execute_extension_input.action,
        params=dict_params,
    )

    return task_model_to_node(task, experiment)


async def cancel_task(context: ServerContext, cancel_task_input: CancelTaskInput) -> TaskData:
    """Cancel task mutation."""

    experiment = await get_experiment(
        context,
        ExperimentIdentifierInput(type=IDType.UUID, value=str(cancel_task_input.experiment_uuid)),
    )

    task = await revoke_task(
        user_info=context.user_info,
        db_session=context.db_session,
        task_id=str(cancel_task_input.task_id),
        terminate=True,
    )

    return task_model_to_node(task, experiment)
