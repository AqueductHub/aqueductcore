import { Route, Routes } from "react-router-dom";
import { render } from "@testing-library/react";

import { selected_experiment } from "__mocks__/queries/getExperimentByIdMock";
import ExperimentDetailsPage from "pages/ExperimentDetailsPage";
import AppContextAQDMock from "__mocks__/AppContextAQDMock";

const ExtensionIncludedComponent = (
    <AppContextAQDMock memoryRouterProps={{ initialEntries: [`/aqd/experiments/${selected_experiment.id}`] }}>
        <Routes>
            <Route path="/aqd/experiments/:experimentIdentifier" element={<ExperimentDetailsPage />} />
        </Routes>
    </AppContextAQDMock >)

test("render page extensions with no error", async () => {
    render(ExtensionIncludedComponent)
});
