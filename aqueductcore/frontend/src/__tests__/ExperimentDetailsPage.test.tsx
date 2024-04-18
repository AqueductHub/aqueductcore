import { render } from "@testing-library/react";

import { selected_experiment } from "__mocks__/queries/getExperimentByIdMock";
import ExperimentDetailsPage from "pages/ExperimentDetailsPage";
import AppContextAQDMock from "__mocks__/AppContextAQDMock";
import { Route, Routes } from "react-router-dom";

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