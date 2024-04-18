import { Route, Routes } from "react-router-dom";
import { act, render, screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react";

import { selected_experiment } from "__mocks__/queries/getExperimentByIdMock";
import ExperimentDetailsPage from "pages/ExperimentDetailsPage";
import AppContextAQDMock from "__mocks__/AppContextAQDMock";

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

    expect(experiment_title).toBeInTheDocument();
    expect(experiment_desc).toBeInTheDocument();
    expect(experiment_createdBy).toBeInTheDocument();
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

test.only("render page when the edit is not allowed", async () => {
    const { queryByTitle, queryAllByRole } = render(
        <AppContextAQDMock getUserInformation_mockMockMode="viewOnlyAccess" memoryRouterProps={{ initialEntries: [`/aqd/experiments/${selected_experiment.id}`] }}>
            <Routes>
                <Route path="/aqd/experiments/:experimentIdentifier" element={<ExperimentDetailsPage />} />
            </Routes>
        </AppContextAQDMock >)
    await new Promise((r) => setTimeout(r, 250)); //hint: 100 ms is not enough for the effect.
    await waitFor(() => {
        const experiment_edit_title = queryByTitle('Edit title');
        const tag_and_description_edit_buttons = queryAllByRole('button', {
            name: "Edit",
        })
        expect(experiment_edit_title).not.toBeInTheDocument();
        expect(tag_and_description_edit_buttons.length).toBeLessThan(1)
    });
});