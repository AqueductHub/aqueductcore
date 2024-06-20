import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { render } from "@testing-library/react";

import { selected_experiment } from "__mocks__/queries/experiment/getExperimentByIdMock";
import { ExtensionsDataMock } from "__mocks__/ExtensionsDataMock";
import { ExtensionParameterDataTypes } from "constants/constants";
import ExperimentDetailsPage from "pages/ExperimentDetailsPage";
import AppContextAQDMock from "__mocks__/AppContextAQDMock";
import { logFileName } from "__mocks__/constants";

function ExtensionIncludedComponent() {
    return (
        <AppContextAQDMock memoryRouterProps={{ initialEntries: [`/aqd/experiments/${selected_experiment.alias}`] }}>
            <Routes>
                <Route path="/aqd/experiments/:experimentIdentifier" element={<ExperimentDetailsPage />} />
            </Routes>
        </AppContextAQDMock >)
}

test("render page extensions with no error", async () => {
    render(<ExtensionIncludedComponent />)
});

test("list of extension in the dropdown when clicked", async () => {
    const { findByTitle, findByText } = render(<ExtensionIncludedComponent />)
    const extensionOpenModalButton = await findByTitle("extensions")
    await userEvent.click(extensionOpenModalButton)

    // Check extensions to be listed in the dropdown
    for (const extension of ExtensionsDataMock) {
        const extensionName = await findByText(extension.name);
        expect(extensionName).toBeInTheDocument();
    }
});

test("author's name in the modal", async () => {

    const { findByTitle, findByText } = render(<ExtensionIncludedComponent />)
    const extensionOpenModalButton = await findByTitle("extensions")
    await userEvent.click(extensionOpenModalButton)

    const first_extension = await findByText(ExtensionsDataMock[0].name);
    await userEvent.click(first_extension)

    const ExtensionAuthor = await findByText(ExtensionsDataMock[0].authors)
    expect(ExtensionAuthor).toBeInTheDocument()
});

test("list of actions in the extension", async () => {

    const { findByTitle, findByText } = render(<ExtensionIncludedComponent />)
    const extensionOpenModalButton = await findByTitle("extensions")
    await userEvent.click(extensionOpenModalButton)

    const first_extension = await findByText(ExtensionsDataMock[0].name);
    await userEvent.click(first_extension)

    // Check action names to be there
    for (const extensions_action of ExtensionsDataMock[0].actions) {
        const actionName = await findByText(extensions_action.name)
        expect(actionName).toBeInTheDocument();
    }
});

test("click the other action and params should be updated", async () => {

    const { findByTitle, findByText } = render(<ExtensionIncludedComponent />)
    const extensionOpenModalButton = await findByTitle("extensions")
    await userEvent.click(extensionOpenModalButton)

    const first_extension = await findByText(ExtensionsDataMock[0].name);
    await userEvent.click(first_extension)

    const second_action = await findByText(ExtensionsDataMock[0].actions[1].name);
    await userEvent.click(second_action)

    //TODO: fix missing cache for experiment name
    // Check params names to be there
    for (const actions_params of ExtensionsDataMock[0].actions[1].parameters
        .filter(param => param.dataType !== ExtensionParameterDataTypes.EXPERIMENT)) {
        const paramName = await findByText(actions_params.name)
        expect(paramName).toBeInTheDocument();
    }
});

test("submit the form and success modal and file selection", async () => {

    const { findByTitle, findByText, findAllByText } = render(<ExtensionIncludedComponent />)
    const extensionOpenModalButton = await findByTitle("extensions")
    await userEvent.click(extensionOpenModalButton)

    const first_extension = await findByText(ExtensionsDataMock[0].name);
    await userEvent.click(first_extension)

    const runButton = await findByTitle("run_extension");
    await userEvent.click(runButton)
    const successModal = await findByText("Execution finished successfully")
    expect(successModal).toBeInTheDocument()

    const file_name_items = await findAllByText(logFileName)
    expect(file_name_items).toHaveLength(2)
    //1- file being selected in the <Explorer />
    expect(file_name_items[0].parentNode).toHaveClass('Mui-selected')
    //1- file being opened in the <Viewer/>
    expect(file_name_items[1]).toHaveProperty('title', 'file_name')
});

