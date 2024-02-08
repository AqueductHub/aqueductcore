"""remove tag id from the relation.

Revision ID: 0c7abaa9e2da
Revises: 519343a37f5b
Create Date: 2023-11-28 12:15:05.227155

"""
from typing import Sequence, Union

import sqlalchemy as sa
from sqlalchemy import text

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "0c7abaa9e2da"
down_revision: Union[str, None] = "519343a37f5b"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("tag", sa.Column("key", sa.String(), nullable=True, unique=True))

    bind = op.get_bind()
    bind.execute(text("UPDATE tag SET key = LOWER(name)"))
    op.alter_column("tag", "key", nullable=False)

    op.drop_constraint("experiment_tag_tag_id_fkey", "experiment_tag", type_="foreignkey")
    op.add_column("experiment_tag", sa.Column("tag_key", sa.String(), nullable=True))

    bind.execute(
        text(
            "UPDATE experiment_tag \
            SET tag_key = tag.key \
            FROM tag \
            WHERE experiment_tag.tag_id = tag.id"
        )
    )

    op.alter_column("experiment_tag", "tag_key", nullable=False)
    op.drop_column("experiment_tag", "tag_id")

    op.drop_constraint("tag_name_key", "tag", type_="unique")
    op.drop_column("tag", "id")
    op.create_foreign_key(None, "experiment_tag", "tag", ["tag_key"], ["key"])


def downgrade() -> None:
    # NO DOWNGRADE IS SUPPORTED ON THIS MIGRATION.
    pass
