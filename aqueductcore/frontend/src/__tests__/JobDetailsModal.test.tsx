import { render } from "@testing-library/react";

import JobDetailsModal from "components/organisms/JobDetailsModal";
import AppContextAQDMock from "__mocks__/AppContextAQDMock";
import { PendingTaskId, SampleTaskId } from "__mocks__/TasksDataMock";
import { useCancelTask } from "API/graphql/mutations/extension/cancelTask";
import userEvent from "@testing-library/user-event";

const mockHandleClose = jest.fn();

test("cancel button should not get rendered for failed task", async () => {
    const { queryByText } = render(
        <AppContextAQDMock>
            <JobDetailsModal isOpen={true} handleClose={mockHandleClose} taskId={SampleTaskId} />
        </AppContextAQDMock>
    );

    const cancelTaskButton = await queryByText("Cancel");
    expect(cancelTaskButton).not.toBeInTheDocument();
});

test("cancel button should not get rendered for failed task", async () => {
    const { findByText } = render(
        <AppContextAQDMock>
            <JobDetailsModal isOpen={true} handleClose={mockHandleClose} taskId={PendingTaskId} />
        </AppContextAQDMock>
    );

    const cancelTaskButton = await findByText("Cancel");
    expect(cancelTaskButton).toBeInTheDocument();
});

test("clicking on cancel task button cancels task", async () => {
    const { findByText } = render(
        <AppContextAQDMock>
            <JobDetailsModal isOpen={true} handleClose={mockHandleClose} taskId={PendingTaskId} />
        </AppContextAQDMock>
    );

    const cancelTaskButton = await findByText("Cancel");
    await userEvent.click(cancelTaskButton);
});
