import { Navigate, Route, Routes } from "react-router-dom";
import { act, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { selected_experiment } from "__mocks__/queries/experiment/getExperimentByIdMock";
import ExperimentRecordsPage from "pages/ExperimentRecordsPage";
import ExperimentDetailsPage from "pages/ExperimentDetailsPage";
import AppContextAQDMock from "__mocks__/AppContextAQDMock";
import { dateFormatter } from "helper/formatters";

test("render page with no error", async () => {
    render(
        <AppContextAQDMock memoryRouterProps={{ initialEntries: [`/aqd/experiments/${selected_experiment.id}`] }}>
            <Routes>
                <Route path="/aqd/experiments/:experimentIdentifier" element={<ExperimentDetailsPage />} />
            </Routes>
        </AppContextAQDMock >)
});

test("render page with the experiment info", async () => {
    const { findByText } = render(
        <AppContextAQDMock memoryRouterProps={{ initialEntries: [`/aqd/experiments/${selected_experiment.id}`] }}>
            <Routes>
                <Route path="/aqd/experiments/:experimentIdentifier" element={<ExperimentDetailsPage />} />
            </Routes>
        </AppContextAQDMock >)
    const experiment_title = await findByText(selected_experiment.title);
    const experiment_desc = await findByText(String(selected_experiment.description));
    const experiment_createdBy = await findByText(selected_experiment.createdBy);
    const experiment_timeCreated = await findByText(dateFormatter(new Date(selected_experiment.createdAt)));

    expect(experiment_title).toBeInTheDocument();
    expect(experiment_desc).toBeInTheDocument();
    expect(experiment_createdBy).toBeInTheDocument();
    expect(experiment_timeCreated).toBeInTheDocument();
});

test("render page with the edit buttons as it's part of the scope", async () => {
    const { findByTitle, findAllByRole } = render(
        <AppContextAQDMock memoryRouterProps={{ initialEntries: [`/aqd/experiments/${selected_experiment.id}`] }}>
            <Routes>
                <Route path="/aqd/experiments/:experimentIdentifier" element={<ExperimentDetailsPage />} />
            </Routes>
        </AppContextAQDMock >)
    const experiment_edit_title = await findByTitle('Edit title')
    const tag_and_description_edit_buttons = await findAllByRole('button', {
        name: "Edit",
    })
    expect(experiment_edit_title).toBeInTheDocument()
    expect(tag_and_description_edit_buttons).toHaveLength(2)
});

test("render page when the edit is not allowed", async () => {
    const { queryByTitle, queryAllByRole } = render(
        <AppContextAQDMock getUserInformation_mockMockMode="viewOnlyAccess" memoryRouterProps={{ initialEntries: [`/aqd/experiments/${selected_experiment.id}`] }}>
            <Routes>
                <Route path="/aqd/experiments/:experimentIdentifier" element={<ExperimentDetailsPage />} />
            </Routes>
        </AppContextAQDMock >)

    await act(async () => {
        await new Promise((r) => setTimeout(r, 250)); //hint: 100 ms is not enough for the effect.
    })

    await waitFor(() => {
        const experiment_edit_title = queryByTitle('Edit title');
        const tag_and_description_edit_buttons = queryAllByRole('button', {
            name: "Edit",
        })
        expect(experiment_edit_title).not.toBeInTheDocument();
        expect(tag_and_description_edit_buttons.length).toBeLessThan(1)
    });
});

test("remove experiment button is present in archived experiments", async () => {
    const { findByText } = render(
        <AppContextAQDMock memoryRouterProps={{ initialEntries: [`/aqd/experiments/${selected_experiment.id}`] }}>
            <Routes>
                <Route path="/aqd/experiments/:experimentIdentifier" element={<ExperimentDetailsPage />} />
            </Routes>
        </AppContextAQDMock >);

    const deleteButton = await findByText("Delete");
    expect(deleteButton).toBeInTheDocument();
});

test("click on confirm deletion button results in experiment deletion", async () => {
    const { findByText, queryByText } = render(
        <AppContextAQDMock memoryRouterProps={{ initialEntries: [`/aqd/experiments/${selected_experiment.id}`] }}>
            <Routes>
                <Route path="/aqd/experiments/:experimentIdentifier" element={<ExperimentDetailsPage />} />
                <Route path="/aqd/experiments" element={<ExperimentRecordsPage />} />
                <Route path="/" element={<Navigate replace to="/aqd/experiments" />} />
            </Routes>
        </AppContextAQDMock >);

    const deleteButton = await findByText("Delete");
    await userEvent.click(deleteButton);

    const confirmDeletionButton = await findByText("Confirm Deletion"); // Confirm Deletion
    expect(confirmDeletionButton).toBeInTheDocument();

    await userEvent.click(confirmDeletionButton);

    await waitFor(() => {
        const deletedExperimentConfirmation = queryByText(/Successfully deleted experiment/);
        expect(deletedExperimentConfirmation).toBeInTheDocument();
    });
});

test("click on confirm fails for non existing experiment", async () => {
    const { findByText, queryByText } = render(
        <AppContextAQDMock memoryRouterProps={{ initialEntries: [`/aqd/experiments/${selected_experiment.id}`] }} removeExperiment_mockMockMode="failed">
            <Routes>
                <Route path="/aqd/experiments/:experimentIdentifier" element={<ExperimentDetailsPage />} />
                <Route path="/aqd/experiments" element={<ExperimentRecordsPage />} />
                <Route path="/" element={<Navigate replace to="/aqd/experiments" />} />
            </Routes>
        </AppContextAQDMock >);

    const deleteButton = await findByText("Delete");
    await userEvent.click(deleteButton);

    const confirmDeletionButton = await findByText("Confirm Deletion"); // Confirm Deletion
    expect(confirmDeletionButton).toBeInTheDocument();

    await userEvent.click(confirmDeletionButton);

    await waitFor(() => {
        const deletedExperimentConfirmation = queryByText(/Non-existing experiment with the specified ID for the user./);
        expect(deletedExperimentConfirmation).toBeInTheDocument();
    });
});
