"""tags_primary_key_change

Revision ID: a15889f46268
Revises: 0c7abaa9e2da
Create Date: 2023-11-28 16:13:31.937949

"""
from typing import Sequence, Union

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "a15889f46268"
down_revision: Union[str, None] = "0c7abaa9e2da"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column("experiment_tag", "experiment_id", existing_type=sa.UUID(), nullable=False)
    op.alter_column("user_experiment", "experiment_id", existing_type=sa.UUID(), nullable=False)
    op.alter_column("user_experiment", "user_id", existing_type=sa.UUID(), nullable=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # NO DOWNGRADE IS SUPPORTED ON THIS MIGRATION.
    pass
