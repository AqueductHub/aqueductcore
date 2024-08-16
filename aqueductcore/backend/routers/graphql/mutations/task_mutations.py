"""GraphQL mutation controller"""

from aqueductcore.backend.context import ServerContext
from aqueductcore.backend.routers.graphql.inputs import (
    CancelTaskInput,
    ExecuteExtensionInput,
)
from aqueductcore.backend.routers.graphql.types import TaskData, task_model_to_node
from aqueductcore.backend.services.extensions_executor import ExtensionsExecutor
from aqueductcore.backend.services.task_executor import revoke_task


async def execute_extension(
    context: ServerContext, execute_extension_input: ExecuteExtensionInput
) -> TaskData:
    """Extension execution mutation."""

    task = await ExtensionsExecutor.execute(
        user_info=context.user_info,
        db_session=context.db_session,
        experiment_uuid=execute_extension_input.experiment_uuid,
        extension=execute_extension_input.extension,
        action=execute_extension_input.action,
        params=dict(execute_extension_input.params),
    )

    return task_model_to_node(task)


async def cancel_task(context: ServerContext, cancel_task_input: CancelTaskInput) -> TaskData:
    """Cancel task mutation."""

    task = await revoke_task(
        user_info=context.user_info,
        db_session=context.db_session,
        task_id=str(cancel_task_input.task_id),
        terminate=True,
    )

    return task_model_to_node(task)
