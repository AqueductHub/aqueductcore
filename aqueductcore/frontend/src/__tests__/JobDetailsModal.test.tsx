import { render, waitFor } from "@testing-library/react";

import JobDetailsModal from "components/organisms/JobDetailsModal";
import AppContextAQDMock from "__mocks__/AppContextAQDMock";
import { PendingTaskId, SampleTaskId } from "__mocks__/TasksDataMock";
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

test("cancel button should get rendered for failed task", async () => {
    const { findByText } = render(
        <AppContextAQDMock>
            <JobDetailsModal isOpen={true} handleClose={mockHandleClose} taskId={PendingTaskId} />
        </AppContextAQDMock>
    );

    const cancelTaskButton = await findByText("Cancel");
    expect(cancelTaskButton).toBeInTheDocument();
});

test("clicking on cancel task button cancels task", async () => {
    const { queryByText, findByTitle } = render(
        <AppContextAQDMock>
            <JobDetailsModal isOpen={true} handleClose={mockHandleClose} taskId={PendingTaskId} />
        </AppContextAQDMock>
    );

    const cancelTaskButton = await findByTitle("cancelTask");
    expect(cancelTaskButton).toBeInTheDocument();
    
    await userEvent.click(cancelTaskButton);
    await userEvent.click(cancelTaskButton);

    await waitFor(() => {
        const cancelTaskConfirmationModalTitle = queryByText(/sure/)
        expect(cancelTaskConfirmationModalTitle).toBeInTheDocument();
    });

    const cancelTaskConfirmationButton = await findByTitle(/confirmCancelTask/)
    expect(cancelTaskConfirmationButton).toBeInTheDocument();

    await userEvent.click(cancelTaskConfirmationButton);

    await waitFor(() => {
        const cancelTaskConfirmationMessage = queryByText("Task cancelled successfully");
        expect(cancelTaskConfirmationMessage).toBeInTheDocument();
    });
});

test("clicking on cancel from confirmation modal closes modal", async () => {
    const { queryByText, findByTitle } = render(
        <AppContextAQDMock>
            <JobDetailsModal isOpen={true} handleClose={mockHandleClose} taskId={PendingTaskId} />
        </AppContextAQDMock>
    );

    const cancelTaskButton = await findByTitle("cancelTask");
    expect(cancelTaskButton).toBeInTheDocument();
    
    await userEvent.click(cancelTaskButton);
    await userEvent.click(cancelTaskButton);

    const cancelTaskConfirmationModalTitle = queryByText(/Are you sure you want to cancel this task ?/)
    expect(cancelTaskConfirmationModalTitle).toBeInTheDocument();

    const cancelTaskAbortButton = await findByTitle(/abortCancelTask/)
    expect(cancelTaskAbortButton).toBeInTheDocument();

    await userEvent.click(cancelTaskAbortButton);

    expect(cancelTaskConfirmationModalTitle).not.toBeInTheDocument();
});
